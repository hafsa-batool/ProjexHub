import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPaperPlane, FaUser } from 'react-icons/fa';

const InviteClient = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s\-']*$/.test(value)) {
      setName(value);
      setNameError('');
    } else {
      setNameError('Name can only contain letters, spaces, hyphens, and apostrophes.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameError) {
      setError('Please fix the name field error.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/clients/invite', 
        { name, email },
        { headers: { 'x-auth-token': token } }
      );
      setMessage(res.data.msg);
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Invite Client</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Send invitation email to add a new client</p>
          
          {message && <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-xl mb-4">{message}</div>}
          {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-xl mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Client Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={name}
                onChange={handleNameChange}
                required
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Client Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
            >
              <FaPaperPlane /> {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteClient;