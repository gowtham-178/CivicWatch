# Civic Watch - Community Issue Reporting System

A full-scale React frontend application for community issue reporting and management.

## Features

### Citizen Interface
- **Interactive Map View**: View all reported issues on a simulated map with priority-based pins
- **Issue Reporting**: Submit new issues with image upload, location, and priority selection
- **My Reports**: Track personal report history with status updates and notifications
- **Real-time Status Updates**: Receive notifications as reports progress through resolution

### Administrative Dashboard
- **Comprehensive Dashboard**: Overview of all reports with key metrics and statistics
- **Report Management**: Filter, search, and manage all incoming reports
- **Status Control**: Update report status (Pending → In Progress → Resolved)
- **Department Assignment**: Assign reports to appropriate departments
- **Analytics**: Visual charts showing trends, response times, and performance metrics

## Technology Stack

- **React 18** with JSX
- **React Router** for navigation
- **TailwindCSS** for styling
- **Recharts** for analytics visualization
- **Lucide React** for icons
- **Responsive Design** (mobile-first approach)

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── MapView.jsx
│   ├── pages/              # Application pages
│   │   ├── Home.jsx        # Citizen map view
│   │   ├── ReportForm.jsx  # Issue submission form
│   │   ├── MyReports.jsx   # User report history
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminReports.jsx
│   │   └── AdminAnalytics.jsx
│   ├── data/
│   │   └── reports.json    # Static sample data
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Citizen Interface: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## Key Components

### Reusable UI Components
- **Navbar**: Responsive navigation with mobile menu
- **Button**: Configurable button with variants and sizes
- **Card**: Flexible card component with header, content, and footer
- **Modal**: Overlay modal for detailed views
- **MapView**: Simulated map with interactive report pins

### Data Management
- Static JSON file simulates backend data
- React hooks for state management
- Ready for API integration

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interfaces

## Future Enhancements

The application is architected for easy integration with:
- REST APIs for real-time data
- Authentication systems
- Real mapping services (Google Maps, Mapbox)
- Push notifications
- File upload services
- Advanced analytics

## Sample Data

The application includes 5 sample reports covering various categories:
- Infrastructure issues
- Road maintenance
- Sanitation problems
- Vandalism reports
- Parks & recreation issues

Each report includes realistic data for testing all features and workflows.