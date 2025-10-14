import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Mail, Phone, MapPin, Shield, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Profile updated:', formData);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
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
                      onClick={handleSave}
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
                      <span className="text-neutral-900 font-medium">{user?.name || user?.username}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl border border-neutral-200/50">
                      <div className="p-2 bg-secondary-100 rounded-xl">
                        <Mail className="h-5 w-5 text-secondary-600" />
                      </div>
                      <span className="text-neutral-900 font-medium">{user?.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Phone Number
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

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl border border-neutral-200/50">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <MapPin className="h-5 w-5 text-yellow-600" />
                      </div>
                      <span className="text-neutral-900 font-medium">{user?.address || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card hover className="shadow-large">
            <Card.Header>
              <h2 className="text-2xl font-bold text-neutral-900">Account Details</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Account Type
                  </label>
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border ${
                    user?.role === 'admin' 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' 
                      : 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200'
                  }`}>
                    <div className={`p-2 rounded-xl ${
                      user?.role === 'admin' ? 'bg-red-200' : 'bg-primary-200'
                    }`}>
                      <Shield className={`h-5 w-5 ${user?.role === 'admin' ? 'text-red-600' : 'text-primary-600'}`} />
                    </div>
                    <span className="text-neutral-900 font-semibold capitalize">{user?.role}</span>
                  </div>
                </div>

                {user?.role === 'admin' && user?.department && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Department
                    </label>
                    <div className="p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200">
                      <span className="text-neutral-900 font-semibold">{user.department}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Member Since
                  </label>
                  <div className="p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl border border-accent-200">
                    <span className="text-neutral-900 font-semibold">January 2024</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="mt-8" hover>
            <Card.Header>
              <h2 className="text-2xl font-bold text-neutral-900">Security</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-center py-3">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-center py-3">
                  Two-Factor Authentication
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;