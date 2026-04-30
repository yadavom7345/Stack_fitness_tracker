import { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { api } from '../../api'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function Analytics({ settings }) {
  const [activeTab, setActiveTab] = useState('volume');
  const [workouts, setWorkouts] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const unit = settings.units === 'lbs' ? 'lbs' : 'kg';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [workoutsData, statsData] = await Promise.all([
        api.getWorkouts({ sort: 'oldest' }),
        api.getStats()
      ]);
      setWorkouts(workoutsData.workouts);
      setPersonalRecords(statsData.personalRecords || []);

      // Extract unique exercises from workouts
      const exSet = new Set();
      workoutsData.workouts.forEach(w => {
        (w.exercises || []).forEach(e => exSet.add(e.name));
      });
      const exList = Array.from(exSet);
      setAllExercises(exList);
      if (exList.length > 0) setSelectedExercise(exList[0]);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
    setLoading(false);
  };

  // Volume chart data — volume per workout over time
  const volumeChartData = {
    labels: workouts.map(w => {
      const d = new Date(w.date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [{
      label: `Volume (${unit})`,
      data: workouts.map(w => w.totalVolume || 0),
      backgroundColor: 'rgba(168, 85, 247, 0.5)',
      borderColor: '#A855F7',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  // 1RM progression for selected exercise
  const get1RMData = () => {
    const dataPoints = [];
    workouts.forEach(w => {
      (w.exercises || []).forEach(ex => {
        if (ex.name === selectedExercise) {
          let maxE1rm = 0;
          (ex.sets || []).forEach(set => {
            if (set.completed && set.weight > 0) {
              const e1rm = set.weight * (1 + set.reps / 30);
              if (e1rm > maxE1rm) maxE1rm = e1rm;
            }
          });
          if (maxE1rm > 0) {
            dataPoints.push({
              date: new Date(w.date),
              label: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              value: Math.round(maxE1rm * 10) / 10
            });
          }
        }
      });
    });
    return dataPoints;
  };

  const e1rmDataPoints = get1RMData();
  const e1rmChartData = {
    labels: e1rmDataPoints.map(d => d.label),
    datasets: [{
      label: `Est. 1RM (${unit})`,
      data: e1rmDataPoints.map(d => d.value),
      borderColor: '#A855F7',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#A855F7',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        borderColor: '#2a2a2a',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(42, 42, 42, 0.5)' },
        ticks: { color: '#6b7280', font: { size: 11 } },
        border: { color: '#2a2a2a' }
      },
      y: {
        grid: { color: 'rgba(42, 42, 42, 0.5)' },
        ticks: { color: '#6b7280', font: { size: 11 } },
        border: { color: '#2a2a2a' },
        beginAtZero: true,
      }
    }
  };

  if (loading) {
    return (
      <div id="analytics-view">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div id="analytics-view">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Track your performance trends</p>
        </div>
        <div className="empty-state">
          <svg viewBox="0 0 24 24">
            <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <h3>No Data Yet</h3>
          <p>Complete a few workouts to see your analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="analytics-view">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Track your performance trends</p>
      </div>

      <div className="analytics-tabs">
        <button className={`analytics-tab${activeTab === 'volume' ? ' active' : ''}`} onClick={() => setActiveTab('volume')}>Volume</button>
        <button className={`analytics-tab${activeTab === '1rm' ? ' active' : ''}`} onClick={() => setActiveTab('1rm')}>1RM Progress</button>
        <button className={`analytics-tab${activeTab === 'records' ? ' active' : ''}`} onClick={() => setActiveTab('records')}>Records</button>
      </div>

      {activeTab === 'volume' && (
        <div className="chart-container">
          <div style={{ height: '320px' }}>
            <Bar data={volumeChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {activeTab === '1rm' && (
        <>
          <div className="analytics-exercise-select">
            <select
              className="select-input"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {allExercises.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
          <div className="chart-container">
            {e1rmDataPoints.length > 0 ? (
              <div style={{ height: '320px' }}>
                <Line data={e1rmChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="empty-state">
                <p>No data for {selectedExercise} yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'records' && (
        <div className="card">
          {personalRecords.length === 0 ? (
            <div className="empty-state">
              <p>No personal records yet.</p>
            </div>
          ) : (
            <table className="pr-table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Est. 1RM</th>
                  <th>Best Set</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {personalRecords.map((pr, idx) => (
                  <tr key={idx}>
                    <td>{pr.exercise}</td>
                    <td>{pr.e1rm} {unit}</td>
                    <td>{pr.weight} × {pr.reps}</td>
                    <td>{new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
