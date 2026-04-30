import { useState, useEffect } from 'react'
import { api } from '../../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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

  const chartData = [...recentWorkouts].reverse().map(w => ({
    name: formatDate(w.date),
    volume: w.totalVolume || 0
  }));

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

      {chartData.length > 0 && (
        <div className="chart-container" style={{ width: '100%', height: 250, marginTop: '2rem', marginBottom: '2rem' }}>
          <h3 className="dash-recent-title" style={{ marginBottom: '1rem' }}>Volume Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatVolume(val)} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#E5FF4D' }}
              />
              <Bar dataKey="volume" fill="#E5FF4D" radius={[4, 4, 0, 0]} name={`Volume (${unit})`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
