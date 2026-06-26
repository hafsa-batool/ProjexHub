import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Forgot Password?</h2>
        <p className="text-purple-200 text-center mb-8">Enter your email to reset password</p>
        
        {message && <div className="bg-green-500/20 text-green-200 p-3 rounded-xl mb-4 text-center">{message}</div>}
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <p className="text-center mt-6">
          <Link to="/login" className="text-purple-300 hover:text-white flex items-center justify-center gap-2">
            <FaArrowLeft /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;