const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const AuditTrail = require('../models/AuditTrail');
const auth = require('../middleware/auth');
const { generateInvoiceHash, generateBlockchainTxId, logAuditAction } = require('../utils/blockchainHelper');

// GET all invoices – re‑verify paid invoices on every list fetch
router.get('/', auth, async (req, res) => {
  try {
    let invoices;
    if (req.user.role === 'admin') {
      invoices = await Invoice.find().populate('clientId projectId');
    } else {
      const clients = await Client.find({ userId: req.user.id });
      const clientIds = clients.map(c => c._id);
      invoices = await Invoice.find({ clientId: { $in: clientIds } }).populate('clientId projectId');
    }

    for (const inv of invoices) {
      if (inv.status === 'paid' && inv.invoiceHash) {
        const currentHash = generateInvoiceHash(inv);
        const isVerified = (currentHash === inv.invoiceHash);
        if (isVerified !== inv.isBlockchainVerified) {
          inv.isBlockchainVerified = isVerified;
          await inv.save({ validateBeforeSave: false });
          console.log(`🔄 List updated: ${inv.invoiceNo} -> ${isVerified ? 'Verified' : 'Tampered'}`);
        }
      }
    }

    res.json(invoices);
  } catch (err) {
    console.error('❌ Error fetching invoices:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single invoice with audit
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('clientId projectId');
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    if (req.user.role !== 'admin') {
      const client = await Client.findById(invoice.clientId);
      if (!client || client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    await logAuditAction(AuditTrail, 'VIEW', invoice._id.toString(), req.user.id, req.user.name || req.user.email, `Invoice viewed - $${invoice.amount}`, invoice.blockchainTxId);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE invoice status (Mark as Paid)
router.put('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const oldStatus = invoice.status;
    const newStatus = req.body.status;
    invoice.status = newStatus;
    invoice.updatedAt = new Date();
    const newHash = generateInvoiceHash(invoice);
    invoice.invoiceHash = newHash;
    invoice.isBlockchainVerified = true;
    invoice.verifiedAt = new Date();
    if (!invoice.blockchainTxId) {
      invoice.blockchainTxId = generateBlockchainTxId();
    }
    await invoice.save();
    console.log(`✅ Invoice ${invoice.invoiceNo}: ${oldStatus} → ${newStatus}`);
    await logAuditAction(AuditTrail, 'UPDATE', invoice._id.toString(), req.user.id, req.user.name, `Status changed to ${newStatus}`, invoice.blockchainTxId);
    res.json({ msg: 'Invoice updated with blockchain verification', invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET audit trail
router.get('/:id/audit', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    if (req.user.role !== 'admin') {
      const client = await Client.findById(invoice.clientId);
      if (!client || client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    const auditTrail = await AuditTrail.find({ invoiceId: req.params.id }).sort({ createdAt: -1 });
    res.json({ auditTrail });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// VERIFY single invoice (used by view page)
router.get('/:id/verify', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });

    if (!invoice.invoiceHash) {
      return res.json({ success: true, isVerified: true, message: '✅ Legacy invoice', blockchainTxId: invoice.blockchainTxId });
    }

    const currentHash = generateInvoiceHash(invoice);
    const isVerified = (currentHash === invoice.invoiceHash);

    if (isVerified !== invoice.isBlockchainVerified) {
      invoice.isBlockchainVerified = isVerified;
      await invoice.save({ validateBeforeSave: false });
      console.log(`🔍 View page updated: ${invoice.invoiceNo} -> ${isVerified ? 'Verified' : 'Tampered'}`);
    }

    let message = '';
    if (isVerified) {
      message = invoice.status === 'paid'
        ? '✅ Invoice is paid and blockchain verified'
        : '⏳ Invoice is valid but pending payment';
    } else {
      message = '❌ Verification failed – Invoice data has been tampered!';
    }

    res.json({ success: true, isVerified, blockchainTxId: invoice.blockchainTxId, message, status: invoice.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Force refresh all invoices (admin only)
router.post('/refresh-all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const invoices = await Invoice.find();
    let updated = 0;
    for (const inv of invoices) {
      if (inv.invoiceHash) {
        const currentHash = generateInvoiceHash(inv);
        const isValid = (currentHash === inv.invoiceHash);
        if (isValid !== inv.isBlockchainVerified) {
          inv.isBlockchainVerified = isValid;
          await inv.save({ validateBeforeSave: false });
          updated++;
        }
      }
    }
    res.json({ success: true, message: `Re-verified ${invoices.length} invoices, updated ${updated} statuses.` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Force fix single invoice (admin only)
router.get('/force-fix/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    const newHash = generateInvoiceHash(invoice);
    invoice.invoiceHash = newHash;
    invoice.isBlockchainVerified = true;
    invoice.verifiedAt = new Date();
    await invoice.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Invoice fixed', invoice });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;