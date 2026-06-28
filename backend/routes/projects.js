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
      counts.completed = await Project.countDocuments({ 
        status: 'completed', 
        createdBy: req.user.id 
      });
      counts.ongoing = await Project.countDocuments({ 
        status: 'ongoing', 
        createdBy: req.user.id 
      });
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
      projects = await Project.find({ createdBy: req.user.id }).populate('clientId');
    } else {
      const clients = await Client.find({ userId: req.user.id });
      const clientIds = clients.map(c => c._id);
      projects = await Project.find({ clientId: { $in: clientIds } }).populate('clientId');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectsWithOverdue = projects.map(project => {
      const obj = project.toObject ? project.toObject() : project;
      const deadline = new Date(obj.deadline);
      deadline.setHours(0, 0, 0, 0);
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
    
    if (req.user.role === 'admin') {
      if (project.createdBy && project.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    } else {
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
    const projects = await Project.find({ 
      clientId: req.params.clientId,
      createdBy: req.user.id
    }).populate('clientId');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create project – notification to BOTH client AND admin
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
      status: 'pending_acceptance',
      createdBy: req.user.id
    });
    await project.save();
    res.json(project);

    const client = await Client.findById(clientId);
    if (client) {
      // 🔥 Notification to CLIENT
      await createNotification(
        client.userId,
        'project_created',
        'New Project Assigned',
        `Admin assigned a new project: "${name}" with budget $${budget}`,
        `/projects`
      );
    }

    // 🔥 Notification to ADMIN (self)
    await createNotification(
      req.user.id,
      'project_created',
      'Project Created',
      `You created a new project: "${name}" with budget $${budget}`,
      `/projects`
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ACCEPT/REJECT ROUTE – notifications to BOTH admin AND client
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

      // 🔥 Notification to ADMIN
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'project_accepted',
          'Project Accepted',
          `Client "${client.name}" accepted the project: "${project.name}" with budget $${project.budget}`,
          `/projects`
        );
      }

      // 🔥 Notification to CLIENT (self)
      await createNotification(
        req.user.id,
        'project_accepted',
        'Project Accepted',
        `You accepted the project: "${project.name}" with budget $${project.budget}`,
        `/projects`
      );

      return res.json({ success: true, msg: `✅ Budget $${project.budget} accepted!` });
      
    } else if (accept === false) {
      project.status = 'rejected';
      await project.save();

      // 🔥 Notification to ADMIN
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'project_rejected',
          'Project Rejected',
          `Client "${client.name}" rejected the project: "${project.name}"`,
          `/projects`
        );
      }

      // 🔥 Notification to CLIENT (self)
      await createNotification(
        req.user.id,
        'project_rejected',
        'Project Rejected',
        `You rejected the project: "${project.name}"`,
        `/projects`
      );

      return res.json({ success: true, msg: `❌ Budget rejected.` });
      
    } else {
      return res.status(400).json({ msg: 'Invalid accept value' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// MARK PROJECT AS COMPLETED – notification to BOTH admin and client
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

    // 🔥 Notification to ADMIN
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'project_completed',
        'Project Completed',
        `Client "${client.name}" completed project: "${project.name}" (Invoice #${invoice.invoiceNo})`,
        `/projects`
      );
    }

    // 🔥 Notification to CLIENT (self)
    await createNotification(
      req.user.id,
      'project_completed',
      'Project Completed',
      `You completed the project: "${project.name}" (Invoice #${invoice.invoiceNo})`,
      `/projects`
    );

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

// UPDATE project (Admin only) – with notification on budget revision
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Only admin can edit projects' });
    }
    
    if (project.createdBy && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to edit this project' });
    }
    
    const updateData = { ...req.body };
    delete updateData.status;
    
    let resetStatus = false;
    if (project.status === 'rejected') {
      updateData.status = 'pending_acceptance';
      resetStatus = true;
      console.log(`✅ Project "${project.name}" was rejected, status reset to pending_acceptance`);
    }
    
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log(`📋 Final status: ${updatedProject.status}`);

    if (resetStatus) {
      const client = await Client.findById(project.clientId);
      if (client) {
        // 🔥 Notification to CLIENT
        await createNotification(
          client.userId,
          'project_created',
          'Budget Revised',
          `Admin revised the budget for project "${project.name}" to $${updateData.budget || project.budget}. Please review.`,
          `/projects`
        );
      }

      // 🔥 Notification to ADMIN (self)
      await createNotification(
        req.user.id,
        'project_updated',
        'Budget Revised',
        `You revised the budget for project "${project.name}" to $${updateData.budget || project.budget}.`,
        `/projects`
      );
    }

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
    } else {
      if (project.createdBy && project.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'You cannot delete this project' });
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;