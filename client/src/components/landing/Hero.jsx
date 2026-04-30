import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  useEffect(() => {
    const hero = document.getElementById('hero');
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight && hero) {
        hero.style.setProperty('--parallax-y', `${y * 0.35}px`);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="hero-badge">FOR SERIOUS ATHLETES</span>
        <h1 className="hero-title">EFFORTLESS<br />PROGRESS TRACKING</h1>
        <p className="hero-subtitle">
          The zero-friction workout logger for advanced lifters.<br />
          Eliminate interaction fatigue and focus on the flow.
        </p>
        <div className="hero-cta">
          <a href="#contact" className="btn btn-primary btn-lg" onClick={(e) => scrollTo(e, '#contact')}>
            <span>Get Early Access</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <Link to="/app" className="btn btn-outline btn-lg">Launch App</Link>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">12K+</span><span className="stat-label">Active Lifters</span></div>
          <div className="stat-divider"></div>
          <div className="stat"><span className="stat-num">2M+</span><span className="stat-label">Sets Logged</span></div>
          <div className="stat-divider"></div>
          <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">App Rating</span></div>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  )
}
