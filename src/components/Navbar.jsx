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
  UserPlus
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
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 
        transition-all duration-300 group ${location.pathname === to ? 'bg-white/20' : ''}`}
    >
      <Icon className="w-5 h-5 group-hover:text-white" />
      <span className="group-hover:text-white font-medium">{children}</span>
    </Link>
  );

  if (authenticated) {
    return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-black 
            transition-all duration-300 ease-in-out z-50 
            ${isSidebarOpen ? 'w-64' : 'w-20'} shadow-xl`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Home className="w-6 h-6 text-white" />
                {isSidebarOpen && (
                  <span className="text-white font-bold">Pamusha Pedu</span>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-all duration-300"
              >
                <ChevronLeft className={`w-5 h-5 transform transition-transform duration-300 
                  ${!isSidebarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 space-y-2 px-3">
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
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                {isSidebarOpen && (
                  <div className="text-white">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-gray-300">{user?.email}</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg
                  bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
          {children}
        </main>
      </div>
    );
  }

  // Public Navigation (when not authenticated)
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
          ${isScrolled 
            ? 'bg-black shadow-lg py-2' 
            : 'bg-gray-900 py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 text-white">
              <Home className="w-6 h-6" />
              <span className="font-bold text-xl">Pamusha Pedu</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white 
                  hover:bg-white/10 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black 
                  hover:bg-gray-100 transition-all duration-300 shadow-md"
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