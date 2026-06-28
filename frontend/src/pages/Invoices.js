import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaFileInvoice, FaCheckCircle, FaHourglassHalf, FaUser, FaProjectDiagram, FaShieldAlt, FaSync, FaExclamationTriangle } from 'react-icons/fa';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/api/invoices`, {
        headers: { 'x-auth-token': token }
      });
      setInvoices(res.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // ✅ Fixed: After marking as paid, re‑verify and update the local list
  const updateStatus = async (id, status, e) => {
    e.stopPropagation();
    if (window.confirm('Mark this invoice as paid?')) {
      try {
        // 1. Mark as paid via backend
        await axios.put(`${process.env.REACT_APP_API_URL}/api/api/invoices/${id}`, { status }, {
          headers: { 'x-auth-token': token }
        });

        // 2. Immediately re‑verify this specific invoice
        const verifyRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/api/invoices/${id}/verify`, {
          headers: { 'x-auth-token': token }
        });

        // 3. Update the local invoice list with the fresh verification flag
        setInvoices(prev => prev.map(inv =>
          inv._id === id
            ? { ...inv, isBlockchainVerified: verifyRes.data.isVerified, status: 'paid' }
            : inv
        ));

        alert('✅ Invoice marked as paid and verified!');
      } catch (err) {
        console.error(err);
        alert('Failed to update invoice');
      }
    }
  };

  const totalPending = invoices.filter(inv => inv.status === 'pending' || inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 dark:border-red-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading invoices...</p>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Invoices
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin ? 'Invoices are auto-generated when client completes a project' : 'Your invoice history'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={fetchInvoices}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl flex items-center gap-2 shadow hover:shadow-lg transition-all duration-150"
              title="Refresh Invoices"
            >
              <FaSync /> Refresh
            </button>
            
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-sm opacity-90">{isAdmin ? 'To Pay' : 'Pending'}</p>
              <p className="text-2xl font-bold">${totalPending}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-sm opacity-90">Paid</p>
              <p className="text-2xl font-bold">${totalPaid}</p>
            </div>
          </div>
        </div>

        {/* Blockchain Info Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 mb-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">🔗 Blockchain Secured Invoices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Invoices are automatically created and verified on blockchain when client completes a project
              </p>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Project</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">🔗 Blockchain</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr 
                    key={invoice._id} 
                    onClick={() => window.location.href = `/invoices/${invoice._id}`}
                    className="cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <td className="p-4">
                      <FaUser className="inline mr-2 text-blue-500" />
                      {invoice.clientId?.name || invoice.clientName || 'Unknown'}
                    </td>
                    <td className="p-4">
                      <FaProjectDiagram className="inline mr-2 text-green-500" />
                      {invoice.projectId?.name || 'Project'}
                    </td>
                    <td className="p-4 font-semibold text-gray-800 dark:text-white">${invoice.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {invoice.status === 'paid' ? <FaCheckCircle /> : <FaHourglassHalf />}
                        {invoice.status === 'unpaid' ? 'PENDING' : invoice.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    
                    {/* Blockchain Column - Shows Pending until paid, then Verified or Tampered */}
                    <td className="p-4">
                      {invoice.status === 'paid' ? (
                        invoice.isBlockchainVerified ? (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                            <FaCheckCircle /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                            <FaExclamationTriangle /> Tampered
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400 text-sm">Pending</span>
                      )}
                    </td>
                    
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      {isAdmin && invoice.status !== 'paid' && (
                        <button 
                          onClick={(e) => updateStatus(invoice._id, 'paid', e)} 
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition flex items-center gap-1 shadow-md"
                        >
                          <FaCheckCircle className="text-xs" /> Pay
                        </button>
                      )}
                      {invoice.status === 'paid' && (
                        <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                          <FaCheckCircle /> Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoices.length === 0 && (
              <div className="text-center py-16">
                <FaFileInvoice className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No invoices yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Invoices are auto-generated when a client completes a project
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;