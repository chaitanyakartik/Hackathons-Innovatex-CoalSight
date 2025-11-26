import express from 'express';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    const filter = {};
    
    if (date) filter.date = date;
    if (employeeId) filter.employeeId = employeeId;
    
    const attendance = await Attendance.find(filter);
    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by ID
router.get('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ id: req.params.id });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create attendance
router.post('/', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attendance
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({ id: req.params.id });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json({ message: 'Attendance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
