import { useNavigate } from 'react-router-dom'

export default function Sidebar({ activeView, switchView }) {
  const navigate = useNavigate();

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    )},
    { id: 'workout', label: 'Workout', icon: (
      <svg viewBox="0 0 24 24"><path d="M6.5 6.5h11M6.5 17.5h11M2 12h4m12 0h4M6 6.5V4m0 16v-2.5M18 6.5V4m0 16v-2.5" /></svg>
    )},
    { id: 'history', label: 'History', icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    )},
    { id: 'analytics', label: 'Analytics', icon: (
      <svg viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
    )},
  ];

  return (
    <aside id="sidebar" className="sidebar">
      <a href="/" className="sidebar-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>STACK</a>
      <nav className="sidebar-nav">
        {items.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item${activeView === item.id ? ' active' : ''}`}
            data-view={item.id}
            data-tooltip={item.label}
            onClick={(e) => { e.preventDefault(); switchView(item.id); }}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
