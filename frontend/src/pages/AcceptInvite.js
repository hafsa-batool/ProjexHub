import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaUser, FaLock } from 'react-icons/fa';

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/check-invite/${token}`);
        
        if (res.data.userExists) {
          setStatus('existing-user');
          setMessage(res.data.msg);
        } else {
          setShowCreateForm(true);
          setStatus('needs-account');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.msg || 'Invalid or expired invitation');
      }
    };
    
    checkInvitation();
  }, [token]);

  const handleAcceptAsClient = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/accept-invite/${token}`, {});
      
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.msg);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(res.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to accept invitation');
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/accept-invite/${token}`, { 
        name, 
        password 
      });
      
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.msg);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(res.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white text-center">Checking invitation...</h2>
          </>
        )}
        
        {status === 'existing-user' && (
          <>
            <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back!</h2>
            <p className="text-purple-200 text-center mb-6">{message}</p>
            {error && <p className="text-red-300 text-center mb-4 text-sm">{error}</p>}
            <button
              onClick={handleAcceptAsClient}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Accept & Continue
            </button>
          </>
        )}
        
        {showCreateForm && (
          <>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Create Your Account</h2>
            <p className="text-purple-200 text-center mb-6">You've been invited as a client. Please create your account to continue.</p>
            
            {error && <p className="text-red-300 text-center mb-4 text-sm">{error}</p>}
            
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                Create Account & Accept
              </button>
            </form>
          </>
        )}
        
        {status === 'success' && (
          <>
            <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white text-center mb-2">Success!</h2>
            <p className="text-purple-200 text-center">{message}</p>
            <p className="text-gray-300 text-center mt-4">Redirecting to login...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white text-center mb-2">Invalid Invitation</h2>
            <p className="text-red-200 text-center">{message}</p>
            <Link to="/login" className="block text-center mt-6 text-purple-300 hover:text-white underline">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;