# Quick Setup Guide

## Backend Setup

```bash
cd server
npm install

# Update .env file with:
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL_USER (Gmail)
# - EMAIL_PASSWORD (App Password)

npm run dev
```

## Frontend Setup

```bash
cd client
npm install

# No API key needed - uses OpenStreetMap (free)

npm start
```

## Database Migration

```bash
node server/src/migrations/updateUserSchema.js
```

## Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this password in EMAIL_PASSWORD

## Access Points

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

## Map Features

- **OpenStreetMap**: Free, no API key required
- **Location Picker**: Click on map to select report location
- **Current Location**: Get user's GPS location
- **Area Coloring**: 
  - Red zones = Pending reports
  - Yellow zones = In Progress reports
  - Green zones = Resolved reports
- **Hover Info**: View report details on zone hover
- **Address Lookup**: Automatic address from coordinates
