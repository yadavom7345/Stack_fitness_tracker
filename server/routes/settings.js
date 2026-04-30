const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.VERCEL 
  ? path.join('/tmp', 'settings.json') 
  : path.join(__dirname, '..', 'data', 'settings.json');

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { units: 'kg', restTimerDuration: 90, notifications: true };
  }
}

function writeSettings(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/settings
router.get('/', (req, res) => {
  res.json(readSettings());
});

// PUT /api/settings
router.put('/', (req, res) => {
  try {
    const current = readSettings();
    const updated = { ...current, ...req.body };
    writeSettings(updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
