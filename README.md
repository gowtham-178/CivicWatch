# CivicWatch - Community Issue Reporting Platform

![CivicWatch](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.1.0-orange)

A modern, full-stack web application that empowers communities to report, track, and resolve civic issues in real-time. Designed with a premium dark-accented user interface, glassmorphism, dynamic data visualizations, and interactive mapping.

## 🎯 Features

### For Citizens
- 📝 **Detailed Reporting**: Submit community issues across specific categories (**General**, **Electronic Waste**, **Dry Waste**, and **Wet Waste**) with photos, priority ratings, and details.
- 🗺️ **Interactive Map View**: Pinpoint issues on a geographic map (centered at Vijayawada/Benz Circle) using automatic fallback coordinate logic.
- 📊 **Real-Time Trackers**: Monitor your report status changes from *Pending* to *In Progress* to *Resolved*.
- 💬 **Community Discussion**: Join official and citizen-led comment sections on open issues.
- 👍 **Upvote System**: Elevate important community concerns to draw administrative attention.
- 👤 **Unified Session Registration**: Instant login redirection upon signup or OTP verification for a seamless experience.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB (local or Atlas)
- Git

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CivicWatch
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MONGODB_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd client
   npm install
   npm run start
   ```

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)
   - Admin Login Username: `admin` | Password: `admin123`

---

## 🏗️ Project Structure

```
CivicWatch/
├── server/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database schemas (User, Report, Comment, Admin)
│   │   ├── middleware/    # Authentication & admin check middleware
│   │   └── index.js       # Server entry point
│   ├── tests/             # Jest backend test suite (20 passing tests)
│   ├── .env.example       # Environment template
│   ├── package.json
│   └── jest.config.js
│
├── client/                # Frontend (React/Vite)
│   ├── src/
│   │   ├── pages/         # Page components (Home, AdminDashboard, AdminAnalytics, AdminReports, ReportForm)
│   │   ├── components/    # Reusable components (MapView, Card, Button, Modal, Navbar)
│   │   ├── context/       # Auth React Context
│   │   ├── App.jsx        # Routing structure
│   │   └── config.js      # Global config variables
│   ├── .env.example       # Environment template
│   ├── package.json
│   └── vite.config.js
│
├── package.json           # Root workspace configuration
└── docker-compose.yml     # Docker compose recipe (optional)
```

---

## 🔌 API Endpoints Summary

### Authentication & Profiles (`/api/auth`)
* `POST /signup` — Register citizen account.
* `POST /verify-otp` — Verify email OTP.
* `POST /resend-otp` — Resend verification OTP.
* `POST /login` — Log in regular user.
* `GET /myprofile` — Retrieve logged-in profile details.
* `PUT /myprofile` — Edit profile details.
* `POST /change-password` — Change password.

### Admin Authentication (`/api/admin-auth`)
* `POST /login` — Log in administrator.

### Reports & Engagement (`/api/reports`)
* `GET /` — List reports (supports search, category, status, and priority query filters).
* `GET /my-reports` — View user-specific reports.
* `GET /:id` — Get full report details, comments, and attachments.
* `POST /` — Submit report (multipart form-data for photo uploads).
* `PUT /:id` — Edit report details or update status (Admins).
* `DELETE /:id` — Remove report.
* `POST /:id/comments` — Comment on report.
* `POST /:id/upvote` — Toggle upvote on report.

### Admin Tools (`/api/admin`)
* `GET /dashboard` — Retrieve database aggregate analytics.
* `GET /users` — Get paginated users listing.
* `PUT /users/:id/role` — Update roles.
* `DELETE /users/:id` — Delete user account.
* `GET /reports/attention` — Get high-priority pending reports.

---

## 🧪 Testing

Run backend tests:
```bash
cd server
npm test
```

### Test Coverage Highlights
* **20 automated tests** passing 100% (covering User Registration, OTP logic, login security, report submission and authorization, password updates).

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express, MongoDB (via Mongoose), JWT, Multer (image uploads), Nodemailer, Jest, Supertest.
* **Frontend**: React 18, TailwindCSS, React Router v6, Recharts (visualizations), Lucide React (icons).

---

## 🔒 Security & Performance Features

* **Authentication & Cryptography**: Passwords protected with bcrypt hashing; tokens managed via JSON Web Tokens (JWT).
* **Role Enforcement**: Middleware checks role restrictions (`adminRequired`) on endpoints.
* **Optimized Rendering**: Dynamic queries pull complete datasets (up to 1000 records) to compute client-side statistics accurately.
* **Validation**: Input sanity checks on backend controllers and file upload limit set to 5MB.

---

## 🤝 Support & Contribution

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/cool-feature`).
3. Commit and push (`git push origin feature/cool-feature`).
4. Open a Pull Request.

**Made with ❤️ for community improvement**
