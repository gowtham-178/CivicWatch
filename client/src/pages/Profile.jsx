import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { authAPI, reportsAPI } from '../services/api';
import { User, Mail, Phone, Edit2, Save, X, Lock, Shield, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const isUserAdmin = user?.role === 'admin' || (isAdmin && isAdmin());

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isUserAdmin) {
      fetchReportCount();
    }
  }, [isUserAdmin]);

  const fetchReportCount = async () => {
    try {
      const res = await reportsAPI.getMyReports();
      if (res.success) {
        setReportCount(res.data?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching report count:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await authAPI.updateProfile(formData);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        updateUser(res.data);
      } else {
        setError(res.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword) {
      setError('Current password is required');
      setLoading(false);
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.trim().length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (res.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      } else {
        setError(res.error || 'Failed to change password');
      }
    } catch (err) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic Header for Admin vs Regular User */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          {isUserAdmin ? (
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-200">
              <Shield className="h-8 w-8" />
            </div>
          ) : (
            <div className="p-3 bg-sky-500/10 text-sky-600 rounded-2xl border border-sky-200">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
          {isUserAdmin ? 'Admin Profile' : 'User Profile'}
        </h1>
        <p className="text-sm text-slate-600">
          {isUserAdmin
            ? 'Manage administrative account credentials & system privileges'
            : 'Manage your personal details and community report activity'}
        </p>

        <div className="mt-3 flex justify-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isUserAdmin
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {isUserAdmin ? (
              <>
                <Shield className="h-3.5 w-3.5 mr-1 text-amber-600" />
                System Administrator
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                Community Citizen
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-card shadow-xl">
            <Card.Header className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                {isUserAdmin ? 'Administrator Account' : 'Personal Information'}
              </h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-1.5 text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="inline-flex items-center space-x-1 text-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center space-x-1 text-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </Button>
                </div>
              )}
            </Card.Header>

            <Card.Content>
              {error && <div className="mb-4 bg-red-50 text-red-700 text-xs p-3 rounded-lg">{error}</div>}
              {success && <div className="mb-4 bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg">{success}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    {isUserAdmin ? 'Administrator Name / Username' : 'Full Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-800">
                      <User className="h-4 w-4 text-sky-600" />
                      <span className="font-semibold">{user?.name || user?.username}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                  <div className="flex items-center space-x-3 p-3 bg-slate-100 rounded-lg text-sm text-slate-500">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{user?.email || 'Not provided'}</span>
                  </div>
                </div>

                {!isUserAdmin && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Mobile Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-800">
                        <Phone className="h-4 w-4 text-emerald-600" />
                        <span>{user?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                )}

                {isUserAdmin && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Account Privileges</label>
                    <div className="flex items-center space-x-3 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-sm text-amber-900 font-medium">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span>Full Municipal Oversight & Status Alteration Authority</span>
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Dynamic Side Card */}
          {isUserAdmin ? (
            <Card className="glass-card">
              <Card.Header>
                <h2 className="text-lg font-bold text-slate-900">Command Center</h2>
              </Card.Header>
              <Card.Content>
                <p className="text-xs text-slate-600 mb-4">
                  Access reports management dashboard to filter, review, and alter issue statuses.
                </p>
                <Link to="/admin">
                  <Button className="w-full text-xs justify-center py-2.5 inline-flex items-center space-x-2 btn-gradient">
                    <FileText className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          ) : (
            <Card className="glass-card">
              <Card.Header>
                <h2 className="text-lg font-bold text-slate-900">Total Submissions</h2>
              </Card.Header>
              <Card.Content>
                <div className="p-4 bg-sky-50 text-sky-700 rounded-lg text-center font-extrabold text-3xl">
                  {reportCount}
                </div>
              </Card.Content>
            </Card>
          )}

          <Card className="glass-card">
            <Card.Header>
              <h2 className="text-lg font-bold text-slate-900">Security Credentials</h2>
            </Card.Header>
            <Card.Content>
              {!isChangingPassword ? (
                <Button
                  variant="outline"
                  className="w-full text-xs justify-center py-2 inline-flex items-center space-x-2"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </Button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={loading} className="flex-1 py-1.5 text-xs">
                      Update
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                      className="flex-1 py-1.5 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
