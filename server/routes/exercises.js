const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'exercises.json');

function readExercises() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// GET /api/exercises — List all exercises, optional search
router.get('/', (req, res) => {
  try {
    let exercises = readExercises();
    const { q, category } = req.query;

    if (q) {
      const query = q.toLowerCase();
      exercises = exercises.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
      );
    }

    if (category) {
      exercises = exercises.filter(e =>
        e.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read exercises' });
  }
});

module.exports = router;
