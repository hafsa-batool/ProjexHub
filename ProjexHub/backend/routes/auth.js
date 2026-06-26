const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ClientInvitation = require('../models/ClientInvitation');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/sendEmail');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'client',
      isVerified: false,
      verificationToken: verificationToken
    });
    
    await user.save();
    await sendVerificationEmail(email, verificationToken);
    
    res.json({ 
      success: true,
      msg: 'Registration successful! Please check your email to verify your account.' 
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// CHECK INVITE - Check if user already exists for this invitation
router.get('/check-invite/:token', async (req, res) => {
  try {
    const { token } = req.params;
    console.log('🔍 Checking invitation for token:', token);
    
    const invitation = await ClientInvitation.findOne({ 
      token, 
      status: 'pending',
      expiresAt: { $gt: Date.now() }
    });
    
    if (!invitation) {
      console.log('❌ Invitation not found or expired');
      return res.status(400).json({ msg: 'Invalid or expired invitation link' });
    }
    
    console.log('📧 Invitation email:', invitation.email);
    
    const existingUser = await User.findOne({ email: invitation.email });
    
    if (existingUser) {
      console.log('✅ User already exists:', existingUser.email);
      return res.json({
        userExists: true,
        msg: 'You already have an account. Click accept to continue as a client.'
      });
    } else {
      console.log('✅ New user, needs to create account');
      return res.json({
        userExists: false,
        msg: 'Please create your account to continue.'
      });
    }
  } catch (err) {
    console.error('❌ Check invite error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ACCEPT INVITATION
// ACCEPT INVITATION
router.post('/accept-invite/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;
    
    console.log('🔍 Accepting invitation for token:', token);
    console.log('📦 Request body:', req.body);
    
    const invitation = await ClientInvitation.findOne({ 
      token, 
      status: 'pending',
      expiresAt: { $gt: Date.now() }
    });
    
    if (!invitation) {
      return res.status(400).json({ msg: 'Invalid or expired invitation link' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email: invitation.email });
    
    if (user) {
      // ✅ USER EXISTS - just add client relationship (no name/password needed)
      console.log('✅ User already exists, adding as client');
      const Client = require('../models/Client');
      
      const existingClient = await Client.findOne({ 
        email: invitation.email, 
        addedBy: invitation.adminId 
      });
      
      if (!existingClient) {
        const client = new Client({
          name: user.name,
          email: user.email,
          userId: user.id,
          addedBy: invitation.adminId
        });
        await client.save();
        console.log('✅ Client record created');
      }
      
      invitation.status = 'accepted';
      await invitation.save();
      
      return res.json({ 
        success: true,
        msg: 'You have been added as a client! You can now login.' 
      });
      
    } else {
      // ✅ USER DOES NOT EXIST - need name and password
      console.log('✅ User does not exist, creating new account');
      
      if (!name || !password) {
        return res.status(400).json({ 
          msg: 'Name and password are required to create account' 
        });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({
        name: name,
        email: invitation.email,
        password: hashedPassword,
        role: 'client',
        isVerified: true
      });
      await user.save();
      console.log('✅ User account created');
      
      const Client = require('../models/Client');
      const client = new Client({
        name: user.name,
        email: user.email,
        userId: user.id,
        addedBy: invitation.adminId
      });
      await client.save();
      console.log('✅ Client record created');
      
      invitation.status = 'accepted';
      await invitation.save();
      
      return res.json({ 
        success: true,
        msg: 'Account created successfully! You have been added as a client. Please login.' 
      });
    }
    
  } catch (err) {
    console.error('❌ Accept invite error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});
// VERIFY EMAIL
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification link' });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return res.status(200).json({ msg: 'Email verified successfully! You can now login.' });
    
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid email or password' });
    }
    
    if (!user.isVerified) {
      console.log('Email not verified');
      return res.status(401).json({ msg: 'Please verify your email first!' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(400).json({ msg: 'Invalid email or password' });
    }
    
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,  // ✅ ADD THIS LINE
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No account found with this email' });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    
    await sendResetPasswordEmail(email, resetToken);
    res.json({ msg: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) return res.status(400).json({ msg: 'Invalid or expired reset link' });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ msg: 'Password reset successful! Please login.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;