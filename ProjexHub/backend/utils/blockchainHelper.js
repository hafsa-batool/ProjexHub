const crypto = require('crypto');

function generateInvoiceHash(invoice) {
  // Handle both populated and unpopulated fields
  const projectId = invoice.projectId 
    ? (invoice.projectId._id || invoice.projectId).toString() 
    : '';
  const clientId = invoice.clientId 
    ? (invoice.clientId._id || invoice.clientId).toString() 
    : '';
  
  const dataToHash = `${invoice._id.toString()}|${invoice.amount}|${invoice.status}|${projectId}|${clientId}`;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return hash;
}

function generateBlockchainTxId() {
  return `0x${Date.now()}${Math.random().toString(36).substring(2, 10)}`;
}

async function logAuditAction(AuditTrail, action, invoiceId, userId, userName, details, txId) {
  try {
    const auditRecord = new AuditTrail({
      action,
      invoiceId,
      userId,
      userName: userName || 'System',
      actionDetails: details || '',
      blockchainTxId: txId || `audit_${Date.now()}`
    });
    await auditRecord.save();
    console.log(`📝 Audit Log: ${action} - ${details}`);
    return auditRecord;
  } catch (err) {
    console.error('Audit log error:', err);
    return null;
  }
}

module.exports = { generateInvoiceHash, generateBlockchainTxId, logAuditAction };