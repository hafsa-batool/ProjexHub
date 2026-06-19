const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  budget: { type: Number, required: true },
  deadline: { type: Date },
  status: { 
    type: String, 
    enum: ['pending_acceptance', 'ongoing', 'completed', 'rejected'], 
    default: 'pending_acceptance' 
  },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);