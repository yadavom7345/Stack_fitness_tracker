import { useEffect, useState, useRef } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    setMenuOpen(prev => {
      const next = !prev;
      document.body.classList.toggle('menu-open', next);
      return next;
    });
  };

  return (
    <nav id="navbar" className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>STACK</a>

        <button
          id="menu-toggle"
          className={`menu-toggle${menuOpen ? ' active' : ''}`}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>

        <ul id="nav-links" className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li><a href="#pricing" onClick={(e) => scrollTo(e, '#pricing')}>Features</a></li>
          <li><a href="#pricing" onClick={(e) => scrollTo(e, '#pricing')}>Pricing</a></li>
          <li><a href="#contact" className="btn btn-sm btn-primary" onClick={(e) => scrollTo(e, '#contact')}>Download App</a></li>
        </ul>
      </div>
    </nav>
  )
}
