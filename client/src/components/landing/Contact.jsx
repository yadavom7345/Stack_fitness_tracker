import { useState, useRef, useEffect } from 'react'
import { api } from '../../api'

export default function Contact({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = true;
    if (!form.role) newErrors.role = true;
    if (!form.message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.submitContact(form);
      showToast('Message sent successfully!');
      setForm({ name: '', email: '', role: '', message: '' });
    } catch (err) {
      showToast('Failed to send. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="contact">
      <div className="section-container">
        <div className="contact-wrapper" ref={wrapperRef}>
          <div className="contact-info">
            <span className="section-tag">SUPPORT</span>
            <h2 className="section-title">Need Help?<br />Contact Support.</h2>
            <p className="section-subtitle">We are here to support your progress. Report bugs or request features.</p>
            <div className="contact-details">
              <div className="contact-detail">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">support@stackfit.app</span>
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <span className="detail-label">Response Time</span>
                  <span className="detail-value">Under 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          <form id="contact-form" className="contact-form" noValidate onSubmit={handleSubmit}>
            <div className={`form-group${errors.name ? ' error' : ''}`}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>
            <div className={`form-group${errors.email ? ' error' : ''}`}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div className={`form-group${errors.role ? ' error' : ''}`}>
              <label htmlFor="role">Your Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="" disabled>Select your role</option>
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
                <option value="developer">Developer</option>
              </select>
            </div>
            <div className={`form-group${errors.message ? ' error' : ''}`}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Tell us how we can help..." value={form.message} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-submit" disabled={loading}>
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4z" /><path d="m22 2-11 11" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
