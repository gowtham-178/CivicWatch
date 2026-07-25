import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
import { MapPin, Eye, EyeOff, UserCheck, Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(location.state?.step || 'register');
  const [formData, setFormData] = useState({
    name: location.state?.name || '',
    email: location.state?.email || '',
    phone: location.state?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timer, setTimer] = useState(60);

  // Handle resend OTP timer countdown
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResendMsg('');

    if (!formData.email && !formData.phone) {
      setError('Either email address or mobile number is required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmpassword: formData.confirmPassword
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const payload = data.data || data;
      const token = payload.token || data.token;
      const userObj = payload.user || data.user;

      if (token && userObj) {
        loginWithToken(token, userObj);
        setShowSuccessModal(true);
      } else {
        setStep('otp');
        setTimer(60);
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setResendMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email || formData.phone,
          otp
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'OTP verification failed');
        setLoading(false);
        return;
      }

      const payload = data.data || data;
      const token = payload.token || data.token;
      const userObj = payload.user || data.user;

      loginWithToken(token, userObj);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || loading) return;

    setLoading(true);
    setError('');
    setResendMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email || formData.phone }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to resend OTP');
      } else {
        setResendMsg('A new 6-digit verification OTP code has been sent!');
        setTimer(60);
        setOtp('');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
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
          {step === 'register' ? 'Create your account' : 'Verify Security Passcode'}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          {step === 'register'
            ? 'Join CivicWatch to report and resolve local community issues'
            : 'We sent a 6-digit code to verify your identity'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="glass-card shadow-2xl border border-white/60">
          <Card.Content className="py-8 px-8">
            {step === 'register' ? (
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
                  {loading ? 'Registering...' : 'Create Account & Get OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
                {error && (
                  <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-slide-up">
                    {error}
                  </div>
                )}

                {resendMsg && (
                  <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 animate-slide-up">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{resendMsg}</span>
                  </div>
                )}

                <div className="bg-sky-50/80 backdrop-blur-sm border border-sky-200/70 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-sky-500/10 rounded-lg text-sky-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs text-sky-700 font-medium">OTP Sent To</p>
                      <p className="text-sm font-bold text-neutral-800 truncate">
                        {formData.email || formData.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('register');
                      setError('');
                      setResendMsg('');
                    }}
                    className="text-xs text-sky-600 hover:text-sky-800 font-semibold underline shrink-0 ml-2"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="otp" className="block text-sm font-semibold text-neutral-700">
                      Enter 6-Digit Passcode
                    </label>
                    <span className="text-xs font-medium text-neutral-500">
                      Expires in 10 mins
                    </span>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength="6"
                    className="block w-full py-4 text-center text-3xl font-extrabold tracking-[0.5em] glass-input rounded-xl text-neutral-900 placeholder-neutral-300 focus:outline-none"
                    placeholder="••••••"
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-base font-semibold py-3.5 btn-gradient rounded-xl shadow-lg shadow-sky-500/25"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('register')}
                    className="inline-flex items-center space-x-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timer > 0 || loading}
                    className={`inline-flex items-center space-x-1 text-sm font-semibold ${
                      timer > 0 || loading
                        ? 'text-neutral-400 cursor-not-allowed'
                        : 'text-sky-600 hover:text-sky-700'
                    }`}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>{timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'register' && (
              <div className="mt-6 pt-4 border-t border-white/40 text-center">
                <span className="text-sm text-neutral-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                    Sign in
                  </Link>
                </span>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Welcome to CivicWatch!"
        message="Your account has been verified successfully. You are now logged in."
        actionText="Go to Dashboard"
        onAction={() => navigate('/')}
        icon={UserCheck}
      />
    </div>
  );
};

export default Register;
