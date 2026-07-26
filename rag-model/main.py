import os
import re
import json
import logging
from contextlib import asynccontextmanager
from typing import List, Optional
import numpy as np

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
import google.generativeai as genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("rag_service")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/civicwatch")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")
CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]

mongo_client: Optional[MongoClient] = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global mongo_client, db
    logger.info("Connecting to MongoDB...")
    try:
        mongo_client = MongoClient(
            MONGODB_URI,
            maxPoolSize=50,
            minPoolSize=5,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        try:
            db = mongo_client.get_default_database()
            if db is None:
                db = mongo_client["civicwatch"]
        except Exception:
            db = mongo_client["civicwatch"]
        
        mongo_client.admin.command("ping")
        logger.info("Connected to MongoDB.")
    except Exception as e:
        logger.error(f"MongoDB connection failure: {e}")

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Google Gemini LLM Configured.")
    else:
        logger.warning("GEMINI_API_KEY missing. Using fallback vector similarity mode.")

    yield

    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB client closed.")

app = FastAPI(
    title="CivicWatch Python RAG Microservice",
    description="Microservice for Municipal Issue Categorization and RAG Search",
    version="1.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CategorizeRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=300)
    description: str = Field(..., min_length=5, max_length=4000)
    location: Optional[str] = Field(None, max_length=300)

class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    top_k: Optional[int] = Field(5, ge=1, le=20)

def compute_text_similarity(query_text: str, document_texts: List[str]) -> List[float]:
    if not document_texts:
        return []
    corpus = document_texts + [query_text]
    vectorizer = TfidfVectorizer(stop_words='english').fit_transform(corpus)
    vectors = vectorizer.toarray()
    
    query_vector = vectors[-1].reshape(1, -1)
    doc_vectors = vectors[:-1]
    
    similarities = cosine_similarity(query_vector, doc_vectors)[0]
    return similarities.tolist()

@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CivicWatch Python RAG Service",
        "version": "1.1.0",
        "environment": ENVIRONMENT
    }

@app.get("/ready", tags=["Health"])
def readiness_check():
    if mongo_client is None or db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database client not initialized"
        )
    try:
        mongo_client.admin.command("ping")
        db_status = "connected"
    except Exception as e:
        logger.error(f"Readiness ping failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unreachable: {str(e)}"
        )
    
    return {
        "status": "ready",
        "database": db_status,
        "llm_configured": bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")
    }

@app.post("/api/categorize", tags=["RAG Services"])
def categorize_report(req: CategorizeRequest):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    category_names = []
    try:
        categories_col = db["categories"]
        active_docs = list(categories_col.find({"isActive": True}))
        category_names = [c["name"] for c in active_docs if "name" in c]
    except Exception as e:
        logger.error(f"Error fetching active categories: {e}")

    if not category_names:
        category_names = ["General"]

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
You are an AI assistant for a municipal issue reporting system.
Categorize the following report. Select 1 or 2 categories STRICTLY from this list:

Allowed Categories: {json.dumps(category_names)}

Report Details:
- Title: "{req.title}"
- Description: "{req.description}"
- Location: "{req.location or 'N/A'}"

Select priority from: ["Low", "Medium", "High", "Critical"]

Respond ONLY in valid JSON format:
{{
  "categories": ["SelectedCategory"],
  "priority": "Medium",
  "reasoning": "Short justification"
}}
"""
            response = model.generate_content(prompt)
            match = re.search(r'\{[\s\S]*\}', response.text)
            if match:
                data = json.loads(match.group(0))
                valid_cats = [c for c in data.get("categories", []) if c in category_names]
                priority = data.get("priority", "Medium")
                if priority not in ["Low", "Medium", "High", "Critical"]:
                    priority = "Medium"
                
                return {
                    "categories": valid_cats if valid_cats else [category_names[0]],
                    "priority": priority,
                    "reasoning": data.get("reasoning", "LLM categorization completed."),
                    "engine": "Python Gemini LLM"
                }
        except Exception as e:
            logger.error(f"Gemini LLM error: {e}")

    try:
        cat_texts = [f"{c.get('name','')} {c.get('description','')}" for c in active_docs] if 'active_docs' in locals() and active_docs else category_names
        scores = compute_text_similarity(f"{req.title} {req.description}", cat_texts)
        best_index = int(np.argmax(scores)) if scores else 0
        selected_category = category_names[best_index] if best_index < len(category_names) else category_names[0]
    except Exception as e:
        logger.error(f"TF-IDF similarity error: {e}")
        selected_category = category_names[0]

    return {
        "categories": [selected_category],
        "priority": "Medium",
        "reasoning": f"Matched to active category '{selected_category}' using TF-IDF similarity engine.",
        "engine": "Python Vector Index"
    }

@app.post("/api/rag-query", tags=["RAG Services"])
def rag_query(req: RAGQueryRequest):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not available")

    reports = []
    try:
        reports_col = db["reports"]
        reports = list(reports_col.find({}).sort("createdAt", -1).limit(100))
    except Exception as e:
        logger.error(f"Error fetching reports: {e}")

    if not reports:
        return {
            "answer": "No reports found in the database to answer your query.",
            "citedReports": [],
            "retrievedCount": 0,
            "engine": "Python RAG"
        }

    doc_texts = []
    for r in reports:
        text = f"{r.get('title','')} {r.get('description','')} {r.get('location',{}).get('address','')} {' '.join(r.get('category',[]))} {r.get('status','')}"
        doc_texts.append(text)

    scores = compute_text_similarity(req.query, doc_texts)
    scored_reports = list(zip(reports, scores))
    scored_reports.sort(key=lambda x: x[1], reverse=True)

    top_matches = [item[0] for item in scored_reports[:req.top_k] if item[1] > 0.01 or scored_reports.index(item) < 2]

    context_lines = []
    for idx, r in enumerate(top_matches):
        categories_str = ", ".join(r.get("category", []))
        context_lines.append(
            f"Report #{idx+1}:\n"
            f"- Title: {r.get('title')}\n"
            f"- Status: {r.get('status')}\n"
            f"- Priority: {r.get('priority')}\n"
            f"- Category: {categories_str}\n"
            f"- Location: {r.get('location', {}).get('address', 'N/A')}\n"
            f"- Description: {r.get('description')}\n"
        )
    context = "\n---\n".join(context_lines)

    answer = ""
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here" and top_matches:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
You are CivicWatch AI, an assistant for municipal issue tracking.
Answer the question using ONLY the provided municipal report records:

Retrieved Context:
{context}

User Question: "{req.query}"

Provide a concise, factual answer.
"""
            response = model.generate_content(prompt)
            answer = response.text
        except Exception as e:
            logger.error(f"RAG LLM Error: {e}")
            answer = f"Retrieved {len(top_matches)} relevant report(s) matching your query."
    else:
        answer = f"Retrieved {len(top_matches)} relevant report(s) matching your query."

    cleaned_reports = []
    for r in top_matches:
        r["_id"] = str(r["_id"])
        if "submittedBy" in r and not isinstance(r["submittedBy"], str):
            r["submittedBy"] = str(r["submittedBy"])
        if "createdAt" in r:
            r["createdAt"] = str(r["createdAt"])
        if "updatedAt" in r:
            r["updatedAt"] = str(r["updatedAt"])
        cleaned_reports.append(r)

    return {
        "answer": answer,
        "citedReports": cleaned_reports,
        "retrievedCount": len(cleaned_reports),
        "engine": "Python RAG + Gemini" if GEMINI_API_KEY else "Python RAG Vector Search"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)