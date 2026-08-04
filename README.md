# CivicWatch - Smart Community Issue Reporting & AI RAG Platform

![CivicWatch](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Civic%20Tech-blue)
![Version](https://img.shields.io/badge/Version-1.2.0-orange)
![AI Engine](https://img.shields.io/badge/AI%20Engine-FastAPI%20%2B%20Gemini%20RAG-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

**CivicWatch** is a next-generation, full-stack civic engagement platform that bridges the communication gap between citizens and local municipal authorities. By leveraging real-time geo-location reporting, community collaboration, and an intelligent **AI Retrieval-Augmented Generation (RAG)** microservice, CivicWatch empowers communities to identify, report, track, and resolve local infrastructure and public safety issues efficiently.

---

## 🌟 Vision & Core Purpose

Urban infrastructure challenges—such as damaged roads, broken streetlights, illegal dumping, and water leakages—often suffer from delayed resolution due to fragmented reporting systems, manual triage bottlenecks, and lack of public visibility.

CivicWatch solves these problems by providing:
- **Transparent Public Reporting**: A central digital portal where citizens submit geo-tagged issue reports with visual proof.
- **AI-Driven Automated Triage**: An intelligent backend that automatically categorizes incoming reports, assesses priority, and enables search over historical municipal data.
- **Data-Driven Administration**: Interactive visual dashboards enabling municipal authorities to monitor resolution metrics, manage department workloads, and deploy resources effectively.

---

## ✨ Key Application Features

```
+-----------------------------------------------------------------------------------+
|                                  CIVICWATCH                                       |
+---------------------------+---------------------------+---------------------------+
|      Citizen Portal       |    Admin Command Center   |      AI RAG Service       |
| • Geo-Tagged Submissions  | • Issue Triage & Status   | • Auto-Categorization     |
| • Photo & Map Integration | • Department Assignments  | • Semantic Vector Search  |
| • Upvotes & Discussions   | • Visual Analytics        | • Municipal Q&A RAG       |
| • Personal Progress Tracking| • User Management       | • Hybrid TF-IDF Fallback  |
+---------------------------+---------------------------+---------------------------+
```

### 👥 1. Citizen Portal & Public Engagement
* **Secure Authentication**: Email-based registration with encrypted password storage to eliminate spam reports and ensure community accountability.
* **Geo-Tagged Reporting**: Submit comprehensive issue reports featuring titles, descriptions, category tagging, priority indicators, photo evidence, and exact map location coordinates.
* **Interactive Map Explorer**: View neighborhood issues plotted on an interactive map, enabling residents to spot nearby hazards and avoid duplicate reporting.
* **Community Upvoting & Discussion**: Citizens can upvote high-priority issues to signal community urgency, as well as participate in public comment threads to provide real-time updates.
* **Personal Report Tracker**: Dedicated user dashboard to monitor the status lifecycle (*Pending*, *In Progress*, *Resolved*, *Rejected*) of submitted reports with notifications.

### 👑 2. Municipal Authority & Admin Command Center
* **Centralized Issue Management**: Search, filter, and review submitted reports with tools to assign issues to specific city departments.
* **Lifecycle Workflow Management**: Update issue status in real-time as field teams inspect, work on, and resolve reported problems.
* **Interactive Visual Analytics**: Comprehensive analytics dashboard (powered by Recharts) featuring charts on:
  - Overall resolution rates and status distributions.
  - Category breakdown (e.g., Roads, Electrical, Sanitation, Public Safety).
  - Department workload distribution and team responsiveness metrics.
* **User & Access Governance**: Review registered user accounts, manage user roles, and enforce administrative security policies.

### 🤖 3. Intelligent AI RAG Microservice Engine
CivicWatch integrates a Python-based **AI RAG (Retrieval-Augmented Generation)** microservice powered by **Google Gemini LLM** and **TF-IDF Vector Search**:
* **Constrained LLM Auto-Categorization**: Automatically analyzes user report text and context to categorize issues strictly against active municipal database categories.
* **RAG Municipal Knowledge Assistant**: Answers complex queries from citizens and administrators by retrieving context directly from past issue logs and knowledge records (e.g., *"What are the most frequent road maintenance issues in Ward 4?"*).
* **Hybrid Vector Fallback**: Uses Scikit-Learn TF-IDF cosine similarity scoring to ensure continuous service availability even during external API downtime or key restrictions.

---

## 🔄 End-to-End Issue Lifecycle

```
[ Citizen Report ] ➔ [ AI Auto-Categorization ] ➔ [ Admin Triage & Assignment ]
       │                         │                           │
       ▼                         ▼                           ▼
[ Photos & Map GPS ]   [ Category & Urgency ]       [ Department Workload ]
       │                                                     │
       └───────────────────► [ Community Engagement ] ◄──────┘
                             (Upvotes & Comments)
                                     │
                                     ▼
                          [ Status Update: Resolved ]
```

1. **Reporting & Geo-Tagging**: A citizen identifies an issue (e.g., a broken water pipe), uploads a photograph, and pins the location on the map.
2. **AI Triage**: The RAG microservice processes the report text, automatically assigning the most accurate category and severity rating.
3. **Public Visibility & Upvoting**: The issue appears on the public map and feed. Nearby residents upvote the issue, highlighting its importance to city officials.
4. **Administrative Dispatch**: Municipal administrators review the report on their dashboard and dispatch it to the relevant department (e.g., Water & Sewage Division).
5. **Resolution & Feedback**: Once field work is completed, administrators mark the status as **Resolved**. The submitting user and upvoters receive progress updates.

---

## 🏗️ System Architecture & Technology Stack

CivicWatch is built as a microservices architecture designed for reliability, scalability, and modular maintainability:

```
CivicWatch/
├── client/          # Frontend Web Application (React, Vite, CSS, Recharts)
├── server/          # Core Backend API (Node.js, Express, MongoDB, Nodemailer)
└── rag-model/       # AI RAG Microservice (Python 3.11, FastAPI, Google Gemini)
```

| Layer | Technologies & Frameworks | Description |
|-------|--------------------------|-------------|
| **Frontend Tier** | React, CSS, Recharts, Interactive Maps | Responsive user dashboard, map visualizations, and administrative panels. |
| **Backend Core** | Node.js, Express, JWT, Nodemailer, Mongoose | RESTful API managing authentication, reports, comments, upvotes, and user roles. |
| **Database** | MongoDB | Document store maintaining users, reports, categories, and system metrics. |
| **AI RAG Microservice** | Python, FastAPI, Google Gemini LLM, Scikit-Learn | Microservice for intelligent text categorization, semantic vector search, and RAG Q&A. |
| **Containerization** | Docker, Nginx, Render Blueprints | Multi-container orchestration with non-root security standards. |

---

## 🛡️ Security & Governance

- **Encrypted Authentication**: User passwords are securely hashed using `bcrypt` before storage. Session authorization is enforced via JSON Web Tokens (JWT).
- **Encrypted Passwords**: User passwords are securely hashed using `bcrypt` before storage, ensuring credential safety.
- **Role-Based Access Control (RBAC)**: Strict segregation between citizen users and municipal administrative staff endpoints.
- **Secure Containerization**: All microservices execute under unprivileged non-root system users (`node`, `appuser`) with automated container health probes.

---

## 💡 Real-World Value & Impact

- **For Citizens**: Provides a transparent, accessible voice in community maintenance with real-time feedback on local problems.
- **For Municipalities**: Reduces administrative overhead through AI categorization, eliminates duplicate reports via geo-mapping, and provides data insights to allocate budgets effectively.
- **For Communities**: Fosters civic responsibility, improves neighborhood safety, and accelerates urban infrastructure maintenance.

---

> ℹ️ *For developers seeking technical installation instructions, environment variables, or local startup commands, please consult [QUICK_REFERENCE.md](file:///d:/Projects/CivicWatch/QUICK_REFERENCE.md).*

---

**Made with ❤️ for smart communities and civic empowerment.**

