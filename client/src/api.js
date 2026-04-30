const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Exercises
  getExercises: (q = '') => request(`/exercises${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  // Workouts
  getWorkouts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/workouts${qs ? `?${qs}` : ''}`);
  },
  getWorkout: (id) => request(`/workouts/${id}`),
  createWorkout: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkout: (id, data) => request(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),
  getStats: () => request('/workouts/stats/summary'),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Contact
  submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
};
