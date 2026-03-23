import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Mail, Phone, Edit2, Save, X, Lock } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Profile = () => {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
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
    fetchReportCount();
  }, []);

  const fetchReportCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/my-reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportCount(data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching report count:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => (({
      ...prev,
      [name]: value
    })));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => (({
      ...prev,
      [name]: value
    })));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/myprofile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-sm font-medium text-primary-700 mb-4">
          <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-bounce-subtle"></span>
          Account Management
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent mb-4">Profile</h1>
        <p className="text-lg text-neutral-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card hover className="shadow-large">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neutral-900">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="inline-flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="inline-flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Content>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                  {success}
                </div>
              )}
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl border border-neutral-200/50">
                      <div className="p-2 bg-primary-100 rounded-xl">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="text-neutral-900 font-medium">{user?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl border border-neutral-200/50">
                    <div className="p-2 bg-secondary-100 rounded-xl">
                      <Mail className="h-5 w-5 text-secondary-600" />
                    </div>
                    <span className="text-neutral-900 font-medium">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl border border-neutral-200/50">
                      <div className="p-2 bg-accent-100 rounded-xl">
                        <Phone className="h-5 w-5 text-accent-600" />
                      </div>
                      <span className="text-neutral-900 font-medium">{user?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card hover className="shadow-large mb-8">
            <Card.Header>
              <h2 className="text-2xl font-bold text-neutral-900">Statistics</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Total Reports
                  </label>
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                    <span className="text-3xl font-bold text-primary-600">{reportCount}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="shadow-large" hover>
            <Card.Header>
              <h2 className="text-2xl font-bold text-neutral-900">Security</h2>
            </Card.Header>
            <Card.Content>
              {!isChangingPassword ? (
                <Button 
                  variant="outline" 
                  className="w-full justify-center py-3 inline-flex items-center space-x-2"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </Button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                      {success}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2"
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelPassword}
                      className="flex-1 py-2"
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
