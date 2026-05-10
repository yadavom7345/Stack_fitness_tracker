import { useEffect, useRef } from 'react'

const features = [
  {
    id: 'logging',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11M6.5 17.5h11M2 12h4m12 0h4M6 6.5V4m0 16v-2.5M18 6.5V4m0 16v-2.5" />
      </svg>
    ),
    tag: 'ZERO FRICTION',
    title: 'Log Workouts in Seconds',
    desc: 'Search any exercise instantly, add sets with one tap, and save your entire session. No clutter, no distractions — just the data you need.',
    accent: '#A855F7',
  },
  {
    id: 'analytics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    tag: 'INSIGHTS',
    title: 'Volume & 1RM Analytics',
    desc: 'Track your estimated one-rep max for every exercise over time. Visualize your volume trends with interactive charts powered by real data.',
    accent: '#818cf8',
  },
  {
    id: 'timer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    tag: 'RECOVERY',
    title: 'Smart Rest Timer',
    desc: 'An animated SVG ring timer counts down your rest between sets. Adjust duration on the fly with ±15s controls, without breaking your flow.',
    accent: '#34d399',
  },
  {
    id: 'ai',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7H1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z" />
        <path d="M9 14h.01M15 14h.01M10 17c.67.5 1.33.5 2 0" />
      </svg>
    ),
    tag: 'AI-POWERED',
    title: 'Built with Chain Prompting',
    desc: 'The entire app was designed and built using a structured 4-step AI chain-prompting methodology — from layout to data integration to polish.',
    accent: '#f59e0b',
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(
      '.feature-card, .section-tag, .section-title, .section-subtitle'
    );
    if (!els) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features" ref={sectionRef}>
      <div className="section-container">
        <div className="features-header">
          <span className="section-tag">FEATURES</span>
          <h2 className="section-title">Everything You Need.<br />Nothing You Don't.</h2>
          <p className="section-subtitle">
            A focused, premium toolkit for serious lifters who want clarity over clutter.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.id}
              className="feature-card fade-in"
              style={{ '--feature-accent': f.accent, '--stagger': `${i * 0.12}s` }}
            >
              <div className="feature-icon-wrap">
                {f.icon}
              </div>
              <div className="feature-tag">{f.tag}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
