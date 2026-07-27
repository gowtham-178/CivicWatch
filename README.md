# CivicWatch - Community Issue Reporting & AI RAG Platform

![CivicWatch](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.2.0-orange)
![Python RAG](https://img.shields.io/badge/RAG%20Microservice-FastAPI%20%2B%20Gemini-blueviolet)
![Docker](https://img.shields.io/badge/Containerized-Docker%20%26%20Render-blue)

A modern, full-stack microservice platform that empowers communities to report, track, and resolve civic issues in real-time. Enhanced with an **AI RAG (Retrieval-Augmented Generation)** microservice powered by **Google Gemini LLM** and **TF-IDF Vector Search**.

---

## 🎯 Key Features

### 🤖 AI RAG Microservice (`rag-model`)
- 🤖 **Constrained LLM Auto-Categorization**: Automatically categorizes reported issues strictly against active MongoDB categories using Google Gemini LLM.
- 🔍 **RAG Knowledge Search**: Answers factual municipal queries using context retrieved directly from report records.
- ⚡ **Fallback Vector Engine**: Uses Scikit-Learn TF-IDF cosine similarity scoring when LLM keys are absent or during API timeouts.
- 🛡️ **Production-Hardened**: Features non-root unprivileged process execution, connection pooling, and `/health` and `/ready` probes.

### 👥 For Citizens & Administrators
- 📝 **Detailed Reporting**: Submit community issues with photos, priority ratings, and location coordinates.
- 🗺️ **Interactive Map View**: Pinpoint issues on a geographic map with coordinate fallback logic.
- 📊 **Analytics Dashboard**: Interactive charts and data visualizations (Recharts) for issue resolution metrics.
- 💬 **Community Engagement**: Comment sections and upvote mechanics on public reports.

---

## 🏗️ Project Architecture

```
CivicWatch/
├── rag-model/              # Python RAG Microservice (FastAPI + Gemini + Scikit-Learn)
│   ├── main.py            # FastAPI service entrypoint & RAG endpoints
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Production Python 3.11 container
│   ├── .dockerignore
│   └── .env.example
│
├── server/                 # Backend API (Node.js/Express)
│   ├── src/               # Controllers, models, routes, and middleware
│   ├── Dockerfile         # Production Node 18 container
│   ├── .dockerignore
│   └── .env.example
│
├── client/                 # Frontend Web App (React)
│   ├── src/               # React components, context, and pages
│   ├── nginx.conf         # Production Nginx SPA routing & security headers
│   ├── Dockerfile         # Multi-stage Nginx container
│   └── .dockerignore
│
├── docker-compose.yml      # Local multi-container orchestration
└── render.yaml             # One-click Render Blueprint deployment
```

---

## 🚀 Quick Start (Local & Docker)

### Option 1: Run Full Stack with Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CivicWatch
   ```

2. **Start all container services**
   ```bash
   docker compose up --build
   ```
   * **Frontend**: [http://localhost:3000](http://localhost:3000)
   * **Backend API**: [http://localhost:5000](http://localhost:5000)
   * **RAG Microservice**: [http://localhost:8000](http://localhost:8000) (Docs at `/docs`)

---

### Option 2: Manual Local Setup

#### 1. RAG Microservice (`rag-model`)
```bash
cd rag-model
pip install -r requirements.txt
cp .env.example .env
python main.py
```

#### 2. Backend Server (`server`)
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

#### 3. Frontend Web App (`client`)
```bash
cd client
npm install
npm run start
```

---

## 📧 OTP Email Service Setup

CivicWatch handles email dispatch via **Google App Passwords** (using `nodemailer`) with an automatic terminal log fallback in `server/src/utils/otp.js`:

1. **Google App Passwords (Gmail SMTP)**
   - Enable 2-Step Verification on your Google Account.
   - Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - Add to `server/.env`:
     ```env
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASSWORD=your_16_character_app_password
     ```

2. **Console Log Fallback (Instant Local Testing)**
   - If no credentials are configured in `.env`, the server prints the 6-digit verification code directly to the backend terminal:
     ```text
     [EMAIL FALLBACK] OTP Code for citizen@example.com is: 123456
     ```

---

## 🔌 API Endpoints Summary

### RAG Microservice (`/api`)
* `GET /health` — Liveness health check probe.
* `GET /ready` — Readiness probe (database connectivity ping).
* `POST /api/categorize` — Constrained LLM & vector categorization.
* `POST /api/rag-query` — RAG vector search & generative summary.

### Backend Authentication & Management (`/api`)
* `POST /auth/signup` — Register citizen account.
* `POST /auth/verify-otp` — Verify email OTP.
* `POST /auth/login` — Log in user.
* `POST /admin-auth/login` — Log in administrator.
* `GET /reports` — Search & list reports.
* `POST /reports` — Submit new report.

---

## ☁️ Deployment (Render)

This repository includes a [render.yaml](file:///d:/Projects/CivicWatch/render.yaml) blueprint for automated deployment on Render.

1. Connect your repository in [Render Dashboard](https://dashboard.render.com/).
2. Select **New +** → **Blueprint**.
3. Render automatically provisions the **RAG Microservice**, **Backend API**, and **Frontend App**.
4. Configure environment variables (`MONGODB_URI`, `GEMINI_API_KEY`, `JWT_SECRET`) in the Render Dashboard.

---

## 🔒 Security & Quality Standards

* **Unprivileged Containers**: All Docker containers execute using non-root system users (`USER appuser`, `USER node`).
* **Secret Protection**: All environment secrets (`.env`, `.env.local`, `.env.production`) are excluded via [.gitignore](file:///d:/Projects/CivicWatch/.gitignore).
* **Health Probes**: Automated `HEALTHCHECK` instructions configured across microservices.
* **SPA Routing & Security**: Nginx configured with `try_files` SPA routing, gzip compression, and security headers (`X-Frame-Options`, `X-Content-Type-Options`).

---

**Made with ❤️ for community improvement**
