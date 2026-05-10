export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-ai-banner">
          <span className="footer-ai-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7H1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
            </svg>
          </span>
          <span>Built end-to-end using <strong>AI Chain-Prompting</strong> — Layout → Components → Data → Interactivity</span>
        </div>
        <div className="footer-inner">
          <a href="#" className="nav-logo">STACK</a>
          <p className="footer-copy">&copy; 2026 STACK Fitness. All rights reserved.</p>
          <div className="footer-links">
            <a href="https://github.com/yadavom7345/Stack_fitness_tracker" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>Pricing</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
