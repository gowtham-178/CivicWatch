import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, FileText, User, Settings, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin: userIsAdmin } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');



  const citizenLinks = [
    { to: '/', label: 'Map View', icon: MapPin },
    { to: '/report', label: 'Report Issue', icon: FileText },
    { to: '/my-reports', label: 'My Reports', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: Settings },
    { to: '/admin/reports', label: 'All Reports', icon: FileText },
    { to: '/admin/analytics', label: 'Analytics', icon: MapPin },
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <nav className="gradient-bg text-white shadow-large relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Civic Watch</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user && links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === to
                    ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white hover:shadow-soft'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            {user && userIsAdmin() && (
              <Link
                to={isAdmin ? '/' : '/admin'}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                {isAdmin ? 'Citizen View' : 'Admin View'}
              </Link>
            )}
            
            {user ? (
              <div 
                className="relative z-[100]"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 focus:outline-none backdrop-blur-sm border border-white/20"
                >
                  <UserCircle className="h-6 w-6" />
                  <span className="text-sm">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      zIndex: 99999,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">Sign In</button>
                </Link>
                <Link to="/register">
                  <button className="btn-gradient px-6 py-2 rounded-xl text-sm font-medium">Sign Up</button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-100 hover:text-white focus:outline-none focus:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-primary-700/90 to-secondary-700/90 backdrop-blur-sm">
            {user && links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === to
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
            {user && userIsAdmin() && (
              <Link
                to={isAdmin ? '/' : '/admin'}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>{isAdmin ? 'Citizen View' : 'Admin View'}</span>
              </Link>
            )}
            
            {user ? (
              <div className="border-t border-blue-600 pt-3 mt-3">
                <div className="px-3 py-2 text-blue-100">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-blue-200">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-blue-100 hover:bg-blue-600 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-blue-600 pt-3 mt-3 space-y-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-3 py-2 text-blue-100 hover:bg-blue-600 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;