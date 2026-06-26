const mongoose = require('mongoose');

const ClientInvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Use adminId instead of invitedBy
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
  expiresAt: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }
}, { timestamps: true });

module.exports = mongoose.model('ClientInvitation', ClientInvitationSchema);