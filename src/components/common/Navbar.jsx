import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isStudent, logout, getStoredUser } from '../../services/auth';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Home,
  Users,
  ClipboardList,
  DoorOpen,
  LogOut,
  Menu,
  ChevronLeft,
  LogIn,
  UserPlus,
  BedDouble,
  Wrench,
  Store
} from 'lucide-react';
import BillingSystem from '../admin/BillingSystem';
import AdminAnalytics from '../admin/AdminAnalytics';
import PaymentSystem from '../student/PaymentSystem';
import NotificationBell from './NotificationBell';

const Navbar = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getStoredUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    const handleClick = () => {
      if (isMobile) {
        setSidebarOpen(false);
      }
    };
    
    return (
      <Link
        to={to}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-4 text-sm transition-all duration-300',
          'hover:text-white hover:bg-gray-800',
          isActive
            ? 'bg-white text-gray-900 font-medium shadow-md'
            : 'text-gray-400'
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="font-medium">{children}</span>
      </Link>
    );
  };

  if (authenticated) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Mobile Menu Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-0 h-full bg-black transition-all duration-300 ease-in-out z-50',
            isMobile 
              ? isSidebarOpen ? 'left-0' : '-left-72' // Mobile positioning
              : 'left-0', // Desktop positioning (always anchored to left)
            isMobile ? 'w-72' : isSidebarOpen ? 'w-72' : 'w-20',
            'border-r border-gray-800/50 shadow-xl'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="bg-black px-4 py-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-gray-900">
                  <Store className="h-7 w-7" />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold tracking-tight text-white">
                      PAMUSHA
                    </h1>
                    <p className="text-xs text-gray-400">Student Accommodation</p>
                  </div>
                )}
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className={cn(
                    "ml-auto p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-300",
                    !isSidebarOpen && !isMobile && "rotate-180"
                  )}
                >
                  <ChevronLeft className="w-5 h-5 transform transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
              {isAdmin() && (
                <>
                  <NavLink to="/admin/dashboard" icon={LayoutDashboard}>
                    {isSidebarOpen && "Dashboard"}
                  </NavLink>
                  <NavLink to="/admin/analytics" icon={DoorOpen}>
                    {isSidebarOpen && "Analytics"}
                  </NavLink>
                  <NavLink to="/admin/rooms" icon={BedDouble}>
                    {isSidebarOpen && "Rooms"}
                  </NavLink>
                  <NavLink to="/admin/billings" icon={ClipboardList}>
                    {isSidebarOpen && "Billings"}
                  </NavLink>
                  <NavLink to="/admin/students" icon={Users}>
                    {isSidebarOpen && "Students"}
                  </NavLink>
                  <NavLink to="/admin/applications" icon={ClipboardList}>
                    {isSidebarOpen && "Applications"}
                  </NavLink>
                  <NavLink to="/admin/maintenance" icon={Wrench}>
                    {isSidebarOpen && "Maintenance"}
                  </NavLink>
                </>
              )}

              {isStudent() && (
                <>
                  <NavLink to="/student/dashboard" icon={LayoutDashboard}>
                    {isSidebarOpen && "Dashboard"}
                  </NavLink>
                  <NavLink to="/student/my-room" icon={BedDouble}>
                    {isSidebarOpen && "My Room"}
                  </NavLink>
                  <NavLink to="/student/payments" icon={ClipboardList}>
                    {isSidebarOpen && "Payments"}
                  </NavLink>
                  <NavLink to="/student/maintenance" icon={Wrench}>
                    {isSidebarOpen && "Maintenance"}
                  </NavLink>
                  <NavLink to="/student/communication" icon={Users}>
                    {isSidebarOpen && "Communication"}
                  </NavLink>
                </>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className="bg-black border-t border-gray-800 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 
                  flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-300" />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{user?.name}</div>
                    <div className="text-sm text-gray-400 truncate">{user?.email}</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-start gap-3 px-3 py-3 rounded-lg
                  text-gray-400 hover:text-red-500 hover:bg-gray-800 
                  transition-all duration-300 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={cn(
          'flex-1 transition-all duration-300',
          isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-72' : 'ml-20')
        )}>
          {/* Top Navigation Bar */}
          <header className={cn(
            'bg-white h-16 fixed right-0 top-0 z-40',
            'border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm',
            'transition-all duration-300 left-0',
            !isMobile && (isSidebarOpen ? 'ml-72' : 'ml-20')
          )}>
            <div className="flex items-center space-x-4">
              {/* Always show the mobile menu button when on mobile */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 z-50"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <h1 className="text-lg font-semibold text-gray-900 capitalize tracking-tight">
                {location.pathname.split('/').pop().replace(/-/g, ' ')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated && <NotificationBell />}
            </div>
          </header>
          
          <main className="pt-16">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Public Navigation (when not authenticated)
  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled ? 'bg-black shadow-lg py-2' : 'bg-black/95 py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-4 text-white group">
              <img
                src="/assets/logo.jpg"
                alt="Pamusha Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-bold text-xl sm:text-2xl tracking-tight">PAMUSHA</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-white to-gray-200 text-gray-900 hover:from-gray-100 hover:to-gray-300 transition-all duration-300 shadow-md font-medium transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-all duration-300 w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <main className="pt-2">
        {children}
      </main>
    </>
  );
};

export default Navbar;