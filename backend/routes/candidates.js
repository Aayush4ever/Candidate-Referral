const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

router.get('/metrics/summary', auth, async (req, res) => {
  try {
    const total = await Candidate.countDocuments();
    const pending = await Candidate.countDocuments({ status: 'Pending' });
    const reviewed = await Candidate.countDocuments({ status: 'Reviewed' });
    const hired = await Candidate.countDocuments({ status: 'Hired' });

    res.json({ total, pending, reviewed, hired });
  } catch (err) {
    console.error('Metrics Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/',
  upload.single('resume'),
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone')
      .matches(/^\d{10}$/)
      .withMessage('Phone must be exactly 10 digits'),
    body('jobTitle').notEmpty().withMessage('Job Title required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, jobTitle } = req.body;

      let resumeUrl = '';
      if (req.file) {
        resumeUrl = `/uploads/${req.file.filename}`;
      }

      const candidate = new Candidate({
        name,
        email,
        phone,
        jobTitle,
        resumeUrl,
        referredBy: null
      });

      await candidate.save();
      res.status(201).json(candidate);
    } catch (err) {
      console.error('Create Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ jobTitle: regex }, { name: regex }, { email: regex }];
    }

    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });

    res.json(candidates);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put(
  '/:id/status',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid candidate ID'),
    body('status')
      .isIn(['Pending', 'Reviewed', 'Hired'])
      .withMessage('Invalid status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate)
        return res.status(404).json({ message: 'Candidate not found' });

      candidate.status = req.body.status;
      await candidate.save();

      res.json(candidate);
    } catch (err) {
      console.error('Status Update Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


router.delete('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: 'Candidate not found' });


    if (candidate.resumeUrl) {
      const filePath = path.join(
        __dirname,
        '..',
        'uploads',
        path.basename(candidate.resumeUrl)
      );

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await candidate.deleteOne();

    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
