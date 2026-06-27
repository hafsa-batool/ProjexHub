import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaProjectDiagram, FaUsers, FaClock, FaFileInvoice } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Use context login which uses hardcoded URL
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const features = [
    { icon: <FaProjectDiagram />, text: 'Project Management' },
    { icon: <FaUsers />, text: 'Client Tracking' },
    { icon: <FaClock />, text: 'Time Logging' },
    { icon: <FaFileInvoice />, text: 'Smart Invoicing' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Animated Gradient Orbs - Rotating Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-3/4 left-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-slow-reverse"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[800px] h-[800px] animate-spin-slow">
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50"></div>
          <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-pink-400 rounded-full shadow-lg shadow-pink-500/50"></div>
          <div className="absolute left-0 top-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50"></div>
          <div className="absolute right-0 top-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"></div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border-2 border-white/10 animate-spin-slow-reverse"></div>
        <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 animate-spin-slower"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/10 animate-spin-slow"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-12">
          
          {/* Left Side - Brand Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto lg:mx-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shine"></div>
                <FaProjectDiagram className="text-white text-5xl relative z-10" />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            >
              ProjexHub
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-purple-200 mb-6"
            >
              Your Complete Client & Project Management Solution
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-gray-300 mb-8"
            >
              Track clients, manage projects, log hours, and generate invoices — all in one place.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-purple-300 text-lg">{feature.icon}</div>
                  <span className="text-white text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Welcome Back! 🎉
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-purple-200"
                >
                  Login to access your dashboard
                </motion.p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-sm text-center border border-red-500/30"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <input
                    type="email"
                    name="email"
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
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'} <FaArrowRight />
                </motion.button>
              </form>

              <Link 
                to="/forgot-password" 
                className="text-purple-300 text-sm hover:text-white block text-center mt-3 transition duration-200"
              >
                Forgot Password?
              </Link>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-4 text-purple-200"
              >
                Don't have an account?{' '}
                <Link to="/register" className="text-white font-semibold hover:text-purple-200 hover:underline transition">
                  Create Account
                </Link>
              </motion.p>

              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-xs text-purple-300/70">
                  Secure login • Powered by ProjexHub
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-40px, 40px) rotate(-120deg); }
          66% { transform: translate(30px, -30px) rotate(-240deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, -50px); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-50px, 50px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slower {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 15s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 10s ease-in-out infinite;
        }
        .animate-float-slow-reverse {
          animation: float-slow-reverse 14s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 25s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 18s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;