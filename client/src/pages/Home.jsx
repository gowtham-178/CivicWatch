import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import Card from '../components/Card';
import Button from '../components/Button';
import { ReportCard } from '../components/reports/ReportCard';
import { reportsAPI } from '../services/api';
import { Plus, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const Home = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getAll('limit=100');
      const list = res.success ? (Array.isArray(res.data) ? res.data : (res.data?.docs || [])) : [];
      setReports(list);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleUpvote = async (id) => {
    try {
      const res = await reportsAPI.toggleUpvote(id);
      if (res.success) {
        const upvotesList = res.data?.upvotesList || (res.data?.upvotes !== undefined ? Array(res.data.upvotes).fill(user?._id) : (res.upvotes !== undefined ? Array(res.upvotes).fill(user?._id) : []));
        setReports((prev) =>
          prev.map((r) => (r._id === id ? { ...r, upvotes: upvotesList } : r))
        );
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'Pending').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-sky-50 rounded-full text-sm font-medium text-sky-700 mb-6">
          <span className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse"></span>
          Community-Driven Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Welcome to CivicWatch
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Report community infrastructure issues and track their resolution in real-time. Together, we build safer and cleaner neighborhoods.
        </p>
        <Link to="/report">
          <Button size="lg" className="inline-flex items-center space-x-3 text-lg px-8 py-4">
            <Plus className="h-6 w-6" />
            <span>Report an Issue</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card hover className="group">
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-sky-500 rounded-xl group-hover:scale-105 transition-transform">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </Card.Content>
        </Card>

        <Card hover className="group">
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-amber-500 rounded-xl group-hover:scale-105 transition-transform">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            </div>
          </Card.Content>
        </Card>

        <Card hover className="group">
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-blue-500 rounded-xl group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
            </div>
          </Card.Content>
        </Card>

        <Card hover className="group">
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-emerald-500 rounded-xl group-hover:scale-105 transition-transform">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mb-12">
        <Card.Header>
          <h2 className="text-xl font-bold text-slate-900">Community Issues Map</h2>
          <p className="text-xs text-slate-500 mt-0.5">Geographic visualization of reported community issues</p>
        </Card.Header>
        <Card.Content>
          <MapView reports={reports} />
        </Card.Content>
      </Card>

      {/* Recent Reports Section */}
      <Card>
        <Card.Header className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Community Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest issue reports submitted by citizens</p>
          </div>
          <Link to="/my-reports">
            <Button variant="outline" size="sm">View My Reports</Button>
          </Link>
        </Card.Header>
        <Card.Content>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">Loading recent reports...</div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">No reports submitted yet. Be the first to report an issue!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reports.slice(0, 3).map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default Home;