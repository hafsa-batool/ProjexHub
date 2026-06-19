import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSearch, FaUsers, FaPhone, FaEnvelope, FaBuilding, FaPaperPlane, FaTimes } from 'react-icons/fa';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  const fetchClients = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clients', {
        headers: { 'x-auth-token': token }
      });
      setClients(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ name: client.name, email: client.email, phone: client.phone || '', company: client.company || '' });
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/clients/${editingClient._id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      setFormData({ name: '', email: '', phone: '', company: '' });
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`http://localhost:5000/api/clients/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchClients();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleInviteClient = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage('');
    setInviteError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/clients/invite', 
        { email: inviteEmail },
        { headers: { 'x-auth-token': token } }
      );
      setInviteMessage(res.data.msg);
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteMessage('');
      }, 2000);
      fetchClients();
    } catch (err) {
      setInviteError(err.response?.data?.msg || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading clients...</p>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Clients
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your client relationships</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150"
            >
              <FaPaperPlane /> Invite New Client
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search clients by name, email or company..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Edit Client Modal */}
        <AnimatePresence>
          {editingClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setEditingClient(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaEdit className="text-blue-500" />
                    Edit Client
                  </h2>
                  <button onClick={() => setEditingClient(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FaTimes size={20} />
                  </button>
                </div>
                <form onSubmit={handleUpdateClient} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingClient(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Update Client
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invite Client Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowInviteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaPaperPlane className="text-emerald-500" />
                    Invite New Client
                  </h2>
                  <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FaTimes size={20} />
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Send an invitation email to add a new client. They will receive a link to create their account.
                </p>
                
                {inviteMessage && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-xl mb-4 text-sm">
                    {inviteMessage}
                  </div>
                )}
                
                {inviteError && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-xl mb-4 text-sm">
                    {inviteError}
                  </div>
                )}
                
                <form onSubmit={handleInviteClient} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Client Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviteLoading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
                    >
                      <FaPaperPlane /> {inviteLoading ? 'Sending...' : 'Send Invitation'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clients Grid - With Link Wrapper for Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, idx) => (
            <Link
              key={client._id}
              to={`/clients/${client._id}`}
              className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-150 cursor-pointer"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{client.name}</h3>
                      <p className="text-sm opacity-90">{client.company || 'Independent'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(client);
                      }} 
                      className="p-2 hover:bg-white/20 rounded-lg transition-all duration-150"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(client._id);
                      }} 
                      className="p-2 hover:bg-white/20 rounded-lg transition-all duration-150"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FaEnvelope className="text-blue-500" />
                  <span className="text-sm">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaPhone className="text-green-500" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaBuilding className="text-purple-500" />
                    <span className="text-sm">{client.company}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <FaUsers className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No clients found. Click "Invite New Client" to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;