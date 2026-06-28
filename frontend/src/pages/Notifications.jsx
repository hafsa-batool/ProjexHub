import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBell,
  FaCheckCircle,
  FaProjectDiagram,
  FaFileInvoice,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaCheckDouble,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/api/notifications`,
        {
          headers: { "x-auth-token": token },
        },
      );
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/api/notifications/mark-all-read`,
        {},
        {
          headers: { "x-auth-token": token },
        },
      );
      if (res.data.success) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        window.dispatchEvent(new Event("notification-read")); // ✅ Notify Navbar
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Mark single notification as read when clicked
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/api/notifications/${id}/read`,
        {},
        {
          headers: { "x-auth-token": token },
        },
      );
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new Event("notification-read")); // ✅ Notify Navbar
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "project_created":
        return <FaProjectDiagram className="text-blue-500" />;
      case "project_accepted":
        return <FaCheckCircle className="text-green-500" />;
      case "project_completed":
        return <FaCheck className="text-emerald-500" />;
      case "project_rejected":
        return <FaTimes className="text-red-500" />;
      case "invoice_created":
        return <FaFileInvoice className="text-purple-500" />;
      case "invoice_paid":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <FaBell className="text-2xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {notifications.length}{" "}
                {notifications.length === 1 ? "notification" : "notifications"}
                {unreadCount > 0 && (
                  <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                    • {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition text-sm font-semibold"
            >
              <FaCheckDouble /> Mark All as Read
            </button>
          )}
        </div>

        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No notifications yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                All your important updates will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border ${
                    notification.read
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      : "bg-indigo-50/80 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 shadow-indigo-100 dark:shadow-indigo-900/20"
                  }`}
                >
                  <Link
                    to={notification.link}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                    }}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.read
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "bg-indigo-100 dark:bg-indigo-800"
                        }`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`font-semibold text-sm ${
                              notification.read
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-gray-800 dark:text-white"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <>
                              <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 animate-pulse"></span>
                              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            </>
                          )}
                        </div>
                        <p
                          className={`text-sm mt-0.5 ${
                            notification.read
                              ? "text-gray-500 dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          <span className="text-xs text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <span className="text-xs text-indigo-500 flex items-center gap-1">
                            View <FaExternalLinkAlt size={10} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
