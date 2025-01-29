import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isStudent, logout, getStoredUser } from '../services/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gradient-to-r from-sky-600 to-blue-600 shadow-lg backdrop-blur-sm bg-opacity-95' 
        : 'bg-gradient-to-r from-sky-500 to-blue-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
            <Link to="/" className="font-bold text-2xl text-white tracking-wide flex items-center space-x-2">
              <span className="text-yellow-300">🏠</span>
              <span className="bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
                Pamusha Pedu
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="block w-6 h-6 relative">
                <span className={`absolute w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'}`} />
              </div>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!authenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/20"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/rooms"
                      className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/20"
                    >
                      Manage Rooms
                    </Link>
                    <Link
                      to="/admin/students"
                      className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/20"
                    >
                      Manage Students
                    </Link>
                    <Link
                      to="/admin/applications"
                      className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/20"
                    >
                      Applications
                    </Link>
                  </>
                )}

                {isStudent() && (
                  <Link
                    to="/student/dashboard"
                    className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/20"
                  >
                    My Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                  <span className="text-white text-sm">👤 {user?.name || user?.email?.split('@')[0] || 'Guest'}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-b from-sky-600 to-blue-700 shadow-lg">
          {!authenticated ? (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 rounded-lg text-base font-medium bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-white border-b border-white/10 mb-2">
                👤 {user?.name || user?.email?.split('@')[0] || 'Guest'}
              </div>
              {isAdmin() && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/rooms"
                    className="block px-4 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    Manage Rooms
                  </Link>
                  <Link
                    to="/admin/students"
                    className="block px-4 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    Manage Students
                  </Link>
                  <Link
                    to="/admin/applications"
                    className="block px-4 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                  >
                    Applications
                  </Link>
                </>
              )}

              {isStudent() && (
                <Link
                  to="/student/dashboard"
                  className="block px-4 py-2 rounded-lg text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                >
                  My Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded-lg text-base font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200 mt-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 