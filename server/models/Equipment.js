import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Operational', 'Warning', 'Maintenance'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lastMaintenance: {
    type: String,
    required: true
  },
  nextMaintenance: {
    type: String,
    required: true
  },
  operatingHours: {
    type: Number,
    required: true
  },
  healthScore: {
    type: Number,
    required: true
  },
  fuelLevel: {
    type: Number,
    required: false,
    default: 0
  },
  temperature: {
    type: Number,
    required: false,
    default: 0
  }
}, {
  timestamps: true
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
