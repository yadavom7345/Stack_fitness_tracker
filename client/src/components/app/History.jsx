import { useState, useEffect } from 'react'
import { api } from '../../api'

export default function History({ showToast, settings }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const unit = settings.units === 'lbs' ? 'lbs' : 'kg';

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkouts({ sort: 'newest' });
      setWorkouts(data.workouts);
    } catch (err) {
      console.error('Failed to load workouts:', err);
    }
    setLoading(false);
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm('Delete this workout? This cannot be undone.')) return;
    try {
      await api.deleteWorkout(id);
      setWorkouts(prev => prev.filter(w => w.id !== id));
      showToast('Workout deleted');
    } catch {
      showToast('Failed to delete workout');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const formatVolume = (vol) => {
    if (!vol) return '0';
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div id="history-view">
      <div className="page-header">
        <h1>History</h1>
        <p>Review your past workouts</p>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : workouts.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <h3>No History Yet</h3>
          <p>Completed workouts will appear here.</p>
        </div>
      ) : (
        <div className="history-list">
          {workouts.map(w => (
            <div key={w.id} className="history-card">
              <div className="history-card-summary" onClick={() => toggleExpand(w.id)}>
                <div className="history-card-left">
                  <h4>{w.name}</h4>
                  <p>{formatDate(w.date)}</p>
                </div>
                <div className="history-card-right">
                  <div className="history-stat">
                    <span className="hs-val">{w.exerciseCount || w.exercises?.length || 0}</span>
                    <span className="hs-lbl">EXERCISES</span>
                  </div>
                  <div className="history-stat">
                    <span className="hs-val">{w.totalSets || 0}</span>
                    <span className="hs-lbl">SETS</span>
                  </div>
                  <div className="history-stat">
                    <span className="hs-val">{formatVolume(w.totalVolume)}</span>
                    <span className="hs-lbl">VOLUME</span>
                  </div>
                  <svg
                    className={`history-card-expand${expandedId === w.id ? ' open' : ''}`}
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <div className={`history-detail${expandedId === w.id ? ' open' : ''}`}>
                {w.exercises?.map((ex, exIdx) => (
                  <div key={exIdx}>
                    <div className="ex-name-row">{ex.name}</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Set</th>
                          <th>Weight ({unit})</th>
                          <th>Reps</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ex.sets?.map((set, setIdx) => (
                          <tr key={setIdx}>
                            <td>{setIdx + 1}</td>
                            <td>{set.weight}</td>
                            <td>{set.reps}</td>
                            <td>{set.completed ? '✓' : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                <div className="history-actions">
                  <button className="btn btn-danger btn-xs" onClick={(e) => { e.stopPropagation(); deleteWorkout(w.id); }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
