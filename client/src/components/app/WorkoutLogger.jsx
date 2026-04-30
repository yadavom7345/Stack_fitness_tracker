import { useState, useEffect, useRef } from 'react'
import { api } from '../../api'

export default function WorkoutLogger({ showToast, settings, onShowTimer }) {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);
  const searchRef = useRef(null);
  const startTimeRef = useRef(null);

  const unit = settings.units === 'lbs' ? 'lbs' : 'kg';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Workout timer
  useEffect(() => {
    if (workoutActive) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [workoutActive]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Exercise search
  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const results = await api.getExercises(q);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch {
      setSearchResults([]);
    }
  };

  const addExercise = (exercise) => {
    // Don't add if already in the list
    if (exercises.find(e => e.id === exercise.id)) {
      showToast('Exercise already added');
      setSearchQuery('');
      setShowDropdown(false);
      return;
    }

    setExercises(prev => [...prev, {
      ...exercise,
      sets: [{ id: 1, weight: '', reps: '', completed: false }]
    }]);
    setSearchQuery('');
    setShowDropdown(false);

    if (!workoutActive) {
      setWorkoutActive(true);
    }
  };

  const addSet = (exerciseIdx) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exerciseIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      ex.sets = [...ex.sets, {
        id: ex.sets.length + 1,
        weight: lastSet?.weight || '',
        reps: lastSet?.reps || '',
        completed: false
      }];
      updated[exerciseIdx] = ex;
      return updated;
    });
  };

  const removeSet = (exerciseIdx, setIdx) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exerciseIdx] };
      if (ex.sets.length <= 1) return prev;
      ex.sets = ex.sets.filter((_, i) => i !== setIdx).map((s, i) => ({ ...s, id: i + 1 }));
      updated[exerciseIdx] = ex;
      return updated;
    });
  };

  const updateSet = (exerciseIdx, setIdx, field, value) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exerciseIdx] };
      ex.sets = [...ex.sets];
      ex.sets[setIdx] = { ...ex.sets[setIdx], [field]: value };
      updated[exerciseIdx] = ex;
      return updated;
    });
  };

  const toggleSetComplete = (exerciseIdx, setIdx) => {
    const set = exercises[exerciseIdx].sets[setIdx];
    if (!set.completed && set.weight && set.reps) {
      updateSet(exerciseIdx, setIdx, 'completed', true);
      // Trigger rest timer on set completion
      onShowTimer();
    } else if (set.completed) {
      updateSet(exerciseIdx, setIdx, 'completed', false);
    } else {
      showToast('Enter weight and reps first');
    }
  };

  const removeExercise = (exerciseIdx) => {
    setExercises(prev => prev.filter((_, i) => i !== exerciseIdx));
  };

  const finishWorkout = async () => {
    if (exercises.length === 0) {
      showToast('Add at least one exercise');
      return;
    }

    const completedSets = exercises.some(e => e.sets.some(s => s.completed));
    if (!completedSets) {
      showToast('Complete at least one set');
      return;
    }

    setSaving(true);
    try {
      const workoutData = {
        name: workoutName || 'Workout',
        date: new Date().toISOString(),
        duration: elapsedTime,
        exercises: exercises.map(e => ({
          id: e.id,
          name: e.name,
          category: e.category,
          sets: e.sets.map(s => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
            completed: s.completed
          }))
        }))
      };

      await api.createWorkout(workoutData);
      showToast('Workout saved! 💪');

      // Reset state
      setExercises([]);
      setWorkoutName('');
      setWorkoutActive(false);
      setElapsedTime(0);
      clearInterval(timerRef.current);
    } catch (err) {
      showToast('Failed to save workout');
    }
    setSaving(false);
  };

  const cancelWorkout = () => {
    if (exercises.length > 0 && !window.confirm('Discard this workout?')) return;
    setExercises([]);
    setWorkoutName('');
    setWorkoutActive(false);
    setElapsedTime(0);
    clearInterval(timerRef.current);
  };

  return (
    <div id="workout-view">
      <div className="workout-header">
        <input
          type="text"
          className="workout-name-input"
          placeholder="Workout Name"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />
        {workoutActive && (
          <div className="workout-timer-display">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatTimer(elapsedTime)}</span>
          </div>
        )}
      </div>

      {/* Exercise list */}
      {exercises.map((exercise, exIdx) => (
        <div key={`${exercise.id}-${exIdx}`} className="exercise-block">
          <div className="exercise-block-header">
            <h3>{exercise.name}</h3>
            <button className="btn-ghost" onClick={() => removeExercise(exIdx)} title="Remove exercise">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <table className="sets-table">
            <thead>
              <tr>
                <th>SET</th>
                <th>WEIGHT ({unit})</th>
                <th>REPS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set, setIdx) => (
                <tr key={set.id}>
                  <td><span className="set-num">{set.id}</span></td>
                  <td>
                    <div className="weight-input-group">
                      <button
                        className="weight-btn"
                        onClick={() => updateSet(exIdx, setIdx, 'weight', Math.max(0, (parseFloat(set.weight) || 0) - 2.5))}
                        disabled={set.completed}
                      >
                        -2.5
                      </button>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight}
                        onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                        disabled={set.completed}
                      />
                      <button
                        className="weight-btn"
                        onClick={() => updateSet(exIdx, setIdx, 'weight', (parseFloat(set.weight) || 0) + 2.5)}
                        disabled={set.completed}
                      >
                        +2.5
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={set.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                      disabled={set.completed}
                    />
                  </td>
                  <td>
                    <button
                      className={`set-check-btn${set.completed ? ' checked' : ''}`}
                      onClick={() => toggleSetComplete(exIdx, setIdx)}
                    >
                      <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="add-set-row">
            <button className="btn btn-secondary btn-sm" onClick={() => addSet(exIdx)}>+ Add Set</button>
          </div>
        </div>
      ))}

      {/* Add exercise search */}
      <div className="add-exercise-area" ref={searchRef}>
        <div className="exercise-search-wrapper">
          <input
            type="text"
            className="input"
            placeholder="Search exercises to add..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length > 0 && searchResults.length > 0 && setShowDropdown(true)}
          />
          <div className={`exercise-dropdown${showDropdown ? ' open' : ''}`}>
            {searchResults.map(ex => (
              <div
                key={ex.id}
                className="exercise-dropdown-item"
                onClick={() => addExercise(ex)}
              >
                <span>{ex.name}</span>
                <span className="ex-cat">{ex.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      {exercises.length > 0 && (
        <div className="workout-actions">
          <button className="btn btn-primary btn-block" onClick={finishWorkout} disabled={saving}>
            {saving ? 'Saving...' : 'Finish Workout'}
          </button>
          <button className="btn btn-secondary" onClick={cancelWorkout}>Cancel</button>
        </div>
      )}
    </div>
  )
}
