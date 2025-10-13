import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { MapPin, Eye, EyeOff, User, Shield } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

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

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };


  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl shadow-large">
            <MapPin className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold bg-gradient-to-r from-neutral-900 to-primary-800 bg-clip-text text-transparent">
          Sign in to Civic Watch
        </h2>
        <p className="mt-3 text-center text-lg text-neutral-600">
          Help improve your community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-large">
          <Card.Content className="py-10 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-slide-up">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-3"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500 font-medium">Quick Login (Demo)</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 text-primary-700 rounded-xl font-medium transition-all duration-300 border border-primary-200"
                  onClick={() => quickLogin('john.doe@email.com', 'user123')}
                >
                  <User className="h-5 w-5 mr-2" />
                  Login as Citizen
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 text-secondary-700 rounded-xl font-medium transition-all duration-300 border border-secondary-200"
                  onClick={() => quickLogin('admin@civicwatch.com', 'admin123')}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Login as Admin
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-neutral-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-8 bg-gradient-to-r from-neutral-50 to-primary-50/30">
          <Card.Content className="py-5 px-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <strong className="text-primary-700">Citizen:</strong> 
                <span className="font-mono">john.doe@email.com / user123</span>
              </div>
              <div className="flex justify-between">
                <strong className="text-secondary-700">Admin:</strong> 
                <span className="font-mono">admin@civicwatch.com / admin123</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;