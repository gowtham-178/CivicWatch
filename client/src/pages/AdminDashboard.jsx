import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  FileText,
  BarChart3,
  ArrowRight
} from 'lucide-react';
const API_BASE_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
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

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  const recentReports = reports.slice(0, 5);

  const departmentStats = reports.reduce((acc, report) => {
    const dept = report.assignedTo?.name || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const priorityStats = reports.reduce((acc, report) => {
    acc[report.priority] = (acc[report.priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage community issue reports</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-red-600">Needs attention</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
              <p className="text-xs text-blue-600">Being worked on</p>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
              <p className="text-xs text-green-600">85% resolution rate</p>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Reports */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
              <Link to="/admin/reports">
                <Button variant="secondary" size="sm" className="inline-flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.location.address}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        report.priority === 'High' ? 'bg-red-100 text-red-800' :
                        report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Department Workload */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Department Workload</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {Object.entries(departmentStats).map(([department, count]) => (
                <div key={department} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Distribution */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Priority Distribution</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`h-5 w-5 ${
                      priority === 'High' ? 'text-red-500' :
                      priority === 'Medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`} />
                    <span className="font-medium text-gray-900">{priority} Priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          priority === 'High' ? 'bg-red-500' :
                          priority === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/admin/reports">
                <Button className="w-full justify-start" variant="secondary">
                  <FileText className="h-5 w-5 mr-2" />
                  Manage All Reports
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button className="w-full justify-start" variant="secondary">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="secondary">
                <Users className="h-5 w-5 mr-2" />
                Assign Tasks
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                <TrendingUp className="h-5 w-5 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;