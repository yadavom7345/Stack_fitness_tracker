import { useState } from 'react'
import { api } from '../../api'

export default function Settings({ settings, setSettings, showToast }) {
  const [saving, setSaving] = useState(false);

  const updateSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    setSaving(true);
    try {
      await api.updateSettings(updated);
      showToast('Settings saved');
    } catch {
      showToast('Failed to save settings');
    }
    setSaving(false);
  };

  const clearData = async () => {
    if (!window.confirm('This will delete ALL your workout data. Are you sure?')) return;
    try {
      // Get all workouts and delete them
      const data = await api.getWorkouts();
      for (const w of data.workouts) {
        await api.deleteWorkout(w.id);
      }
      showToast('All data cleared');
    } catch {
      showToast('Failed to clear data');
    }
  };

  const restTimerOptions = [60, 90, 120, 150, 180];

  return (
    <div id="settings-view">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your experience</p>
      </div>

      <div className="settings-section">
        <h3>Units</h3>
        <div className="setting-row">
          <div className="setting-info">
            <h4>Weight Unit</h4>
            <p>Choose between kilograms and pounds</p>
          </div>
          <div className="unit-toggle">
            <button
              className={`unit-btn${settings.units === 'kg' ? ' active' : ''}`}
              onClick={() => updateSetting('units', 'kg')}
            >
              kg
            </button>
            <button
              className={`unit-btn${settings.units === 'lbs' ? ' active' : ''}`}
              onClick={() => updateSetting('units', 'lbs')}
            >
              lbs
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Rest Timer</h3>
        <div className="setting-row">
          <div className="setting-info">
            <h4>Default Duration</h4>
            <p>Rest timer duration after completing a set</p>
          </div>
          <select
            className="select-input"
            style={{ width: 'auto', minWidth: '120px' }}
            value={settings.restTimerDuration}
            onChange={(e) => updateSetting('restTimerDuration', parseInt(e.target.value))}
          >
            {restTimerOptions.map(opt => (
              <option key={opt} value={opt}>{Math.floor(opt / 60)}:{(opt % 60).toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="setting-row">
          <div className="setting-info">
            <h4>Timer Notifications</h4>
            <p>Sound and vibration when rest timer completes</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <div className="setting-row">
          <div className="setting-info">
            <h4>Clear All Data</h4>
            <p>Permanently delete all workout history and records</p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={clearData}>
            Clear Data
          </button>
        </div>
      </div>
    </div>
  )
}
