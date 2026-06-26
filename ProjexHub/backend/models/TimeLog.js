const mongoose = require('mongoose');

const TimeLogSchema = new mongoose.Schema({
  hours: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

module.exports = mongoose.model('TimeLog', TimeLogSchema);