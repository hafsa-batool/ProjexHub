const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const AuditTrail = require('../models/AuditTrail');
const User = require('../models/User');
const auth = require('../middleware/auth');

const { generateInvoiceHash, generateBlockchainTxId, logAuditAction } = require('../utils/blockchainHelper');
const { createNotification } = require('../utils/notificationHelper');

// ==============================================
// GET NOTIFICATION COUNTS for navbar badges
// ==============================================
router.get('/notification-counts', auth, async (req, res) => {
  try {
    let counts = { pending: 0, completed: 0, ongoing: 0 };

    if (req.user.role === 'client') {
      const client = await Client.findOne({ userId: req.user.id });
      if (client) {
        counts.pending = await Project.countDocuments({ 
          clientId: client._id, 
          status: 'pending_acceptance' 
        });
        counts.ongoing = await Project.countDocuments({ 
          clientId: client._id, 
          status: 'ongoing' 
        });
      }
    } else if (req.user.role === 'admin') {
      counts.completed = await Project.countDocuments({ status: 'completed' });
      counts.ongoing = await Project.countDocuments({ status: 'ongoing' });
    }

    res.json(counts);
  } catch (err) {
    console.error('❌ Notification count error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET all projects – with overdue detection
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('clientId');
    } else {
      const clients = await Client.find({ userId: req.user.id });
      const clientIds = clients.map(c => c._id);
      projects = await Project.find({ clientId: { $in: clientIds } }).populate('clientId');
    }

    // ✅ Overdue detection
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectsWithOverdue = projects.map(project => {
      const obj = project.toObject ? project.toObject() : project;
      const deadline = new Date(obj.deadline);
      deadline.setHours(0, 0, 0, 0);
      // If deadline is in the past and project is not completed -> overdue
      obj.isOverdue = (obj.status !== 'completed' && deadline < today);
      return obj;
    });

    res.json(projectsWithOverdue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('clientId');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    
    if (req.user.role !== 'admin') {
      const client = await Client.findById(project.clientId._id);
      if (client && client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET projects by client ID
router.get('/client/:clientId', auth, async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId }).populate('clientId');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create project – WITH NOTIFICATION
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, budget, deadline, clientId } = req.body;
    
    if (req.user.role !== 'admin') {
      const client = await Client.findById(clientId);
      if (!client || client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    
    const project = new Project({ 
      name, 
      description, 
      budget, 
      deadline, 
      clientId,
      status: 'pending_acceptance' 
    });
    await project.save();
    res.json(project);

    // ✅ CREATE NOTIFICATION FOR CLIENT
    const client = await Client.findById(clientId);
    if (client) {
      await createNotification(
        client.userId,
        'project_created',
        'New Project Assigned',
        `Admin assigned a new project: "${name}" with budget $${budget}`,
        `/projects/${project._id}`
      );
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ACCEPT/REJECT ROUTE – WITH NOTIFICATIONS
router.put('/:id/respond', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { accept } = req.body;
    
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    
    if (req.user.role !== 'client') {
      return res.status(403).json({ msg: 'Only client can respond to budget' });
    }
    
    const client = await Client.findById(project.clientId);
    if (!client || client.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    if (project.status !== 'pending_acceptance') {
      return res.status(400).json({ msg: 'Budget already responded to' });
    }
    
    if (accept === true) {
      project.status = 'ongoing';
      await project.save();

      // ✅ CREATE NOTIFICATION FOR ADMIN
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'project_accepted',
          'Project Accepted',
          `Client "${client.name}" accepted the project: "${project.name}" with budget $${project.budget}`,
          `/projects/${project._id}`
        );
      }

      return res.json({ success: true, msg: `✅ Budget $${project.budget} accepted!` });
      
    } else if (accept === false) {
      project.status = 'rejected';
      await project.save();

      // ✅ CREATE NOTIFICATION FOR ADMIN
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'project_rejected',
          'Project Rejected',
          `Client "${client.name}" rejected the project: "${project.name}"`,
          `/projects/${project._id}`
        );
      }

      return res.json({ success: true, msg: `❌ Budget rejected.` });
      
    } else {
      return res.status(400).json({ msg: 'Invalid accept value' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// MARK PROJECT AS COMPLETED – WITH NOTIFICATION
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('clientId');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (req.user.role !== 'client')
      return res.status(403).json({ msg: 'Only client can mark project as completed' });
    const client = await Client.findById(project.clientId);
    if (!client || client.userId.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Access denied' });
    if (project.status !== 'ongoing')
      return res.status(400).json({ msg: 'Only ongoing projects can be marked as completed' });

    project.status = 'completed';
    project.completedAt = new Date();
    await project.save();

    let invoice = await Invoice.findOne({ projectId: id });
    let blockchainTxId, invoiceHash;

    if (!invoice) {
      const invoiceNo = `INV-${Date.now()}-${project._id.toString().slice(-4)}`;
      blockchainTxId = generateBlockchainTxId();

      invoice = new Invoice({
        invoiceNo,
        clientName: client.name,
        clientEmail: client.email,
        amount: project.budget,
        projectId: project._id,
        clientId: project.clientId,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        items: [{ description: `Project Completion: ${project.name}`, quantity: 1, rate: project.budget, total: project.budget }],
        status: 'pending',
        blockchainTxId,
        invoiceHash: null,
        isBlockchainVerified: false,
        verifiedAt: null
      });

      await invoice.save();

      const freshInvoice = await Invoice.findById(invoice._id);
      invoiceHash = generateInvoiceHash(freshInvoice);
      freshInvoice.invoiceHash = invoiceHash;
      freshInvoice.isBlockchainVerified = true;
      freshInvoice.verifiedAt = new Date();
      await freshInvoice.save();
      invoice = freshInvoice;

      console.log(`✅ Invoice ${invoice.invoiceNo} created with hash: ${invoiceHash.slice(0, 40)}...`);

      await logAuditAction(AuditTrail, 'COMPLETE_PROJECT', invoice._id.toString(), req.user.id, req.user.name, `Project completed`, blockchainTxId);
      await logAuditAction(AuditTrail, 'CREATE', invoice._id.toString(), 'system', 'System', `Invoice created for $${project.budget}`, blockchainTxId);
    } else {
      invoiceHash = invoice.invoiceHash;
      blockchainTxId = invoice.blockchainTxId;
    }

    // ✅ CREATE NOTIFICATION FOR ADMIN
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'project_completed',
        'Project Completed',
        `Client "${client.name}" completed project: "${project.name}" (Invoice #${invoice.invoiceNo})`,
        `/projects/${project._id}`
      );
    }

    return res.json({
      success: true,
      msg: `✅ Project "${project.name}" completed! Blockchain verified invoice created.`,
      invoice: { id: invoice._id, invoiceNo: invoice.invoiceNo, amount: invoice.amount, status: invoice.status, blockchainTxId, isBlockchainVerified: invoice.isBlockchainVerified }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// UPDATE project (Admin only) – no changes
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Only admin can edit projects' });
    }
    
    const updateData = { ...req.body };
    delete updateData.status;
    
    if (project.status === 'rejected') {
      updateData.status = 'pending_acceptance';
      console.log(`✅ Project "${project.name}" was rejected, status reset to pending_acceptance`);
    }
    
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log(`📋 Final status: ${updatedProject.status}`);
    res.json(updatedProject);
  } catch (err) {
    console.error('❌ Error updating project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    
    if (req.user.role !== 'admin') {
      const client = await Client.findById(project.clientId);
      if (client && client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;