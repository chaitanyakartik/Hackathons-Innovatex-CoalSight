import express from 'express';
import Hazard from '../models/Hazard.js';

const router = express.Router();

// Get all hazards
router.get('/', async (req, res) => {
  try {
    const { status, severity } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    
    const hazards = await Hazard.find(filter);
    res.json({ hazards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hazard by ID
router.get('/:id', async (req, res) => {
  try {
    const hazard = await Hazard.findOne({ id: req.params.id });
    if (!hazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    res.json(hazard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hazard
router.post('/', async (req, res) => {
  try {
    const hazard = new Hazard(req.body);
    const newHazard = await hazard.save();
    res.status(201).json(newHazard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update hazard
router.put('/:id', async (req, res) => {
  try {
    const hazard = await Hazard.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!hazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    res.json(hazard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete hazard
router.delete('/:id', async (req, res) => {
  try {
    const hazard = await Hazard.findOneAndDelete({ id: req.params.id });
    if (!hazard) {
      return res.status(404).json({ message: 'Hazard not found' });
    }
    res.json({ message: 'Hazard deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
