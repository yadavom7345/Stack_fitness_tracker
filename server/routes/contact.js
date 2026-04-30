const express = require('express');
const router = express.Router();

// POST /api/contact — Handle contact form
router.post('/', (req, res) => {
  const { name, email, role, message } = req.body;

  if (!name || !email || !role || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // In production, you'd send an email or store in a DB
  console.log('📧 Contact form submission:', { name, email, role, message });

  res.json({ success: true, message: 'Message received. We\'ll get back to you within 24 hours.' });
});

module.exports = router;
