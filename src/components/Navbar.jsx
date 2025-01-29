import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isStudent, logout, getStoredUser } from '../services/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
        ${isScrolled ? 'hover:bg-white/15' : 'hover:bg-white/20'} 
        ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg backdrop-blur-md bg-opacity-90 py-2' 
          : 'bg-gradient-to-r from-violet-500 to-indigo-500 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="font-bold text-2xl text-white tracking-wide flex items-center space-x-3 group">
              <Home className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-white to-indigo-100 text-transparent bg-clip-text font-sans">
                Pamusha Pedu
              </span>
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-white/10 transition-all duration-300"
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!authenticated ? (
              <div className="flex items-center space-x-4">
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full text-sm font-medium bg-white text-indigo-600 hover:bg-indigo-50 
                    transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <div className="flex items-center space-x-2">
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink to="/admin/rooms">Rooms</NavLink>
                    <NavLink to="/admin/students">Students</NavLink>
                    <NavLink to="/admin/applications">Applications</NavLink>
                  </div>
                )}

                {isStudent() && (
                  <NavLink to="/student/dashboard">My Dashboard</NavLink>
                )}

                <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {user?.name || user?.email?.split('@')[0] || 'Guest'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500 
                      text-white hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-2 bg-gradient-to-b from-violet-600 to-indigo-700 shadow-lg">
              {!authenticated ? (
                <>
                  <NavLink to="/login" className="block w-full">Login</NavLink>
                  <Link
                    to="/register"
                    className="block px-4 py-2 rounded-lg text-base font-medium bg-white text-indigo-600 
                      hover:bg-indigo-50 transition-all duration-300 text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 px-4 py-2 text-white border-b border-white/10 mb-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || user?.email?.split('@')[0] || 'Guest'}</span>
                  </div>
                  
                  {isAdmin() && (
                    <>
                      <NavLink to="/admin/dashboard" className="block">Dashboard</NavLink>
                      <NavLink to="/admin/rooms" className="block">Rooms</NavLink>
                      <NavLink to="/admin/students" className="block">Students</NavLink>
                      <NavLink to="/admin/applications" className="block">Applications</NavLink>
                    </>
                  )}

                  {isStudent() && (
                    <NavLink to="/student/dashboard" className="block">My Dashboard</NavLink>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg text-base 
                      font-medium text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;