import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  checkIn: {
    type: String,
    required: false
  },
  checkOut: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent'],
    required: true
  },
  location: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
