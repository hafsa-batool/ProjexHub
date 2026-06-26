import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaClock, FaProjectDiagram, FaCalendarAlt, FaUser } from 'react-icons/fa';

const TimeLogs = () => {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ hours: '', description: '', projectId: '' });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/timelogs', {
        headers: { 'x-auth-token': token }
      });
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [token]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs();
    fetchProjects();
  }, [fetchLogs, fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/timelogs', formData, {
        headers: { 'x-auth-token': token }
      });
      setFormData({ hours: '', description: '', projectId: '' });
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time log?')) {
      try {
        await axios.delete(`http://localhost:5000/api/timelogs/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchLogs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 dark:border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading time logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isAdmin ? 'Client Logs' : 'Time Logs'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin ? 'View all clients working hours' : 'Track your working hours'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-sm opacity-90">
                {isAdmin ? 'Total Hours (All Clients)' : 'Your Total Hours'}
              </p>
              <p className="text-2xl font-bold">{totalHours} hrs</p>
            </div>
            {isClient && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-150"
              >
                <FaPlus /> {showForm ? 'Cancel' : 'Log Hours'}
              </button>
            )}
          </div>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && isClient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaClock className="text-purple-500" />
                Log Your Work Hours
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    required
                  >
                    <option value="">Select Project *</option>
                    {projects.map(project => <option key={project._id} value={project._id}>{project.name}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Hours *"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description (e.g., Completed homepage design)"
                    className="w-full md:col-span-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition">
                    Save Time Log
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">
                    {isAdmin ? <><FaUser className="inline mr-2" /> Client / Project</> : 'Project'}
                  </th>
                  <th className="p-4 text-left">Hours</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-4">
                      <FaProjectDiagram className="inline mr-2 text-blue-500" />
                      {log.projectId?.name}
                      {isAdmin && log.projectId?.clientId && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Client: {log.projectId?.clientId?.name || 'N/A'})
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {log.hours} hrs
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{log.description || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      <FaCalendarAlt className="inline mr-2 text-gray-400" />
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(log._id)} className="text-red-500 hover:text-red-700 transition">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="text-center py-16">
                <FaClock className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isClient ? 'No time logs yet. Click "Log Hours" to add your working hours.' : 'No time logs added by clients yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLogs;