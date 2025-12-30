
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { useNavigation } from '../App';

const NAV_LINKS = [
  { name: 'Entrepreneurs', path: 'for-entrepreneurs' },
  { name: 'Investors', path: 'for-investors' },
  { name: 'Golden Visa', path: 'golden-visa' },
  { name: 'Tools', path: 'tools' },
  { name: 'News', path: 'news' },
  { name: 'Insights', path: 'blog' },
];

export const Header: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigate, currentPath } = useNavigation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'unset' : 'hidden';
  };

  const handleConsultation = () => {
    onOpenConsultation();
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-elegant py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo - Text Only */}
        <button onClick={() => handleNavigate('home')} className="group relative z-[60]">
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className={`text-2xl font-bold tracking-tight transition-colors ${isMenuOpen ? 'text-navy' : (isScrolled ? 'text-navy' : 'text-white')}`}>
                MOVE
              </span>
              <span className="text-2xl font-bold text-gold">2</span>
              <span className={`text-2xl font-bold tracking-tight transition-colors ${isMenuOpen ? 'text-navy' : (isScrolled ? 'text-navy' : 'text-white')}`}>
                DUBAI
              </span>
            </div>
            <span className={`text-[10px] uppercase tracking-[0.25em] font-medium transition-colors ${isMenuOpen ? 'text-slate' : (isScrolled ? 'text-slate' : 'text-white/60')}`}>
              Elite Relocation
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button
              key={link.name}
              onClick={() => handleNavigate(link.path)}
              className={`text-sm font-medium transition-colors link-underline ${
                currentPath === link.path || currentPath.startsWith(link.path + '/')
                  ? 'text-gold'
                  : isScrolled ? 'text-slate hover:text-navy' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={onOpenConsultation}
            className="btn-primary px-6 py-3 rounded-lg text-xs uppercase tracking-wider ml-4"
          >
            Free Consultation
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className={`lg:hidden relative z-[60] p-2 transition-colors ${isMenuOpen ? 'text-navy' : (isScrolled ? 'text-navy' : 'text-white')}`}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-white z-50 transition-all duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="h-full flex flex-col justify-center items-center px-6">
            <nav className="space-y-6 text-center w-full max-w-sm">
              {NAV_LINKS.map((link, i) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigate(link.path)}
                  className={`block w-full text-2xl font-display font-semibold text-navy hover:text-gold transition-all duration-300 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${i * 75}ms` }}
                >
                  {link.name}
                </button>
              ))}
              <div className={`pt-8 transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                <button
                  onClick={handleConsultation}
                  className="btn-primary w-full py-4 rounded-lg text-sm uppercase tracking-wider"
                >
                  Book Free Consultation
                </button>
              </div>
            </nav>

            <div className={`absolute bottom-8 text-center transition-all duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-xs text-slate uppercase tracking-widest">Elite Relocation Services</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-rich-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold tracking-tight text-white">MOVE</span>
                  <span className="text-2xl font-bold text-gold">2</span>
                  <span className="text-2xl font-bold tracking-tight text-white">DUBAI</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-white/50">
                  Elite Relocation
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              The premier concierge for high-net-worth individuals and families relocating to the UAE. Expert guidance from visa to villa.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-white">Services</h4>
            <ul className="space-y-4">
              {[
                { name: 'Golden Visa', path: 'golden-visa' },
                { name: 'Property Concierge', path: 'property' },
                { name: 'Tax Strategy', path: 'benefits/tax-efficiency' },
                { name: 'Corporate Setup', path: 'services' },
                { name: 'Education Placement', path: 'services' },
                { name: 'Private Banking', path: 'services' },
              ].map((item) => (
                <li key={item.name}>
                  <button onClick={() => navigate(item.path)} className="text-white/50 text-sm hover:text-gold transition-colors">
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-white">Resources</h4>
            <ul className="space-y-4">
              {[
                { name: 'For Entrepreneurs', path: 'for-entrepreneurs' },
                { name: 'For Investors', path: 'for-investors' },
                { name: 'Free Tools', path: 'tools' },
                { name: 'Dubai News', path: 'news' },
                { name: 'Insights & Articles', path: 'blog' },
                { name: 'Contact', path: 'contact' },
              ].map((item) => (
                <li key={item.name}>
                  <button onClick={() => navigate(item.path)} className="text-white/50 text-sm hover:text-gold transition-colors">
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>DIFC, Dubai<br />United Arab Emirates</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>concierge@move2dubai.com</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+971 4 XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} Move2Dubai. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
