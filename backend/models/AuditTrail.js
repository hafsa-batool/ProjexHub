const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
  action: { 
    type: String, 
    enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'COMPLETE_PROJECT', 'PAYMENT'],
    required: true 
  },
  invoiceId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  actionDetails: { type: String, default: '' },
  blockchainTxId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditTrail', auditTrailSchema);