import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FaUserCircle, FaEnvelope, FaSave, FaEdit, FaUser, 
  FaUsers, FaProjectDiagram, FaClock, FaFileInvoice, FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [nameError, setNameError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalHours: 0,
    totalInvoices: 0
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clientsRes = await axios.get('http://localhost:5000/api/clients', {
          headers: { 'x-auth-token': token }
        });
        const projectsRes = await axios.get('http://localhost:5000/api/projects', {
          headers: { 'x-auth-token': token }
        });
        const timelogsRes = await axios.get('http://localhost:5000/api/timelogs', {
          headers: { 'x-auth-token': token }
        });
        const invoicesRes = await axios.get('http://localhost:5000/api/invoices', {
          headers: { 'x-auth-token': token }
        });

        setStats({
          totalClients: clientsRes.data.length,
          totalProjects: projectsRes.data.length,
          totalHours: timelogsRes.data.reduce((sum, log) => sum + log.hours, 0),
          totalInvoices: invoicesRes.data.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [token]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters, spaces, hyphens, apostrophes
    if (/^[A-Za-z\s\-']*$/.test(value)) {
      setFormData({ ...formData, name: value });
      setNameError('');
    } else {
      setNameError('Name can only contain letters, spaces, hyphens, and apostrophes.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (nameError) {
      setMessage({ text: 'Please fix the name field error.', type: 'error' });
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined
      };

      const res = await axios.put('http://localhost:5000/api/users/profile', updateData, {
        headers: { 'x-auth-token': token }
      });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: err.response?.data?.msg || 'Update failed', type: 'error' });
    }
  };

  const statCards = [
    { title: 'Total Clients', value: stats.totalClients, icon: <FaUsers />, color: 'from-blue-500 to-blue-600' },
    { title: 'Projects', value: stats.totalProjects, icon: <FaProjectDiagram />, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Hours Logged', value: stats.totalHours, icon: <FaClock />, color: 'from-purple-500 to-purple-600' },
    { title: 'Invoices', value: stats.totalInvoices, icon: <FaFileInvoice />, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <FaUserCircle className="text-white text-7xl" />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">{user?.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold capitalize">
                  {user?.role}
                </span>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {statCards.map((stat, idx) => (
                    <div key={idx} className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 text-white text-center`}>
                      <div className="text-lg mx-auto">{stat.icon}</div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs opacity-90">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-150 font-medium"
              >
                <FaSignOutAlt />
                Logout Account
              </button>
            </div>
          </div>

          {/* Right Column - Edit Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <FaUserCircle className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit Profile</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all duration-150"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`mb-4 p-3 rounded-xl ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  {message.text}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Change Password (optional)</p>
                    <div className="space-y-3">
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-150">
                      <FaSave /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <FaUser className="text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <FaEnvelope className="text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="font-medium text-gray-800 dark:text-white">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;