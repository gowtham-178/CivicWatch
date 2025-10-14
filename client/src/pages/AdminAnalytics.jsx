import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
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
const API_BASE_URL = 'http://localhost:5000/api';

const AdminAnalytics = () => {
  const [reports, setReports] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      const data = await response.json();
      if (data.success) {
        setReports(data.data.docs || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Category distribution data
  const categoryData = reports.reduce((acc, report) => {
    const existing = acc.find(item => item.name === report.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: report.category, value: 1 });
    }
    return acc;
  }, []);

  // Status distribution data
  const statusData = reports.reduce((acc, report) => {
    const existing = acc.find(item => item.name === report.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: report.status, value: 1 });
    }
    return acc;
  }, []);

  // Department workload data
  const departmentData = reports.reduce((acc, report) => {
    const department = report.assignedTo?.name || 'Unassigned';
    const existing = acc.find(item => item.department === department);
    if (existing) {
      existing.reports += 1;
    } else {
      acc.push({ department, reports: 1 });
    }
    return acc;
  }, []);

  // Response time trend (simulated data)
  const responseTimeData = [
    { month: 'Jan', avgDays: 3.2 },
    { month: 'Feb', avgDays: 2.8 },
    { month: 'Mar', avgDays: 2.5 },
    { month: 'Apr', avgDays: 2.1 },
    { month: 'May', avgDays: 2.3 },
    { month: 'Jun', avgDays: 2.0 },
  ];

  // Reports over time (simulated data)
  const reportsOverTimeData = [
    { month: 'Jan', reports: 45, resolved: 38 },
    { month: 'Feb', reports: 52, resolved: 44 },
    { month: 'Mar', reports: 48, resolved: 41 },
    { month: 'Apr', reports: 61, resolved: 55 },
    { month: 'May', reports: 55, resolved: 48 },
    { month: 'Jun', reports: 58, resolved: 52 },
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  const stats = {
    totalReports: reports.length,
    avgResponseTime: '2.3 days',
    resolutionRate: '85%',
    activeReports: reports.filter(r => r.status !== 'Resolved').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Insights and trends from community reports</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReports}</p>
              <p className="text-xs text-green-600">+12% from last period</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgResponseTime}</p>
              <p className="text-xs text-green-600">-8% improvement</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolutionRate}</p>
              <p className="text-xs text-green-600">+3% from last period</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeReports}</p>
              <p className="text-xs text-red-600">Needs attention</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Reports Over Time */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Reports Over Time</h2>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="reports" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        {/* Response Time Trend */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Average Response Time</h2>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} days`, 'Avg Response Time']} />
                <Line type="monotone" dataKey="avgDays" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Category Distribution */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Reports by Category</h2>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        {/* Status Distribution */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Status Distribution</h2>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
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

        {/* Department Workload */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Department Workload</h2>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="reports" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Performance Insights</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Most Common Issues</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Infrastructure problems (40%)</li>
                <li>• Road maintenance (25%)</li>
                <li>• Sanitation issues (20%)</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Best Performing Dept</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Parks & Recreation</li>
                <li>• 95% resolution rate</li>
                <li>• 1.8 days avg response</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Areas for Improvement</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• High priority response time</li>
                <li>• Weekend coverage</li>
                <li>• Citizen communication</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminAnalytics;