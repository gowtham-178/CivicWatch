import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Clock, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import reportsData from '../data/reports.json';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    // Filter reports by logged-in user
    const userReports = reportsData.filter(report => report.submittedBy === user?.name);
    setReports(userReports);
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status.toLowerCase().replace(' ', '-') === filter;
  });

  const notifications = [
    { id: 1, message: "Your report 'Broken Streetlight' has been acknowledged", time: "2 hours ago", type: "info" },
    { id: 2, message: "Your report 'Pothole on Oak Street' is now in progress", time: "1 day ago", type: "success" },
    { id: 3, message: "Your report 'Overflowing Trash Bin' has been resolved", time: "3 days ago", type: "success" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent mb-3">My Reports</h1>
          <p className="text-lg text-neutral-600">Track the status of your submitted issues</p>
        </div>
        <Link to="/report">
          <Button className="inline-flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Report</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports Section */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-8 bg-neutral-100 p-1.5 rounded-2xl shadow-soft">
            {[
              { key: 'all', label: 'All Reports' },
              { key: 'pending', label: 'Pending' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'resolved', label: 'Resolved' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  filter === key
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} hover className="group">
                <Card.Content>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          {getStatusIcon(report.status)}
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">{report.title}</h3>
                      </div>
                      <p className="text-neutral-600 mb-4 leading-relaxed">{report.description}</p>
                      <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                        <span className="flex items-center font-medium">
                          <strong className="mr-2 text-neutral-700">Category:</strong> {report.category}
                        </span>
                        <span className="flex items-center font-medium">
                          <strong className="mr-2 text-neutral-700">Location:</strong> {report.location}
                        </span>
                        <span className="flex items-center font-medium">
                          <strong className="mr-2 text-neutral-700">Submitted:</strong> {new Date(report.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-soft ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        report.priority === 'High' ? 'bg-red-100 text-red-800' :
                        report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.priority} Priority
                      </span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}

            {filteredReports.length === 0 && (
              <Card className="text-center py-16">
                <Card.Content>
                  <div className="p-4 bg-gradient-to-br from-neutral-100 to-primary-100 rounded-2xl w-fit mx-auto mb-6">
                    <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">No reports found</h3>
                  <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                    {filter === 'all' 
                      ? "You haven't submitted any reports yet. Start making a difference in your community!"
                      : `No reports with status "${filter.replace('-', ' ')}" found.`
                    }
                  </p>
                  <Link to="/report">
                    <Button size="lg">Submit Your First Report</Button>
                  </Link>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="lg:col-span-1">
          <Card hover>
            <Card.Header>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">Notifications</h2>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-2xl border border-neutral-200/50 hover:shadow-soft transition-all duration-300">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shadow-sm ${
                      notification.type === 'success' ? 'bg-accent-500' : 'bg-primary-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 leading-relaxed">{notification.message}</p>
                      <p className="text-xs text-neutral-500 mt-2 font-medium">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-8" hover>
            <Card.Header>
              <h2 className="text-xl font-bold text-neutral-900">Your Impact</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-5">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                  <span className="text-sm font-semibold text-neutral-700">Total Reports</span>
                  <span className="text-2xl font-bold text-primary-600">{reports.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
                  <span className="text-sm font-semibold text-neutral-700">Resolved Issues</span>
                  <span className="text-2xl font-bold text-accent-600">
                    {reports.filter(r => r.status === 'Resolved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl">
                  <span className="text-sm font-semibold text-neutral-700">Avg Response Time</span>
                  <span className="text-2xl font-bold text-secondary-600">2.5 days</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyReports;