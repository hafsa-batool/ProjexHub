import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaArrowRight, FaProjectDiagram } from 'react-icons/fa';
import axios from 'axios';

// 🔥 HARDCODED RAILWAY URL
const API_URL = 'https://projexhub-production.up.railway.app';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name, email, password, role
      });
      setMessage(res.data.msg);
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shine"></div>
                <FaProjectDiagram className="text-white text-3xl relative z-10" />
              </div>
            </motion.div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Create Account 🚀
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-purple-200"
                >
                  Join ProjexHub and start managing your projects
                </motion.p>
              </div>

              {message && (
                <div className="bg-green-500/20 text-green-200 p-3 rounded-xl mb-4 text-center border border-green-500/30">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-center border border-red-500/30">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300/50"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                  {nameError && <p className="text-red-300 text-sm mt-1">{nameError}</p>}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <FaUserTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <select
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="client" className="bg-gray-800">Client</option>
                    <option value="admin" className="bg-gray-800">Admin</option>
                  </select>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'} <FaArrowRight />
                </motion.button>
              </form>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mt-6 text-purple-200"
              >
                Already have an account?{' '}
                <Link to="/login" className="text-white font-semibold hover:text-purple-200 hover:underline transition">
                  Login here
                </Link>
              </motion.p>

              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-xs text-purple-300/70">
                  Join thousands of satisfied users • ProjexHub
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;