const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const User = require('../models/User');
const ClientInvitation = require('../models/ClientInvitation');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const { sendClientInvitationEmail } = require('../utils/sendEmail');

// GET all clients (Admin sees all, Client sees only their own)
router.get('/', auth, async (req, res) => {
  try {
    let clients;
    if (req.user.role === 'admin') {
      clients = await Client.find();
    } else {
      clients = await Client.find({ userId: req.user.id });
    }
    res.json(clients);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    
    if (req.user.role !== 'admin' && client.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    res.json(client);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create client (Direct add by admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const client = new Client({ 
      name, 
      email, 
      phone, 
      company, 
      userId: req.user.id 
    });
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update client
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    
    if (req.user.role !== 'admin' && client.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    
    if (req.user.role !== 'admin' && client.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    await Client.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ==============================================
// ADMIN: INVITE CLIENT (SEND EMAIL)
// ==============================================
router.post('/invite', auth, async (req, res) => {
  console.log("=========================================");
  console.log("🔥 INVITE ROUTE HIT!");
  console.log("=========================================");
  
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log("❌ Access denied: User is not admin");
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    
    const { email } = req.body;
    console.log("📧 Email to invite:", email);
    console.log("👤 Admin ID:", req.user.id);
    
    // ✅ STEP 1: Expire old pending invitations for this email
    const expiredResult = await ClientInvitation.updateMany(
      { email, status: 'pending' },
      { status: 'expired' }
    );
    console.log(`✅ Expired ${expiredResult.modifiedCount} old pending invitations`);
    
    // ✅ STEP 2: Get admin name from database
    const admin = await User.findById(req.user.id);
    if (!admin) {
      console.log("❌ Admin not found in database");
      return res.status(404).json({ msg: 'Admin not found' });
    }
    console.log("👤 Admin Name:", admin.name);
    
    // ✅ STEP 3: Generate new unique token
    const token = crypto.randomBytes(32).toString('hex');
    console.log("🔑 Generated new token:", token);
    
    // ✅ STEP 4: Set expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    console.log("📅 Invitation expires at:", expiresAt);
    
    // ✅ STEP 5: Create new invitation in database
    const invitation = new ClientInvitation({
      email,
      adminId: req.user.id,
      token,
      status: 'pending',
      expiresAt: expiresAt
    });
    await invitation.save();
    console.log("✅ New invitation saved to database with ID:", invitation._id);
    
    // ✅ STEP 6: Send invitation email
    console.log("📧 Attempting to send email to:", email);
    const emailSent = await sendClientInvitationEmail(email, token, admin.name);
    
    if (emailSent) {
      console.log("✅✅✅ EMAIL SENT SUCCESSFULLY! ✅✅✅");
      res.json({ 
        success: true,
        msg: `New invitation sent to ${email}. They have 7 days to accept.` 
      });
    } else {
      console.log("❌❌❌ FAILED TO SEND EMAIL ❌❌❌");
      res.status(500).json({ 
        msg: 'Failed to send email. Please check email configuration.' 
      });
    }
    
  } catch (err) {
    console.error("❌❌❌ ERROR in invite route:", err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

module.exports = router;