import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, TrendingUp, Users, Clock } from 'lucide-react';
import reportsData from '../data/reports.json';

const Home = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(reportsData);
  }, []);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-sm font-medium text-primary-700 mb-6">
          <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-bounce-subtle"></span>
          Community-Driven Solutions
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-neutral-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent mb-6">
          Welcome to Civic Watch
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Report community issues and track their resolution in real-time. Together, we build better neighborhoods.
        </p>
        <Link to="/report">
          <Button size="lg" className="inline-flex items-center space-x-3 text-lg px-8 py-4">
            <Plus className="h-6 w-6" />
            <span>Report an Issue</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card hover className="group">
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">Total Reports</p>
              <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
            </div>
          </Card.Content>
        </Card>

        <Card hover className="group">
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">Pending</p>
              <p className="text-3xl font-bold text-neutral-900">{stats.pending}</p>
            </div>
          </Card.Content>
        </Card>

        <Card hover className="group">
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">In Progress</p>
              <p className="text-3xl font-bold text-neutral-900">{stats.inProgress}</p>
            </div>
          </Card.Content>
        </Card>

        <Card hover className="group">
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">Resolved</p>
              <p className="text-3xl font-bold text-neutral-900">{stats.resolved}</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mb-12" hover>
        <Card.Header>
          <h2 className="text-2xl font-bold text-neutral-900">Community Issues Map</h2>
          <p className="text-sm text-neutral-600 mt-1">Click on pins to view issue details</p>
        </Card.Header>
        <Card.Content>
          <MapView reports={reports} />
        </Card.Content>
      </Card>

      {/* Recent Reports */}
      <Card hover>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-900">Recent Reports</h2>
            <Link to="/my-reports">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-2xl border border-neutral-200/50 hover:shadow-soft transition-all duration-300">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{report.location}</p>
                  <p className="text-xs text-neutral-500">{new Date(report.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                    report.status === 'Resolved' ? 'bg-accent-100 text-accent-800' :
                    report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Home;