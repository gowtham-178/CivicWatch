# CivicWatch - Community Issue Reporting System

A full-stack web application that enables citizens to report civic issues and allows administrators to manage and resolve them efficiently.

## 🚀 Features

- **Citizen Portal**: Report issues, track status, view community problems
- **Admin Dashboard**: Manage reports, assign tasks, view analytics
- **Real-time Updates**: Status tracking and notifications
- **Image Upload**: Visual documentation of issues
- **Interactive Maps**: Location-based issue visualization
- **Analytics**: Data insights and performance metrics

## 🛠️ Technology Stack

**Frontend**: React.js, TailwindCSS, React Router, Recharts  
**Backend**: Node.js, Express.js, MongoDB, Mongoose  
**Authentication**: JWT, bcrypt  
**File Upload**: Multer  

## 📁 Project Structure

```
CivicWatch/
├── client/                     # React frontend application
│   ├── public/
│   │   └── index.html         # Main HTML template
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Button.jsx     # Custom button component
│   │   │   ├── Card.jsx       # Card layout component
│   │   │   ├── MapView.jsx    # Interactive map component
│   │   │   ├── Modal.jsx      # Modal dialog component
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   └── SuccessModal.jsx   # Success notification modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── pages/             # Application pages
│   │   │   ├── AdminAnalytics.jsx # Admin analytics dashboard
│   │   │   ├── AdminDashboard.jsx # Admin main dashboard
│   │   │   ├── AdminReports.jsx   # Admin report management
│   │   │   ├── Home.jsx       # Citizen home page with map
│   │   │   ├── Login.jsx      # User login page
│   │   │   ├── MyReports.jsx  # User's personal reports
│   │   │   ├── Profile.jsx    # User profile management
│   │   │   ├── Register.jsx   # User registration
│   │   │   └── ReportForm.jsx # Issue reporting form
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── index.css          # Global styles
│   │   └── index.jsx          # React app entry point
│   ├── package.json           # Frontend dependencies
│   ├── postcss.config.js      # PostCSS configuration
│   ├── README.md              # Frontend documentation
│   └── tailwind.config.js     # TailwindCSS configuration
├── server/                     # Node.js backend application
│   ├── src/
│   │   ├── middleware/
│   │   │   └── middleware.js  # Authentication & validation middleware
│   │   ├── models/            # MongoDB data models
│   │   │   ├── admin.js       # Admin user model
│   │   │   ├── category.js    # Issue category model
│   │   │   ├── comment.js     # Comment model
│   │   │   ├── report.js      # Issue report model
│   │   │   └── user.js        # User model
│   │   ├── routes/            # API route handlers
│   │   │   ├── admin.js       # Admin-specific routes
│   │   │   ├── adminAuth.js   # Admin authentication routes
│   │   │   ├── auth.js        # User authentication routes
│   │   │   ├── categories.js  # Category management routes
│   │   │   ├── createAdmin.js # Admin creation route
│   │   │   └── reports.js     # Report CRUD operations
│   │   └── index.js           # Server entry point & configuration
│   ├── uploads/               # File upload storage directory
│   ├── .env                   # Environment variables (not in repo)
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies
│   └── package-lock.json      # Dependency lock file
├── .gitignore                 # Git ignore rules
├── package.json               # Root package.json for scripts
├── package-lock.json          # Root dependency lock
├── PROJECT_DOCUMENTATION.md   # Comprehensive project documentation
└── README.md                  # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/CivicWatch.git
cd CivicWatch
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cd ../server
cp .env.example .env

# Edit .env with your configuration
```

### 4. Environment Variables
Create `server/.env` with:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### 5. Start Development Servers
```bash
# From root directory - starts both client and server
npm start

# Or start individually:
npm run server  # Backend only
npm run client  # Frontend only
```

## 📱 Application Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## 🗂️ File & Folder Descriptions

### Frontend (`/client`)
- **`src/components/`**: Reusable React components for UI consistency
- **`src/pages/`**: Main application pages and views
- **`src/context/`**: React context for global state management
- **`public/`**: Static assets and HTML template
- **`tailwind.config.js`**: TailwindCSS styling configuration

### Backend (`/server`)
- **`src/models/`**: MongoDB schema definitions using Mongoose
- **`src/routes/`**: Express.js API endpoints and business logic
- **`src/middleware/`**: Authentication, validation, and error handling
- **`uploads/`**: File storage for uploaded images
- **`.env`**: Environment variables (database, JWT secrets)

### Root Files
- **`package.json`**: Scripts to run client/server concurrently
- **`.gitignore`**: Excludes node_modules, .env, uploads from Git
- **`PROJECT_DOCUMENTATION.md`**: Detailed technical documentation

## 🔐 Authentication

- **JWT-based authentication** for secure API access
- **Role-based access control** (User/Admin)
- **Password hashing** using bcrypt
- **Protected routes** for authenticated users only

## 📊 Database Schema

### Collections:
- **Users**: Citizen accounts and profiles
- **Admins**: Administrative user accounts
- **Reports**: Issue reports with status tracking
- **Categories**: Issue classification (Infrastructure, Safety, etc.)
- **Comments**: Report discussions and updates

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `GET /api/reports/user/:userId` - Get user's reports

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard statistics
- `PUT /api/admin/reports/:id/status` - Update report status

## 🎯 Key Features Explained

### For Citizens:
- **Report Issues**: Submit problems with photos and location
- **Track Progress**: Monitor report status in real-time
- **View Community**: See all reported issues on interactive map
- **Personal Dashboard**: Manage submitted reports

### For Administrators:
- **Centralized Management**: View and manage all reports
- **Status Updates**: Change report status and assign departments
- **Analytics**: View trends, statistics, and performance metrics
- **Filtering**: Search and filter reports by various criteria

## 🔄 Development Workflow

1. **Frontend Development**: React components in `/client/src`
2. **Backend Development**: API routes in `/server/src/routes`
3. **Database**: MongoDB models in `/server/src/models`
4. **Testing**: Use Postman for API testing
5. **File Uploads**: Images stored in `/server/uploads`

## 📈 Future Enhancements

- Mobile app development (React Native)
- Real-time notifications (Socket.io)
- GIS integration (Google Maps API)
- Email notifications
- Advanced analytics dashboard
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

**Bug_Slayers Team**
- Full-stack development
- UI/UX design
- Database architecture
- API development

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the PROJECT_DOCUMENTATION.md for detailed information

---

**CivicWatch** - Empowering communities through technology 🏙️✨
