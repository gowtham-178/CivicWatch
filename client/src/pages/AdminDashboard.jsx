import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import MapView from '../components/MapView';
import { reportsAPI } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  FileText,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mapFilter, setMapFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getAll('limit=1000');
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.docs || []);
        setReports(list);
      }
    } catch (error) {
      console.error('Error fetching reports for admin:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'Pending').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length
  };

  const recentReports = reports.slice(0, 5);

  const categoryStats = {
    General: 0,
    'Electronic Waste': 0,
    'Dry Waste': 0,
    'Wet Waste': 0,
    Infrastructure: 0
  };

  reports.forEach((report) => {
    const cats = Array.isArray(report.category) ? report.category : [report.category || 'General'];
    cats.forEach((cat) => {
      if (categoryStats[cat] !== undefined) {
        categoryStats[cat] += 1;
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Centralized municipal command center & report metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-sky-500 rounded-xl text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-amber-500 rounded-xl text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-blue-500 rounded-xl text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center p-5">
            <div className="p-3 bg-emerald-500 rounded-xl text-white">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
              <p className="text-xs text-emerald-600 font-semibold">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mb-8">
        <Card.Header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Geographic Issues Map</h2>
            <p className="text-xs text-slate-500">Interactive location map of community issue reports</p>
          </div>
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {['all', 'Pending', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setMapFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  mapFilter === st
                    ? 'bg-white text-sky-700 shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </Card.Header>
        <Card.Content>
          <MapView
            reports={
              mapFilter === 'all'
                ? reports
                : reports.filter((r) => r.status === mapFilter)
            }
          />
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reports */}
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
            <Link to="/admin/reports">
              <Button variant="outline" size="sm" className="inline-flex items-center space-x-1 text-xs">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card.Header>
          <Card.Content>
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading reports...</div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="flex-1 pr-3 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{report.title}</h3>
                      <p className="text-slate-500 truncate" title={report.location?.address}>{report.location?.address}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <StatusBadge status={report.status} />
                        <PriorityBadge priority={report.priority} />
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 truncate max-w-full">
                          {Array.isArray(report.category) ? report.category.join(', ') : (report.category || 'General')}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px] shrink-0 self-start mt-0.5">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Workload by Category */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-bold text-slate-900">Category Workload Distribution</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4 text-xs">
              {Object.entries(categoryStats).map(([cat, count]) => {
                const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between font-medium text-slate-700">
                      <span className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{cat}</span>
                      </span>
                      <span>{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-sky-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;