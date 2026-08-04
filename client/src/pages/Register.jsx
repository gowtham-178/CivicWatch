import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
import { MapPin, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.name.trim()) {
      setError('Full Name is required');
      setLoading(false);
      return;
    }

    if (!formData.email && !formData.phone) {
      setError('Either email address or mobile number is required');
      setLoading(false);
      return;
    }

    if (!formData.password || formData.password.trim().length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmpassword: formData.confirmPassword
      });

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Glass Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl shadow-lg shadow-sky-500/30">
            <MapPin className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-neutral-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Join CivicWatch to report and resolve local community issues
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="glass-card shadow-2xl border border-white/60">
          <Card.Content className="py-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-slide-up">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 glass-input rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 glass-input rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 glass-input rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 pr-12 glass-input rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 glass-input rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-base font-semibold py-3.5 btn-gradient rounded-xl shadow-lg shadow-sky-500/20"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/40 text-center">
              <span className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                  Sign in
                </Link>
              </span>
            </div>
          </Card.Content>
        </Card>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Welcome to CivicWatch!"
        message="Your account has been created successfully. You are now logged in."
        actionText="Go to Dashboard"
        onAction={() => navigate('/')}
        icon={UserCheck}
      />
    </div>
  );
};

export default Register;
