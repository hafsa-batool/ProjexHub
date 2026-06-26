const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'unpaid'], default: 'pending' },
  dueDate: { type: Date },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    total: Number
  }],
  
  // ========== BLOCKCHAIN FIELDS ==========
  blockchainTxId: { type: String, default: null },
  invoiceHash: { type: String, default: null },
  isBlockchainVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);