import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppShell from './pages/AppShell'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppShell />} />
      <Route path="/app/:view" element={<AppShell />} />
    </Routes>
  )
}
