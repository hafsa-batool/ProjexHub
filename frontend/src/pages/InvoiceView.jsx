import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaHistory,
  FaHourglassHalf,
} from "react-icons/fa";

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [verification, setVerification] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ useCallback to prevent infinite loop
  const fetchInvoiceData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "x-auth-token": token };

      const invoiceRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api//api/invoices/${id}`,
        { headers },
      );
      setInvoice(invoiceRes.data);

      const verifyRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api//api/invoices/${id}/verify`,
        { headers },
      );
      console.log("Verification API response:", verifyRes.data);
      setVerification(verifyRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAuditTrail = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api//api/invoices/${id}/audit`,
        { headers },
      );
      setAuditTrail(res.data.auditTrail || []);
    } catch (err) {
      console.log("No audit trail yet:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoiceData();
    fetchAuditTrail();
  }, [fetchInvoiceData, fetchAuditTrail]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Invoice not found!</p>
          <Link to="/invoices" className="text-indigo-600 mt-2 inline-block">
            ← Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = verification?.isVerified === true;

  // ✅ Better message based on verification and status
  const getVerificationMessage = () => {
    if (verification?.message) {
      return verification.message;
    }
    if (isVerified) {
      if (invoice?.status === "paid") {
        return "✅ Invoice is paid and blockchain verified";
      }
      return "⏳ Invoice is pending payment - Awaiting admin approval";
    }
    return "⚠️ Verification pending";
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-700";
      case "UPDATE":
        return "bg-blue-100 text-blue-700";
      case "VIEW":
        return "bg-gray-100 text-gray-700";
      case "COMPLETE_PROJECT":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/invoices"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4"
      >
        <FaArrowLeft /> Back to Invoices
      </Link>

      {/* Invoice Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Invoice #{invoice?.invoiceNo || `INV-${invoice?._id?.slice(-6)}`}
            </h1>
            <p className="text-gray-500 mt-1">
              Client:{" "}
              {invoice?.clientId?.name || invoice?.clientName || "Unknown"}
            </p>
            <p className="text-gray-400 text-sm">
              Date: {new Date(invoice?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-600">
              ${invoice?.amount?.toLocaleString()}
            </p>
            <p
              className={`text-sm mt-1 font-semibold ${
                invoice?.status === "paid"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {invoice?.status === "paid" ? "PAID" : "PENDING"}
            </p>
          </div>
        </div>
      </div>

      {/* ========== BLOCKCHAIN VERIFICATION BADGE ========== */}
      <div
        className={`rounded-xl p-4 border ${
          isVerified && invoice?.status === "paid"
            ? "bg-green-50 border-green-200"
            : isVerified && invoice?.status !== "paid"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isVerified && invoice?.status === "paid"
                ? "bg-green-100"
                : isVerified && invoice?.status !== "paid"
                  ? "bg-yellow-100"
                  : "bg-red-100"
            }`}
          >
            {isVerified && invoice?.status === "paid" ? (
              <FaShieldAlt className="text-green-600 text-xl" />
            ) : isVerified && invoice?.status !== "paid" ? (
              <FaHourglassHalf className="text-yellow-600 text-xl" />
            ) : (
              <FaExclamationTriangle className="text-red-600 text-xl" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
              🔗 Blockchain Verification
              {isVerified && invoice?.status === "paid" ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  ✓ VERIFIED
                </span>
              ) : isVerified && invoice?.status !== "paid" ? (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  ⏳ PENDING PAYMENT
                </span>
              ) : (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  ⚠ TAMPERED
                </span>
              )}
            </h3>
            {verification?.blockchainTxId && (
              <p className="text-xs font-mono text-gray-500 mt-1 break-all">
                Transaction ID: {verification.blockchainTxId}
              </p>
            )}
            <p className="text-xs mt-2 text-gray-600">
              {getVerificationMessage()}
            </p>
          </div>
          {isVerified && invoice?.status === "paid" && (
            <FaCheckCircle className="text-green-500 text-2xl" />
          )}
        </div>
      </div>

      {/* ========== AUDIT TRAIL SECTION ========== */}
      {auditTrail.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-4">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaHistory className="text-indigo-600" />
              <h3 className="font-semibold text-gray-800">
                📋 Audit Trail (Immutable Records)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              All actions are logged on blockchain - cannot be modified or
              deleted
            </p>
          </div>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {auditTrail.map((record, idx) => (
              <div key={idx} className="px-5 py-3 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getActionColor(
                        record.action,
                      )}`}
                    >
                      {record.action === "COMPLETE_PROJECT"
                        ? "PROJECT COMPLETED"
                        : record.action}
                    </span>
                    <span className="text-sm text-gray-600">
                      by <span className="font-medium">{record.userName}</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>
                {record.actionDetails && (
                  <p className="text-xs text-gray-500 mt-1 ml-2">
                    {record.actionDetails}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1 ml-2">
                  <span className="text-xs font-mono text-gray-400">
                    TX: {record.blockchainTxId?.slice(0, 30)}...
                  </span>
                  <FaCheckCircle
                    className="text-green-500 text-xs"
                    title="Blockchain Verified"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;
