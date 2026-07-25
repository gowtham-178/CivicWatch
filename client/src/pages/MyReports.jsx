import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ReportCard } from '../components/reports/ReportCard';
import { reportsAPI } from '../services/api';
import { Plus, AlertCircle, Bell } from 'lucide-react';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyReports();
  }, [user]);

  const fetchMyReports = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await reportsAPI.getMyReports();
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.docs || []);
        setReports(list);
      } else {
        setError(res.error || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await reportsAPI.toggleUpvote(id);
      if (res.success) {
        const upvotesList = res.data?.upvotesList || (res.data?.upvotes !== undefined ? Array(res.data.upvotes).fill(user?._id) : (res.upvotes !== undefined ? Array(res.upvotes).fill(user?._id) : []));
        setReports((prev) =>
          prev.map((r) => (r._id === id ? { ...r, upvotes: upvotesList } : r))
        );
      }
    } catch (err) {
      console.error('Error toggling upvote:', err);
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter === 'all') return true;
    return report.status.toLowerCase().replace(' ', '-') === filter;
  });

  const getNotifications = () => {
    return reports.slice(0, 3).map((report) => {
      const daysSince = Math.floor((new Date() - new Date(report.createdAt)) / (1000 * 60 * 60 * 24));
      const timeText = daysSince === 0 ? 'Today' : daysSince === 1 ? '1 day ago' : `${daysSince} days ago`;

      let message = `Your report '${report.title}' has been acknowledged`;
      if (report.status === 'Resolved') {
        message = `Your report '${report.title}' has been resolved`;
      } else if (report.status === 'In Progress') {
        message = `Your report '${report.title}' is now in progress`;
      }

      return {
        id: report._id,
        message,
        time: timeText
      };
    });
  };

  const notifications = getNotifications();

  const resolvedReports = reports.filter((r) => r.status === 'Resolved');
  let computedAvgResponseTime = 'N/A';
  if (resolvedReports.length > 0) {
    const totalDiffTime = resolvedReports.reduce((sum, r) => {
      const created = new Date(r.createdAt);
      const resolved = r.resolutionDetails?.resolvedAt ? new Date(r.resolutionDetails.resolvedAt) : new Date(r.updatedAt);
      return sum + Math.max(0, resolved - created);
    }, 0);
    const avgMs = totalDiffTime / resolvedReports.length;
    const avgHours = parseFloat((avgMs / (1000 * 60 * 60)).toFixed(1));
    if (avgHours > 24) {
      computedAvgResponseTime = `${parseFloat((avgHours / 24).toFixed(1))} days`;
    } else {
      computedAvgResponseTime = `${avgHours} hours`;
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">My Reports</h1>
          <p className="text-sm text-slate-600">Track and manage your submitted civic issue reports</p>
        </div>
        <Link to="/report">
          <Button className="inline-flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Report</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl">
            {[
              { key: 'all', label: 'All Reports' },
              { key: 'pending', label: 'Pending' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'resolved', label: 'Resolved' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  filter === key
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Reports Grid / Cards */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading your reports...</div>
          ) : error ? (
            <Card className="text-center py-12">
              <Card.Content>
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Reports</h3>
                <p className="text-sm text-slate-600 mb-4">{error}</p>
                <Button onClick={fetchMyReports}>Try Again</Button>
              </Card.Content>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card className="text-center py-12">
              <Card.Content>
                <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">No reports found</h3>
                <p className="text-sm text-slate-600 mb-6">
                  {filter === 'all'
                    ? "You haven't submitted any reports yet."
                    : `No reports with status "${filter.replace('-', ' ')}" found.`}
                </p>
                <Link to="/report">
                  <Button>Submit Your First Report</Button>
                </Link>
              </Card.Content>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <Card.Header className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <p className="font-medium text-slate-800 mb-1">{notif.message}</p>
                      <p className="text-slate-400">{notif.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No recent notifications</p>
                )}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-lg font-bold text-slate-900">Your Civic Impact</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
                  <span className="font-medium text-slate-700">Total Submitted</span>
                  <span className="font-bold text-sky-700 text-base">{reports.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="font-medium text-slate-700">Resolved Issues</span>
                  <span className="font-bold text-emerald-700 text-base">
                    {reports.filter((r) => r.status === 'Resolved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                  <span className="font-medium text-slate-700">Avg Resolution Time</span>
                  <span className="font-bold text-slate-800">{computedAvgResponseTime}</span>
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