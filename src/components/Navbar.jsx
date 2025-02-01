import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isStudent, logout, getStoredUser } from '../services/auth';
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
  Bell,
  Search
} from 'lucide-react';
import BillingSystem from '../components/BillingSystem';
import AdminAnalytics from '../components/AdminAnalytics';
import PaymentSystem from '../components/PaymentSystem';

const Navbar = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group
        ${location.pathname === to 
          ? 'bg-white text-gray-900 shadow-md' 
          : 'text-gray-400 hover:bg-gray-800'}`}
    >
      <Icon className={`w-5 h-5 ${location.pathname === to ? 'text-gray-900' : 'group-hover:text-white'}`} />
      <span className={`font-medium ${location.pathname === to ? 'text-gray-900' : 'group-hover:text-white'}`}>
        {children}
      </span>
    </Link>
  );

  if (authenticated) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-gray-900
            transition-all duration-300 ease-in-out z-50 
            ${isSidebarOpen ? 'w-72' : 'w-20'} border-r border-gray-800`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-gray-900" />
                </div>
                {isSidebarOpen && (
                  <span className="text-white font-bold text-lg">PAMUSHA</span>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-300"
              >
                <ChevronLeft className={`w-5 h-5 transform transition-transform duration-300 
                  ${!isSidebarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Search Bar */}
            {isSidebarOpen && (
              <div className="px-4 pt-6 pb-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-800 text-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

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
                  <NavLink to="/admin/rooms" icon={DoorOpen}>
                    {isSidebarOpen && "Rooms"}
                  </NavLink>
                  <NavLink to="/admin/billings" icon={DoorOpen}>
                    {isSidebarOpen && "Billings"}
                  </NavLink>
                  <NavLink to="/admin/students" icon={Users}>
                    {isSidebarOpen && "Students"}
                  </NavLink>
                  <NavLink to="/admin/applications" icon={ClipboardList}>
                    {isSidebarOpen && "Applications"}
                  </NavLink>
                </>
              )}

              {isStudent() && (
                <>
                <NavLink to="/student/dashboard" icon={LayoutDashboard}>
                  {isSidebarOpen && "Dashboard"}
                </NavLink>
                <NavLink to="/student/payments" icon={LayoutDashboard}>
                  {isSidebarOpen && "Payments"}
                </NavLink>
                <NavLink to="/student/maintenance" icon={LayoutDashboard}>
                  {isSidebarOpen && "Maintenance"}
                </NavLink>
                <NavLink to="/student/communication" icon={LayoutDashboard}>
                  {isSidebarOpen && "Communication"}
                </NavLink>
                </>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 mb-0">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                {isSidebarOpen && (
                  <div>
                    <div className="font-medium text-white">{user?.name}</div>
                    <div className="text-sm text-gray-400">{user?.email}</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg
                  bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 font-medium"
              >
                <LogOut className="w-5 h-5" />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
          {/* Top Navigation Bar */}
          <header className="bg-white h-16 fixed right-0 top-0 z-40 border-b border-gray-200
            flex items-center justify-between px-6 shadow-sm"
            style={{ width: `calc(100% - ${isSidebarOpen ? '18rem' : '5rem'})` }}
          >
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {location.pathname.split('/').pop().charAt(0).toUpperCase() + 
                 location.pathname.split('/').pop().slice(1)}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </header>
          
          <main className="pt-0">
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
          ${isScrolled 
            ? 'bg-gray-900 shadow-lg py-2' 
            : 'bg-gray-900/95 py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-bold text-xl">PAMUSHA</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 
                  hover:bg-gray-800 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white text-gray-900 
                  hover:bg-gray-100 transition-all duration-300 shadow-md font-medium"
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-0">
        {children}
      </main>
    </>
  );
};

export default Navbar;