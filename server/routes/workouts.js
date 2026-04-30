const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', 'data', 'workouts.json');

function readWorkouts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeWorkouts(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/workouts — List all workouts
router.get('/', (req, res) => {
  try {
    let workouts = readWorkouts();
    const { sort = 'newest', limit, page = 1 } = req.query;

    // Sort
    if (sort === 'newest') {
      workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'oldest') {
      workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Pagination
    const total = workouts.length;
    if (limit) {
      const lim = parseInt(limit);
      const pg = parseInt(page);
      const start = (pg - 1) * lim;
      workouts = workouts.slice(start, start + lim);
    }

    res.json({ workouts, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read workouts' });
  }
});

// GET /api/workouts/stats/summary — Aggregate stats (MUST be before /:id)
router.get('/stats/summary', (req, res) => {
  try {
    const workouts = readWorkouts();
    const totalWorkouts = workouts.length;
    let totalVolume = 0;
    let totalSets = 0;

    workouts.forEach(w => {
      totalVolume += w.totalVolume || 0;
      totalSets += w.totalSets || 0;
    });

    // Calculate streak
    let streak = 0;
    if (workouts.length > 0) {
      const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = new Date(today);
      for (const w of sorted) {
        const wDate = new Date(w.date);
        wDate.setHours(0, 0, 0, 0);
        const diff = Math.floor((checkDate - wDate) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
          streak++;
          checkDate = wDate;
        } else {
          break;
        }
      }
    }

    // Personal records
    const prs = {};
    workouts.forEach(w => {
      (w.exercises || []).forEach(ex => {
        (ex.sets || []).forEach(set => {
          if (set.completed && set.weight > 0) {
            const e1rm = set.weight * (1 + set.reps / 30); // Epley formula
            if (!prs[ex.name] || e1rm > prs[ex.name].e1rm) {
              prs[ex.name] = {
                exercise: ex.name,
                weight: set.weight,
                reps: set.reps,
                e1rm: Math.round(e1rm * 10) / 10,
                date: w.date
              };
            }
          }
        });
      });
    });

    res.json({
      totalWorkouts,
      totalVolume,
      totalSets,
      streak,
      personalRecords: Object.values(prs)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// GET /api/workouts/:id — Single workout
router.get('/:id', (req, res) => {
  try {
    const workouts = readWorkouts();
    const workout = workouts.find(w => w.id === req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read workout' });
  }
});

// POST /api/workouts — Create workout
router.post('/', (req, res) => {
  try {
    const workouts = readWorkouts();
    const workout = {
      id: uuidv4(),
      name: req.body.name || 'Untitled Workout',
      date: req.body.date || new Date().toISOString(),
      duration: req.body.duration || 0,
      exercises: req.body.exercises || [],
      notes: req.body.notes || ''
    };

    // Calculate totals
    let totalVolume = 0;
    let totalSets = 0;
    workout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed) {
          totalVolume += (set.weight || 0) * (set.reps || 0);
          totalSets++;
        }
      });
    });
    workout.totalVolume = totalVolume;
    workout.totalSets = totalSets;
    workout.exerciseCount = workout.exercises.length;

    workouts.push(workout);
    writeWorkouts(workouts);
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

// PUT /api/workouts/:id — Update workout
router.put('/:id', (req, res) => {
  try {
    const workouts = readWorkouts();
    const idx = workouts.findIndex(w => w.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Workout not found' });

    workouts[idx] = { ...workouts[idx], ...req.body };
    writeWorkouts(workouts);
    res.json(workouts[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// DELETE /api/workouts/:id — Delete workout
router.delete('/:id', (req, res) => {
  try {
    let workouts = readWorkouts();
    const len = workouts.length;
    workouts = workouts.filter(w => w.id !== req.params.id);
    if (workouts.length === len) return res.status(404).json({ error: 'Workout not found' });

    writeWorkouts(workouts);
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

module.exports = router;
