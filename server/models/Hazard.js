import mongoose from 'mongoose';

const hazardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    required: true
  },
  reportedBy: {
    type: String,
    required: true
  },
  reportedDate: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String
  },
  resolvedDate: {
    type: String
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

const Hazard = mongoose.model('Hazard', hazardSchema);

export default Hazard;
