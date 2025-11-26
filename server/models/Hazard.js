import mongoose from 'mongoose';

const hazardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  reportedBy: {
    type: String,
    required: true
  },
  reportedByName: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In-progress', 'Resolved'],
    required: true
  },
  assignedTo: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  actionTaken: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: String
  }
}, {
  timestamps: true
});

const Hazard = mongoose.model('Hazard', hazardSchema);

export default Hazard;
