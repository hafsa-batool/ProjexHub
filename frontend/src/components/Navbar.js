import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaTachometerAlt, FaUsers, FaProjectDiagram, 
  FaClock, FaFileInvoice, FaSignOutAlt, 
  FaBars, FaTimes, FaUserCircle, FaChartLine,
  FaUserCog, FaSun, FaMoon,
  FaBell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState({ pending: 0, completed: 0, ongoing: 0 });
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  // Fetch notification counts (existing)
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/projects/notification-counts', {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Fetch unread count for bell icon
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { 'x-auth-token': token }
      });
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // ✅ NEW: Clear badge when user opens notifications page
  useEffect(() => {
    if (location.pathname === '/notifications') {
      // Optimistically clear the badge instantly
      setUnreadCount(0);
      // Sync with backend (will be 0 anyway)
      fetchUnreadCount();
    }
  }, [location.pathname]);

  // Fetch on mount and on focus
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    const handleFocus = () => {
      fetchNotifications();
      fetchUnreadCount();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, adminOnly: false },
    { to: '/clients', label: 'Clients', icon: <FaUsers />, adminOnly: true },
    { to: '/projects', label: 'Projects', icon: <FaProjectDiagram />, adminOnly: false },
    { to: '/timelogs', label: 'Time Logs', icon: <FaClock />, adminOnly: false },
    { to: '/invoices', label: 'Invoices', icon: <FaFileInvoice />, adminOnly: false },
    { to: '/profile', label: 'Profile', icon: <FaUserCog />, adminOnly: false }
  ];

  const navItems = allNavItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (path) => location.pathname === path;

  const getProjectBadgeCount = () => {
    if (isClient) {
      return notifications.pending || 0;
    }
    if (isAdmin) {
      return notifications.completed || 0;
    }
    return 0;
  };
  const badgeCount = getProjectBadgeCount();

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ProjexHub
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className={`relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.to)
                      ? 'bg-white/10 text-white shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="font-semibold text-base tracking-wide">{item.label}</span>
                  
                  {item.to === '/projects' && badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg shadow-red-500/50 animate-pulse">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                  
                  {isActive(item.to) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* 🔔 Notification Bell */}
              <Link
                to="/notifications"
                className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
                title="Notifications"
              >
                <FaBell className="text-xl text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1.5 shadow-lg shadow-red-500/50 animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Dark Mode Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                {darkMode ? <FaSun className="text-xl text-yellow-400" /> : <FaMoon className="text-xl text-slate-300" />}
              </motion.button>

              {/* Profile */}
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer group"
              >
                <FaUserCircle className="text-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </Link>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 px-5 py-2.5 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
              >
                <FaSignOutAlt className="text-red-400 text-base" />
                <span className="hidden md:inline text-sm font-semibold text-red-300">Logout</span>
              </button>
              
              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 right-0 bg-slate-900 shadow-2xl z-40 border-b border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                    isActive(item.to)
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-lg">{item.label}</span>
                  {item.to === '/projects' && badgeCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-3 rounded-xl hover:bg-white/10 transition"
                >
                  <FaUserCircle className="text-3xl text-indigo-400" />
                  <div>
                    <p className="text-base font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <p className="text-xs text-indigo-400 mt-1 capitalize">{user?.role}</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;