const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');
const Project = require('../models/Project');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// GET all time logs
router.get('/', auth, async (req, res) => {
  try {
    let logs;
    if (req.user.role === 'admin') {
      logs = await TimeLog.find().populate('projectId');
    } else {
      // Find projects belonging to this user's clients
      const clients = await Client.find({ userId: req.user.id });
      const clientIds = clients.map(c => c._id);
      const projects = await Project.find({ clientId: { $in: clientIds } });
      const projectIds = projects.map(p => p._id);
      logs = await TimeLog.find({ projectId: { $in: projectIds } }).populate('projectId');
    }
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create time log
router.post('/', auth, async (req, res) => {
  try {
    const { hours, description, projectId } = req.body;
    
    // Check if project belongs to this user (for non-admin)
    if (req.user.role !== 'admin') {
      const project = await Project.findById(projectId);
      const client = await Client.findById(project.clientId);
      if (client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    
    const log = new TimeLog({ hours, description, projectId });
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE time log
router.delete('/:id', auth, async (req, res) => {
  try {
    const log = await TimeLog.findById(req.params.id);
    if (!log) return res.status(404).json({ msg: 'Time log not found' });
    
    // Check access
    if (req.user.role !== 'admin') {
      const project = await Project.findById(log.projectId);
      const client = await Client.findById(project.clientId);
      if (client.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }
    
    await TimeLog.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Time log deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;