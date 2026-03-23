# CivicWatch - Community Issue Reporting System

A full-stack web application that enables citizens to report civic issues and allows administrators to manage and resolve them efficiently.

## 🚀 Features

- **Citizen Portal**: Report issues, track status, view community problems
- **Admin Dashboard**: Manage reports, assign tasks, view analytics
- **Real-time Updates**: Status tracking and notifications
- **Image Upload**: Visual documentation of issues
- **Interactive Maps**: Location-based issue visualization with OpenStreetMap
- **Map-Based Location Selection**: Click on map to select report location with automatic address lookup
- **Area-Based Status Visualization**: Color-coded zones showing report status (Red=Pending, Yellow=In Progress, Green=Resolved)
- **Analytics**: Data insights and performance metrics
- **Email Verification**: OTP-based email verification for secure registration
- **Password Management**: Change password with current password verification
- **User Profiles**: Manage account information with report tracking

## 🛠️ Technology Stack

**Frontend**: React.js, TailwindCSS, React Router, Recharts, Leaflet (OpenStreetMap)  
**Backend**: Node.js, Express.js, MongoDB, Mongoose  
**Authentication**: JWT, bcrypt  
**Email**: Nodemailer (Gmail SMTP)
**File Upload**: Multer  
**Maps**: Leaflet + OpenStreetMap (Free, no API key required)

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
│   │   │   ├── MapView.jsx    # Interactive OpenStreetMap component
│   │   │   ├── LocationPicker.jsx # Map-based location selection
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
│   │   │   ├── Profile.jsx    # User profile management with password change
│   │   │   ├── Register.jsx   # User registration with OTP verification
│   │   │   └── ReportForm.jsx # Issue reporting form with map location picker
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
│   │   │   ├── report.js      # Issue report model with lat/lng
│   │   │   └── user.js        # User model with OTP fields
│   │   ├── routes/            # API route handlers
│   │   │   ├── admin.js       # Admin-specific routes
│   │   │   ├── adminAuth.js   # Admin authentication routes
│   │   │   ├── auth.js        # User authentication with OTP & password change
│   │   │   ├── categories.js  # Category management routes
│   │   │   ├── createAdmin.js # Admin creation route
│   │   │   └── reports.js     # Report CRUD operations with coordinates
│   │   ├── migrations/        # Database migration scripts
│   │   │   └── updateUserSchema.js # User schema migration
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
- Gmail account with App Password

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
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### 5. Database Migration (for existing users)
```bash
node server/src/migrations/updateUserSchema.js
```

### 6. Start Development Servers
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
- **`src/migrations/`**: Database migration scripts
- **`uploads/`**: File storage for uploaded images
- **`.env`**: Environment variables (database, JWT secrets, email config)

### Root Files
- **`package.json`**: Scripts to run client/server concurrently
- **`.gitignore`**: Excludes node_modules, .env, uploads from Git
- **`PROJECT_DOCUMENTATION.md`**: Detailed technical documentation

## 🔐 Authentication & Security

- **JWT-based authentication** for secure API access
- **Email OTP verification** for account registration
- **Role-based access control** (User/Admin)
- **Password hashing** using bcrypt
- **Protected routes** for authenticated users only
- **Password change** with current password verification

## 📊 Database Schema

### Collections:
- **Users**: Citizen accounts with email verification status
- **Admins**: Administrative user accounts
- **Reports**: Issue reports with status tracking and coordinates
- **Categories**: Issue classification (Infrastructure, Safety, etc.)
- **Comments**: Report discussions and updates

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration (sends OTP)
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - User login (requires verified email)
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/myprofile` - Get user profile

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `POST /api/reports` - Create new report with coordinates
- `PUT /api/reports/:id` - Update report
- `GET /api/reports/my-reports` - Get user's reports
- `DELETE /api/reports/:id` - Delete report

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard statistics
- `PUT /api/admin/reports/:id/status` - Update report status

## 🎯 Key Features Explained

### For Citizens:
- **Register & Verify**: Sign up with email OTP verification
- **Report Issues**: Submit problems with photos and map-based location
- **Location Selection**: Click on map to select exact location, auto-lookup address
- **Track Progress**: Monitor report status in real-time
- **View Community**: See all reported issues on interactive map with area-based status coloring
- **Manage Account**: Edit profile, change password, view report count

### For Administrators:
- **Centralized Management**: View and manage all reports
- **Status Updates**: Change report status and assign departments
- **Analytics**: View trends, statistics, and performance metrics
- **Filtering**: Search and filter reports by various criteria
- **Map Visualization**: See area-based report status at a glance

### Map Features:
- **Area-Based Coloring**: Zones colored by report status
  - Red: Pending reports
  - Yellow: In Progress reports
  - Green: Resolved reports
- **Hover Information**: View report details when hovering over zones
- **Location Picker**: Click on map to select report location
- **Current Location**: Get user's current location with one click
- **Address Lookup**: Automatic address resolution from coordinates

## 🔄 Development Workflow

1. **Frontend Development**: React components in `/client/src`
2. **Backend Development**: API routes in `/server/src/routes`
3. **Database**: MongoDB models in `/server/src/models`
4. **Testing**: Use Postman for API testing
5. **File Uploads**: Images stored in `/server/uploads`
6. **Email**: OTP sent via Gmail SMTP
7. **Maps**: OpenStreetMap with Leaflet (no API key needed)

## 📈 Future Enhancements

- Mobile app development (React Native)
- Real-time notifications (Socket.io)
- SMS OTP as alternative
- Email notifications for report updates
- Advanced analytics dashboard
- Multi-language support
- Social login integration
- Report clustering on map

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
