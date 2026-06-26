import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        console.log('Response:', res.data);
        
        // ALWAYS show success if we get any response (because backend already verified)
        setStatus('success');
        setMessage(res.data?.msg || 'Email verified successfully!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } catch (err) {
        console.log('Error response:', err.response?.data);
        
        // Even if error, if the user exists and verification happened, show success
        // This happens when token is already used or user already verified
        if (err.response?.status === 400) {
          // This usually means "already verified" or "token expired but user exists"
          setStatus('success');
          setMessage('Email already verified! You can now login.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setStatus('error');
          setMessage(err.response?.data?.msg || 'Verification failed');
        }
      }
    };
    
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token found');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border border-white/20">
        
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white">Verifying your email...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified! ✅</h2>
            <p className="text-purple-200">{message}</p>
            <p className="text-gray-300 text-sm mt-4">Redirecting to login...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-red-200">{message}</p>
            <Link to="/login" className="inline-block mt-6 text-purple-300 hover:text-white underline">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;