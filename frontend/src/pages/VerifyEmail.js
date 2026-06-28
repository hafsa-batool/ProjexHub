import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// 🔥 RAILWAY URL 
const API_URL = 'https://projexhub-production.up.railway.app';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.msg || 'Email verified successfully!');
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage(err.response?.data?.msg || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/90 to-purple-950/90 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl animate-floatOrb1"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-floatOrb2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-floatOrb3"></div>
        </div>

        <style>{`
          @keyframes floatOrb1 {
            0% { transform: translate(0%, 0%) scale(1); opacity: 0.25; }
            50% { transform: translate(10%, 15%) scale(1.4); opacity: 0.45; }
            100% { transform: translate(-8%, 10%) scale(0.9); opacity: 0.25; }
          }
          @keyframes floatOrb2 {
            0% { transform: translate(0%, 0%) scale(1); opacity: 0.25; }
            50% { transform: translate(-15%, -10%) scale(1.5); opacity: 0.45; }
            100% { transform: translate(8%, -8%) scale(0.95); opacity: 0.25; }
          }
          @keyframes floatOrb3 {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
            50% { transform: translate(-45%, -55%) scale(1.3); opacity: 0.3; }
            100% { transform: translate(-55%, -45%) scale(0.9); opacity: 0.15; }
          }
          .animate-floatOrb1 { animation: floatOrb1 20s infinite alternate ease-in-out; }
          .animate-floatOrb2 { animation: floatOrb2 25s infinite alternate ease-in-out; }
          .animate-floatOrb3 { animation: floatOrb3 30s infinite alternate ease-in-out; }
        `}</style>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-xl mt-6 font-semibold">Verifying your email...</p>
          <p className="text-indigo-200 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/90 to-purple-950/90 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl animate-floatOrb1"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-floatOrb2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-floatOrb3"></div>
      </div>

      <style>{`
        @keyframes floatOrb1 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.25; }
          50% { transform: translate(10%, 15%) scale(1.4); opacity: 0.45; }
          100% { transform: translate(-8%, 10%) scale(0.9); opacity: 0.25; }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.25; }
          50% { transform: translate(-15%, -10%) scale(1.5); opacity: 0.45; }
          100% { transform: translate(8%, -8%) scale(0.95); opacity: 0.25; }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-45%, -55%) scale(1.3); opacity: 0.3; }
          100% { transform: translate(-55%, -45%) scale(0.9); opacity: 0.15; }
        }
        .animate-floatOrb1 { animation: floatOrb1 20s infinite alternate ease-in-out; }
        .animate-floatOrb2 { animation: floatOrb2 25s infinite alternate ease-in-out; }
        .animate-floatOrb3 { animation: floatOrb3 30s infinite alternate ease-in-out; }
      `}</style>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          
          {status === 'success' ? (
            <>
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-emerald-400 text-6xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Verification Successful! ✅</h2>
              <p className="text-emerald-200/80 mb-6">{message}</p>
              <Link 
                to="/login" 
                className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="text-red-400 text-6xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Verification Failed ❌</h2>
              <p className="text-red-200/80 mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Go to Login
                </Link>
                <Link 
                  to="/register" 
                  className="inline-block border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Create New Account
                </Link>
              </div>
            </>
          )}
          
          <p className="mt-6 text-xs text-indigo-300/60">
            Secure verification • Powered by ProjexHub
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;