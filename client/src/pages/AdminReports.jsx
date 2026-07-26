import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { reportsAPI } from '../services/api';
import { Search, Filter, Eye, MapPin, Calendar, User, Tag } from 'lucide-react';
import { API_SERVER_URL } from '../config';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setFilteredReports(list);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReports([]);
      setFilteredReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.location?.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((r) =>
        Array.isArray(r.category) ? r.category.includes(categoryFilter) : r.category === categoryFilter
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((r) => r.priority === priorityFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const res = await reportsAPI.update(reportId, { status: newStatus });
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r))
        );
      }
    } catch (err) {
      console.error('Error updating report status:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const categories = [...new Set(reports.flatMap((r) => (Array.isArray(r.category) ? r.category : [r.category])).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Reports Management</h1>
        <p className="text-sm text-slate-600">Review, categorize, and update community reports</p>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setPriorityFilter('all');
              }}
              className="inline-flex items-center space-x-1 justify-center text-xs"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </Card.Content>
      </Card>

      <div className="mb-3 text-xs text-slate-500">
        Showing {filteredReports.length} of {reports.length} total reports
      </div>

      {/* Reports Table */}
      <Card>
        <Card.Content className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Issue Title & Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Status Update</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Submitted By</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{report.title}</div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="truncate max-w-[200px]">{report.location?.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
                        <Tag className="h-3 w-3 mr-1 text-sky-500" />
                        {Array.isArray(report.category) ? report.category.join(', ') : (report.category || 'General')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {report.status === 'Resolved' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          🔒 Resolved (Locked)
                        </span>
                      ) : (
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                          className="border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={report.priority} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>{report.submittedBy?.name || 'Citizen'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(report);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Details" size="lg">
        {selectedReport && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700">Title</label>
                <p className="text-slate-900 font-medium">{selectedReport.title}</p>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Current Status</label>
                <div><StatusBadge status={selectedReport.status} /></div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Description</label>
              <p className="text-slate-700 mt-1">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700">Category</label>
                <p className="text-slate-900">{Array.isArray(selectedReport.category) ? selectedReport.category.join(', ') : selectedReport.category}</p>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Priority</label>
                <div><PriorityBadge priority={selectedReport.priority} /></div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Location Address</label>
              <p className="text-slate-900">{selectedReport.location?.address}</p>
            </div>

            {selectedReport.images && selectedReport.images.length > 0 && (
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Attachment</label>
                <img
                  src={`${API_SERVER_URL}${selectedReport.images[0]}`}
                  alt="Attachment"
                  className="w-full max-h-48 object-cover rounded-lg border border-slate-200 cursor-pointer"
                  onClick={() => window.open(`${API_SERVER_URL}${selectedReport.images[0]}`, '_blank')}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminReports;