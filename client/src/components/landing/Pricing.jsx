import { useEffect, useRef } from 'react'

const Check = () => (
  <svg className="check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function Pricing() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.fade-in, .section-tag, .section-title, .section-subtitle');
    if (!els) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="pricing" className="pricing" ref={sectionRef}>
      <div className="section-container">
        <span className="section-tag">PRICING</span>
        <h2 className="section-title">Choose Your Stack</h2>
        <p className="section-subtitle">Simple, transparent pricing. No hidden fees. Cancel anytime.</p>

        <div className="pricing-grid">
          {/* Novice */}
          <div className="pricing-card fade-in">
            <div className="card-header">
              <span className="card-tier">NOVICE</span>
              <div className="card-price">
                <span className="price-amount">Free</span>
                <span className="price-period">forever</span>
              </div>
              <p className="card-desc">Perfect for getting started with structured logging.</p>
            </div>
            <ul className="card-features">
              <li><Check />Unlimited Logging</li>
              <li><Check />Basic History</li>
              <li><Check />Rest Timer</li>
            </ul>
            <a href="#contact" className="btn btn-outline btn-block" onClick={(e) => scrollTo(e, '#contact')}>Get Started</a>
          </div>

          {/* Pro */}
          <div className="pricing-card pricing-card--featured fade-in">
            <div className="popular-badge">Most Popular</div>
            <div className="card-header">
              <span className="card-tier">PRO LIFTER</span>
              <div className="card-price">
                <span className="price-currency">$</span>
                <span className="price-amount">4.99</span>
                <span className="price-period">/mo</span>
              </div>
              <p className="card-desc">Advanced analytics for lifters who want an edge.</p>
            </div>
            <ul className="card-features">
              <li><Check />1RM Analytics</li>
              <li><Check />Volume Trends</li>
              <li><Check />Dark Mode Export</li>
              <li><Check />Biometric Sync</li>
            </ul>
            <a href="#contact" className="btn btn-primary btn-block" onClick={(e) => scrollTo(e, '#contact')}>Start Free Trial</a>
          </div>

          {/* Coach */}
          <div className="pricing-card fade-in">
            <div className="card-header">
              <span className="card-tier">COACH</span>
              <div className="card-price">
                <span className="price-currency">$</span>
                <span className="price-amount">19.99</span>
                <span className="price-period">/mo</span>
              </div>
              <p className="card-desc">Built for coaches managing athletes and teams.</p>
            </div>
            <ul className="card-features">
              <li><Check />Client Management</li>
              <li><Check />Program Builder</li>
              <li><Check />Team Analytics</li>
            </ul>
            <a href="#contact" className="btn btn-outline btn-block" onClick={(e) => scrollTo(e, '#contact')}>Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  )
}
