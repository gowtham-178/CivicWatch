import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { MapPin, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (user) {
      const redirectPath = user?.role === 'admin' ? '/admin' : '/';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

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
      const redirectPath = result.user?.role === 'admin' ? '/admin' : '/';
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Glass Orbs */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl shadow-lg shadow-sky-500/30">
            <MapPin className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-neutral-900 tracking-tight">
          Sign in to CivicWatch
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Empowering communities through transparent issue reporting
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="glass-card shadow-2xl border border-white/60">
          <Card.Content className="py-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3.5 rounded-xl text-sm animate-slide-up">
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email Address / Mobile
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 glass-input rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none"
                  placeholder="Enter email or mobile number"
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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-base font-semibold py-3.5 btn-gradient rounded-xl shadow-lg shadow-sky-500/25"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/40 text-center">
              <span className="text-sm text-neutral-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                  Sign up
                </Link>
              </span>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;