import { useState, useEffect } from 'react'
import { api } from '../../api'

export default function Dashboard({ switchView, settings }) {
  const [stats, setStats] = useState({ totalWorkouts: 0, totalVolume: 0, totalSets: 0, streak: 0, personalRecords: [] });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, workoutsData] = await Promise.all([
        api.getStats(),
        api.getWorkouts({ sort: 'newest', limit: 5 })
      ]);
      setStats(statsData);
      setRecentWorkouts(workoutsData.workouts);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
    setLoading(false);
  };

  const formatVolume = (vol) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const unit = settings.units === 'lbs' ? 'lbs' : 'kg';

  return (
    <div id="dashboard-view">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your training overview at a glance</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">WORKOUTS</div>
          <div className="stat-value">{stats.totalWorkouts}</div>
          <div className="stat-sub">total sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">VOLUME</div>
          <div className="stat-value">{formatVolume(stats.totalVolume)}</div>
          <div className="stat-sub">{unit} lifted</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">STREAK</div>
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-sub">day{stats.streak !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">RECORDS</div>
          <div className="stat-value">{stats.personalRecords?.length || 0}</div>
          <div className="stat-sub">personal bests</div>
        </div>
      </div>

      <h3 className="dash-recent-title">Recent Workouts</h3>

      {loading && recentWorkouts.length === 0 ? (
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      ) : recentWorkouts.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24">
            <path d="M6.5 6.5h11M6.5 17.5h11M2 12h4m12 0h4M6 6.5V4m0 16v-2.5M18 6.5V4m0 16v-2.5" />
          </svg>
          <h3>No Workouts Yet</h3>
          <p>Start your first workout to see your progress here.</p>
          <button className="btn btn-primary" onClick={() => switchView('workout')}>
            Start Workout
          </button>
        </div>
      ) : (
        <div className="recent-list">
          {recentWorkouts.map(w => (
            <div key={w.id} className="recent-card" onClick={() => switchView('history')}>
              <div className="recent-card-info">
                <h4>{w.name}</h4>
                <p>{formatDate(w.date)}</p>
              </div>
              <div className="recent-card-stats">
                <span>{w.exerciseCount || 0} exercises</span>
                <span>{w.totalSets || 0} sets</span>
                {w.duration > 0 && <span>{formatDuration(w.duration)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
