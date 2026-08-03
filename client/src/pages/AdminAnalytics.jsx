import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { adminAPI } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Clock, Users, Target } from 'lucide-react';

const AdminAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      setDashboardData(res.data || res);
    } catch (err) {
      console.error('Error fetching analytics dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusData = dashboardData?.statusCounts?.map((s) => ({ name: s._id, value: s.count })) || [];
  const categoryData = dashboardData?.categoryCounts?.map((c) => ({ name: c._id, value: c.count })) || [];
  const recentReportsTrend = dashboardData?.recentReports?.map((r) => ({ date: r._id, count: r.count })) || [];

  const totalReports = statusData.reduce((sum, s) => sum + s.value, 0);
  const resolvedCount = statusData.find((s) => s.name === 'Resolved')?.value || 0;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  const COLORS = ['#0284c7', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Analytics & Metrics</h1>
          <p className="text-sm text-slate-600">Visual performance metrics and civic issue trends</p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading analytics metrics...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Content className="flex items-center p-5">
                <div className="p-3 bg-sky-500 text-white rounded-xl">
                  <Target className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Registered Citizens</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardData?.userCount || 0}</p>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center p-5">
                <div className="p-3 bg-amber-500 text-white rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Resolution Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{resolutionRate}%</p>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center p-5">
                <div className="p-3 bg-emerald-500 text-white rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Categories Tracked</p>
                  <p className="text-2xl font-bold text-slate-900">{categoryData.length}</p>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center p-5">
                <div className="p-3 bg-purple-500 text-white rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Active Queries</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statusData.find((s) => s.name === 'Pending')?.value || 0}
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <Card.Header>
                <h2 className="text-base font-bold text-slate-900">30-Day Submission Trend</h2>
              </Card.Header>
              <Card.Content>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={recentReportsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#0284c7" fill="#0284c7" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h2 className="text-base font-bold text-slate-900">Report Status Distribution</h2>
              </Card.Header>
              <Card.Content>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Content>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <Card.Header>
                <h2 className="text-base font-bold text-slate-900">Volume by Category</h2>
              </Card.Header>
              <Card.Content>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h2 className="text-base font-bold text-slate-900">System Insights & Recommendations</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-sky-50 rounded-lg text-sky-800 border border-sky-100">
                    <span className="font-bold block mb-1">Sanitation & Waste Disposal</span>
                    Sanitation categories represent the highest volume of community reports. Automated routing is suggested.
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-800 border border-amber-100">
                    <span className="font-bold block mb-1">Response Acceleration</span>
                    High priority issues pending over 48 hours trigger administrative warnings.
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;