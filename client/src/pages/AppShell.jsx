import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/app/Sidebar'
import BottomBar from '../components/app/BottomBar'
import Dashboard from '../components/app/Dashboard'
import WorkoutLogger from '../components/app/WorkoutLogger'
import History from '../components/app/History'
import Analytics from '../components/app/Analytics'
import Settings from '../components/app/Settings'
import RestTimerModal from '../components/app/RestTimerModal'
import Toast from '../components/app/Toast'
import { useToast } from '../hooks/useToast'
import { api } from '../api'
import '../app.css'

export default function AppShell() {
  const { view: urlView } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(urlView || 'dashboard');
  const [showTimer, setShowTimer] = useState(false);
  const [settings, setSettings] = useState({ units: 'kg', restTimerDuration: 90, notifications: true });
  const { toast, showToast } = useToast();

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (urlView && urlView !== activeView) {
      setActiveView(urlView);
    }
  }, [urlView]);

  const switchView = (view) => {
    setActiveView(view);
    navigate(`/app/${view}`, { replace: true });
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard switchView={switchView} settings={settings} />;
      case 'workout':
        return <WorkoutLogger showToast={showToast} settings={settings} onShowTimer={() => setShowTimer(true)} />;
      case 'history':
        return <History showToast={showToast} settings={settings} />;
      case 'analytics':
        return <Analytics settings={settings} />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} showToast={showToast} />;
      default:
        return <Dashboard switchView={switchView} settings={settings} />;
    }
  };

  return (
    <>
      <div className="app-layout">
        <Sidebar activeView={activeView} switchView={switchView} />
        <main id="main-content" className="main-content">
          {renderView()}
        </main>
      </div>
      <BottomBar activeView={activeView} switchView={switchView} />
      {showTimer && (
        <RestTimerModal
          duration={settings.restTimerDuration}
          onClose={() => setShowTimer(false)}
        />
      )}
      <Toast show={toast.show} message={toast.message} isApp />
    </>
  )
}
