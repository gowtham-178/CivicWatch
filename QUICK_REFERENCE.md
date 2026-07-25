# CivicWatch - Quick Reference Guide

## 🚀 Start Development (30 seconds)

### Terminal 1 - Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm install
npm run dev
```

**Access**: http://localhost:5173

---

## 📝 Environment Setup

### Backend .env (Required Fields)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civicwatch
JWT_SECRET=your_super_secret_key_32_chars_minimum
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
NODE_ENV=development
```

### Frontend .env.local (Required Fields)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_SERVER_URL=http://localhost:5000
```

---

## 📊 Test Accounts

| Type | Email | Password | Role |
|------|-------|----------|------|
| User | test@example.com | TestPassword123 | user |
| Admin | admin@civicwatch.com | Admin@123 | admin |

---

## 🔗 API Quick Reference

### Authentication
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/signup | ❌ | Register user |
| POST | /api/auth/verify-otp | ❌ | Verify email |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/auth/myprofile | ✅ | Get profile |
| PUT | /api/auth/myprofile | ✅ | Update profile |
| POST | /api/auth/change-password | ✅ | Change password |

### Reports
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/reports | ❌ | List all reports |
| GET | /api/reports/my-reports | ✅ | My reports |
| GET | /api/reports/:id | ❌ | Get details |
| POST | /api/reports | ✅ | Create report |
| PUT | /api/reports/:id | ✅ | Update report |
| DELETE | /api/reports/:id | ✅ | Delete report |
| POST | /api/reports/:id/comments | ✅ | Add comment |
| POST | /api/reports/:id/upvote | ✅ | Upvote |

### Admin
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/admin/dashboard | ✅ | Analytics |
| GET | /api/admin/users | ✅ | List users |
| PUT | /api/admin/users/:id/role | ✅ | Update role |

---

## 🎨 Component Structure

### Frontend Pages
```
src/pages/
├── Home.jsx              # Dashboard
├── Login.jsx             # User login
├── Register.jsx          # Registration
├── ReportForm.jsx        # Create report
├── MyReports.jsx         # View my reports
├── Profile.jsx           # Profile page
├── AdminDashboard.jsx    # Admin dashboard
├── AdminReports.jsx      # Admin reports
└── AdminAnalytics.jsx    # Analytics
```

### Frontend Components
```
src/components/
├── Navbar.jsx            # Navigation
├── Card.jsx              # Card wrapper
├── Button.jsx            # Button component
├── Modal.jsx             # Modal dialog
├── MapView.jsx           # Map display
├── ProtectedRoute.jsx    # Route protection
└── SuccessModal.jsx      # Success modal
```

---

## 🔧 Common Commands

### Development
```bash
# Backend
npm run dev              # Start dev server
npm test                 # Run tests
npm start                # Production start

# Frontend
npm run dev              # Start dev server
npm run build            # Build production
npm run preview          # Preview build
```

### Database
```bash
# Create admin
node createAdmin.js

# Check admins
node checkAdmins.js

# Seed categories (set SEED_DATABASE=true in .env)
```

---

## 📱 Key Features Quick Check

### User Features
- [ ] Register with email OTP
- [ ] Login with email/password
- [ ] Create report with image
- [ ] View all reports
- [ ] Filter reports by status
- [ ] Upvote reports
- [ ] Comment on reports
- [ ] Update profile
- [ ] Change password
- [ ] View my reports

### Admin Features
- [ ] Admin login
- [ ] View dashboard
- [ ] Update report status
- [ ] Assign to department
- [ ] View analytics
- [ ] Manage users
- [ ] View department workload

---

## 🐛 Troubleshooting Quick Fixes

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection failed"
```bash
# Ensure MongoDB is running
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### "Port already in use"
```bash
# Find process
lsof -i :5000

# Kill process (replace PID)
kill -9 <PID>
```

### "CORS Error"
- Check CLIENT_URL in backend .env
- Ensure frontend URL matches CLIENT_URL

### "Email not sending"
- Enable 2-factor auth on Gmail
- Generate app-specific password
- Update EMAIL_PASSWORD in .env

---

## 📊 Database Collections

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  role: 'user' | 'admin',
  isEmailVerified: Boolean,
  emailOtp: String,
  otpExpiry: Date
}
```

### Report
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: {
    address: String,
    coordinates: { lat, lng }
  },
  category: String,
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected',
  priority: 'Low' | 'Medium' | 'High' | 'Critical',
  images: [String],
  submittedBy: ObjectId,
  assignedTo: ObjectId,
  upvotes: [ObjectId],
  comments: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens (7-day expiry)
- ✅ Email verification required
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ CORS configured
- ✅ XSS protection (React)
- ✅ Secure error messages

---

## 📈 Performance Tips

1. Use pagination for large datasets
2. Enable MongoDB indexes
3. Minimize image sizes (5MB limit)
4. Use React.memo for expensive components
5. Lazy load routes in frontend
6. Cache API responses

---

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Set production NODE_ENV
- [ ] Generate secure JWT_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Set up email service
- [ ] Configure CORS origin
- [ ] Set secure environment variables
- [ ] Run full test suite
- [ ] Test with production URLs

### Deployment Targets
- **Backend**: Heroku, AWS, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas
- **Email**: Gmail (or SendGrid)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main project info |
| SETUP_DEPLOYMENT_GUIDE.md | Detailed setup & deployment |
| FIXES_IMPROVEMENTS_COMPLETE.md | Fixes & improvements status |
| COMPLETION_GUIDE.md | Project completion overview |
| .env.example (backend) | Backend env template |
| .env.example (frontend) | Frontend env template |

---

## 💡 Pro Tips

1. Use Postman for API testing
2. Check browser console for frontend errors
3. Watch MongoDB logs during development
4. Use Git branches for features
5. Commit frequently with clear messages
6. Keep .env files in .gitignore
7. Test on different browsers
8. Test on mobile devices

---

## 📞 Quick Support

### Common Issues
| Issue | Solution |
|-------|----------|
| Can't login | Verify email verification, check credentials |
| Report not showing | Refresh page, check filters |
| Image not uploading | Check file size (max 5MB), file type |
| API timeout | Restart backend, check MongoDB |
| CORS errors | Verify CLIENT_URL, frontend port |

---

## 🎯 What's Included

✅ Full-stack application (frontend + backend)
✅ Database schemas and models
✅ Authentication system
✅ API endpoints (20+)
✅ Admin panel
✅ Analytics dashboard
✅ Test suite (20 tests)
✅ Documentation (4 guides)
✅ Production-ready code
✅ Responsive design

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| Backend Routes | 20+ |
| Frontend Pages | 9 |
| Database Collections | 5 |
| Test Cases | 20 |
| API Endpoints | 20+ |
| Components | 8+ |
| LOC (Backend) | 2000+ |
| LOC (Frontend) | 3000+ |

---

## 🏁 Next Steps

1. **Setup**: Follow SETUP_DEPLOYMENT_GUIDE.md
2. **Develop**: Make your changes in feature branches
3. **Test**: Run test suite before commits
4. **Deploy**: Follow deployment instructions
5. **Monitor**: Check logs and error tracking

---

**Last Updated**: 2024
**Status**: ✅ Production Ready
**Version**: 1.0.0
