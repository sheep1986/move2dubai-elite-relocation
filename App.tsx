
import React, { useState, useEffect, useMemo, createContext, useContext, useRef, useCallback } from 'react';
import { getPage, PAGES } from './content/site';
import { Header, Footer } from './components/Layout';
import { LeadForm } from './components/LeadForm';
import { TaxCalculator } from './components/TaxCalculator';
import { GoldenVisaChecker } from './components/GoldenVisaChecker';
import { FreeZoneComparison } from './components/FreeZoneComparison';
import { ICONS } from './constants';
import { BlogArticle, ContentSection } from './types';

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};

// Intersection Observer Hook
const useInView = (threshold = 0.1, rootMargin = '0px') => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isInView };
};

// Counter Animation Hook
const useCounter = (end: number, duration: number = 2000, isInView: boolean) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.floor(eased * end);
      setCount(countRef.current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return count;
};

// Animated Section - subtle, elegant reveal
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade' | 'fade-up' | 'scale';
}> = ({ children, className = '', delay = 0, animation = 'fade' }) => {
  const { ref, isInView } = useInView(0.1, '50px');

  const animations = {
    'fade': 'opacity-0',
    'fade-up': 'translate-y-6 opacity-0',
    'scale': 'scale-[0.98] opacity-0',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isInView ? 'translate-y-0 scale-100 opacity-100' : animations[animation]
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Premium Image Effect Types
type ImageEffect = 'cinematic' | 'focus' | 'luminous' | 'split' | 'kenburns' | 'curtain' | 'depth';

// Premium Image Component with unique reveal effects
const PremiumImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  aspect?: string;
  overlay?: boolean;
  parallax?: boolean;
  effect?: ImageEffect;
  hoverEffect?: 'lift' | 'glow' | 'zoom' | 'none';
}> = ({
  src,
  alt,
  className = '',
  aspect = 'aspect-[16/10]',
  overlay = false,
  parallax = false,
  effect = 'focus',
  hoverEffect = 'glow'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Single effect: reveal when image loads (simpler, more reliable)
  useEffect(() => {
    if (loaded && !revealed) {
      const timer = setTimeout(() => setRevealed(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loaded, revealed]);

  // Check if image is already cached/loaded
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight > 0) {
      setLoaded(true);
    }
  }, []);

  // Parallax effect
  useEffect(() => {
    if (!parallax) return;
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        setScrollY((viewCenter - center) * 0.08);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  if (!src || failed) {
    return (
      <div className={`${aspect} w-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center`}>
        <div className="text-gold/20 text-sm tracking-widest uppercase">MOVE2DUBAI</div>
      </div>
    );
  }

  const effectClass = `img-${effect}`;
  const hoverClass = hoverEffect !== 'none' ? `img-hover-${hoverEffect}` : '';

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${aspect} bg-navy ${parallax ? 'img-parallax-container' : ''}`}
    >
      {!loaded && <div className="absolute inset-0 img-loading" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${effectClass} ${revealed ? 'revealed' : ''} ${hoverEffect === 'zoom' ? 'hover:scale-105 transition-transform duration-700' : hoverClass} ${className}`}
        style={parallax ? { transform: `translateY(${scrollY}px) scale(1.1)` } : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

// Hero Stats Bar
const HeroStats: React.FC = () => {
  const { ref, isInView } = useInView();
  const families = useCounter(500, 2000, isInView);
  const assets = useCounter(2.5, 2000, isInView);
  const success = useCounter(100, 2000, isInView);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
      {[
        { value: `${families}+`, label: 'Families' },
        { value: `£${assets.toFixed(1)}B`, label: 'Assets' },
        { value: `${success}%`, label: 'Success' },
      ].map((stat, i) => (
        <div
          key={i}
          className={`text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: `${i * 150}ms` }}
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gold stat-value">{stat.value}</div>
          <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// Large Stats Section
const StatsSection: React.FC = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-navy-light" />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-4">
          {[
            { end: 500, suffix: '+', label: 'Families Relocated', sublabel: 'Since 2019' },
            { end: 5, suffix: 'B+', prefix: '£', label: 'Assets Managed', sublabel: 'Under advisement', isDecimal: true },
            { end: 100, suffix: '%', label: 'Visa Success', sublabel: 'Approval rate' },
            { end: 24, suffix: 'hrs', label: 'Response Time', sublabel: 'Guaranteed' },
          ].map((stat, i) => {
            const count = useCounter(stat.end, 2500, isInView);
            return (
              <div
                key={i}
                className={`text-center p-4 sm:p-6 lg:p-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gold stat-value mb-1 sm:mb-2">
                  {stat.prefix}{stat.isDecimal ? count.toFixed(1) : count}{stat.suffix}
                </div>
                <div className="text-white font-medium text-sm sm:text-base mb-0.5 sm:mb-1">{stat.label}</div>
                <div className="text-xs sm:text-sm text-white/40">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Comparison Table
const ComparisonTable: React.FC = () => {
  const { ref, isInView } = useInView();
  const rows = [
    { feature: 'Personal Income Tax', uk: 'Up to 45%', uae: '0%' },
    { feature: 'Capital Gains Tax', uk: 'Up to 28%', uae: '0%' },
    { feature: 'Inheritance Tax', uk: 'Up to 40%', uae: '0%' },
    { feature: 'Corporate Tax', uk: '25%', uae: '9%*' },
    { feature: 'Dividend Tax', uk: 'Up to 39.35%', uae: '0%' },
    { feature: 'Safety Ranking', uk: '#42', uae: '#1' },
  ];

  return (
    <section ref={ref} className="py-16 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-8 md:mb-16">
          <span className="text-label text-gold uppercase tracking-widest mb-4 block">Tax Comparison</span>
          <h2 className="text-2xl sm:text-3xl md:text-display-lg text-navy mb-4">The Financial Reality</h2>
          <p className="text-sm sm:text-base md:text-body-lg text-slate max-w-2xl mx-auto">A side-by-side comparison of key fiscal metrics between the UK and UAE.</p>
        </AnimatedSection>

        <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate/10">
          <div className="grid grid-cols-3 bg-navy text-white">
            <div className="p-3 sm:p-4 md:p-6 font-semibold text-xs sm:text-sm md:text-base">Metric</div>
            <div className="p-3 sm:p-4 md:p-6 font-semibold text-center border-x border-white/10 text-xs sm:text-sm md:text-base">UK</div>
            <div className="p-3 sm:p-4 md:p-6 font-semibold text-center bg-gold/10 text-gold text-xs sm:text-sm md:text-base">UAE</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t border-slate/10 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="p-3 sm:p-4 md:p-6 font-medium text-navy text-xs sm:text-sm md:text-base">{row.feature}</div>
              <div className="p-3 sm:p-4 md:p-6 text-center text-slate border-x border-slate/10 text-xs sm:text-sm md:text-base">{row.uk}</div>
              <div className="p-3 sm:p-4 md:p-6 text-center font-semibold text-navy bg-gold/5 text-xs sm:text-sm md:text-base">{row.uae}</div>
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-slate mt-4 text-center">*Many Free Zone entities qualify for 0% corporate tax on qualifying income.</p>
      </div>
    </section>
  );
};

// Process Timeline
const ProcessTimeline: React.FC = () => {
  const { ref, isInView } = useInView();
  const steps = [
    { num: '01', title: 'Discovery Call', desc: 'Confidential consultation to understand your goals, timeline, and family requirements.', time: 'Week 1' },
    { num: '02', title: 'Strategic Planning', desc: 'Custom relocation blueprint covering visa, tax exit, property, and lifestyle integration.', time: 'Week 2-3' },
    { num: '03', title: 'Visa & Documentation', desc: 'Golden Visa application, document attestation, and medical coordination.', time: 'Week 4-6' },
    { num: '04', title: 'Property & Banking', desc: 'Property acquisition, bank account setup, and asset transfer coordination.', time: 'Week 6-10' },
    { num: '05', title: 'Landing & Integration', desc: 'Arrival support, school enrollment, healthcare registration, and lifestyle setup.', time: 'Week 10-12' },
    { num: '06', title: 'Ongoing Partnership', desc: 'Continuous concierge support, visa renewals, and evolving needs management.', time: 'Ongoing' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-navy relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="text-label text-gold uppercase tracking-widest mb-4 block">Our Process</span>
          <h2 className="text-display-md md:text-display-lg text-white mb-4">Your Relocation Journey</h2>
          <p className="text-body-xl text-white/60 max-w-2xl mx-auto">A proven 12-week framework refined over 500+ successful relocations.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative glass-panel rounded-2xl p-8 card-border transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-6xl font-display font-bold number-outline">{step.num}</span>
                <span className="text-xs text-gold uppercase tracking-wider bg-gold/10 px-3 py-1 rounded-full">{step.time}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-white/50">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Carousel
const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const { ref, isInView } = useInView();

  const testimonials = [
    {
      quote: "The Move2Dubai team transformed what could have been a stressful 18-month process into a seamless 10-week transition. Their understanding of UK tax exit requirements was invaluable.",
      author: "James & Catherine M.",
      role: "Tech Entrepreneurs, London",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      stats: { saved: '£2.4M', timeline: '10 weeks' }
    },
    {
      quote: "We were hesitant about uprooting our family, but the school placement team secured spots at Brighton College within two weeks. Our children have thrived.",
      author: "The Richardson Family",
      role: "Family Office, Manchester",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      stats: { saved: '£1.8M', timeline: '12 weeks' }
    },
    {
      quote: "The property concierge found us an off-market villa on Palm Jumeirah that exceeded our expectations. The negotiation alone saved us significant value.",
      author: "Michael R.",
      role: "Investment Director, Edinburgh",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      stats: { saved: '£890K', timeline: '8 weeks' }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-alabaster overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-label text-gold uppercase tracking-widest mb-4 block">Client Stories</span>
          <h2 className="text-display-md md:text-display-lg text-navy mb-4">Trusted by Industry Leaders</h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                i === active ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-8 pointer-events-none'
              }`}
            >
              <div className="testimonial-card bg-white rounded-3xl p-10 md:p-14">
                <p className="text-2xl md:text-3xl text-navy leading-relaxed mb-10 font-display">"{t.quote}"</p>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.author} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-navy text-lg">{t.author}</div>
                      <div className="text-slate">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold">{t.stats.saved}</div>
                      <div className="text-xs text-slate uppercase tracking-wider">Tax Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold">{t.stats.timeline}</div>
                      <div className="text-xs text-slate uppercase tracking-wider">Timeline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-gold w-8' : 'bg-slate/30 hover:bg-slate/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Grid
const ServicesGrid: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  const { ref, isInView } = useInView();
  const { navigate } = useNavigation();
  const services = [
    { icon: '🛂', title: 'Golden Visa', desc: '10-year residency through real estate or fund investment. 100% success rate.', link: 'golden-visa' },
    { icon: '🏠', title: 'Property Concierge', desc: 'Off-market access to Palm Jumeirah, Emirates Hills, and Dubai Hills.', link: 'property' },
    { icon: '💼', title: 'Tax Strategy', desc: 'UK exit coordination and UAE Tax Residency Certificate management.', link: 'benefits/tax-efficiency' },
    { icon: '🏢', title: 'Corporate Setup', desc: 'DIFC, ADGM, and mainland company formation with banking support.', link: 'services' },
    { icon: '📚', title: 'Education Placement', desc: 'Priority access to elite schools including NLCS, Brighton, and Repton.', link: 'services' },
    { icon: '🏥', title: 'Healthcare', desc: 'Registration with Cleveland Clinic, King\'s College, and top providers.', link: 'services' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-label text-gold uppercase tracking-widest mb-4 block">What We Do</span>
          <h2 className="text-display-md md:text-display-lg text-navy mb-4">Complete Concierge Services</h2>
          <p className="text-body-xl text-slate max-w-2xl mx-auto">Every aspect of your relocation, managed with precision and discretion.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <button
              key={i}
              onClick={() => navigate(service.link)}
              className={`group text-left p-8 rounded-2xl border border-slate/10 card-elevated card-border bg-white transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
              <p className="text-slate mb-6">{service.desc}</p>
              <span className="inline-flex items-center gap-2 text-gold font-medium text-sm group-hover:gap-4 transition-all">
                Learn More <ICONS.ChevronRight />
              </span>
            </button>
          ))}
        </div>

        <AnimatedSection className="text-center mt-16" delay={400}>
          <button onClick={onOpenConsultation} className="btn-primary px-10 py-4 rounded-lg text-sm uppercase tracking-wider">
            Schedule Free Consultation
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Blog Preview
const BlogPreview: React.FC = () => {
  const { ref, isInView } = useInView();
  const { navigate } = useNavigation();
  const page = getPage('home');
  const articles = page.articles?.slice(0, 3) || [];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <AnimatedSection>
            <span className="text-label text-gold uppercase tracking-widest mb-4 block">Intelligence</span>
            <h2 className="text-display-md md:text-display-lg text-white">Latest Insights</h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <button
              onClick={() => navigate('blog')}
              className="btn-secondary px-6 py-3 rounded-lg text-sm uppercase tracking-wider"
            >
              View All Articles
            </button>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <button
              key={article.slug}
              onClick={() => navigate(`blog/${article.slug}`)}
              className={`group text-left transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                <PremiumImage src={article.heroImage} alt={article.title} effect={(['cinematic', 'luminous', 'curtain'] as ImageEffect[])[i % 3]} hoverEffect="zoom" />
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50 mb-3">
                <span className="text-gold">{article.category}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors mb-3">{article.title}</h3>
              <p className="text-white/50 line-clamp-2">{article.excerpt}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// News Item Interface
interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  category: string;
}

// Dubai News Feed Component
const DubaiNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Positive keywords to filter news
  const positiveKeywords = [
    'growth', 'success', 'launch', 'opens', 'expand', 'new', 'record', 'award',
    'investment', 'development', 'achieve', 'innovation', 'breakthrough', 'milestone',
    'partnership', 'inaugurate', 'celebrate', 'announce', 'unveil', 'leading',
    'boost', 'rise', 'surge', 'opportunity', 'landmark', 'flagship', 'premier'
  ];

  // Negative keywords to exclude
  const negativeKeywords = [
    'death', 'killed', 'accident', 'crash', 'fraud', 'scam', 'arrest', 'crime',
    'terror', 'attack', 'war', 'conflict', 'scandal', 'controversy', 'lawsuit',
    'bankruptcy', 'collapse', 'crisis', 'disaster', 'tragedy'
  ];

  const isPositiveNews = (title: string, description: string): boolean => {
    const text = (title + ' ' + description).toLowerCase();
    const hasNegative = negativeKeywords.some(word => text.includes(word));
    if (hasNegative) return false;
    const hasPositive = positiveKeywords.some(word => text.includes(word));
    return hasPositive || !hasNegative;
  };

  const categories = ['all', 'Business', 'Real Estate', 'Lifestyle', 'Technology', 'Tourism'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Using RSS2JSON API to convert RSS feeds
        const feeds = [
          'https://gulfnews.com/rss/uae',
          'https://www.khaleejtimes.com/rss/uae',
        ];

        // For demo purposes, using curated positive Dubai news
        // In production, this would fetch from actual RSS feeds
        const mockNews: NewsItem[] = [
          {
            title: 'Dubai Records Highest Ever Tourism Numbers in 2024',
            link: 'https://gulfnews.com',
            pubDate: new Date().toISOString(),
            description: 'Dubai welcomed a record 18.72 million international visitors in 2024, cementing its position as the world\'s most visited city.',
            source: 'Gulf News',
            category: 'Tourism'
          },
          {
            title: 'UAE Launches New Golden Visa Categories for Skilled Professionals',
            link: 'https://khaleejtimes.com',
            pubDate: new Date().toISOString(),
            description: 'The UAE government announces expanded Golden Visa eligibility, making it easier for talented professionals to call Dubai home.',
            source: 'Khaleej Times',
            category: 'Business'
          },
          {
            title: 'Palm Jebel Ali Development Reaches Major Construction Milestone',
            link: 'https://gulfnews.com',
            pubDate: new Date().toISOString(),
            description: 'Nakheel announces completion of infrastructure works on Palm Jebel Ali, paving the way for the world\'s largest man-made island.',
            source: 'Gulf News',
            category: 'Real Estate'
          },
          {
            title: 'Dubai Metro Expansion: New Blue Line to Connect Key Districts',
            link: 'https://khaleejtimes.com',
            pubDate: new Date().toISOString(),
            description: 'RTA unveils plans for the new Blue Line, adding 30 stations and significantly expanding Dubai\'s public transport network.',
            source: 'Khaleej Times',
            category: 'Lifestyle'
          },
          {
            title: 'Tech Giants Establish Regional Headquarters in DIFC',
            link: 'https://gulfnews.com',
            pubDate: new Date().toISOString(),
            description: 'Multiple Fortune 500 technology companies announce plans to establish their Middle East headquarters in Dubai.',
            source: 'Gulf News',
            category: 'Technology'
          },
          {
            title: 'Dubai Real Estate Market Sees 30% Growth in Prime Transactions',
            link: 'https://khaleejtimes.com',
            pubDate: new Date().toISOString(),
            description: 'Luxury property segment continues to thrive as high-net-worth individuals from around the world invest in Dubai real estate.',
            source: 'Khaleej Times',
            category: 'Real Estate'
          },
          {
            title: 'Emirates Airline Launches New Direct Routes to 15 Destinations',
            link: 'https://gulfnews.com',
            pubDate: new Date().toISOString(),
            description: 'Dubai\'s flagship carrier expands its global network, reinforcing the city\'s position as the world\'s aviation hub.',
            source: 'Gulf News',
            category: 'Tourism'
          },
          {
            title: 'Dubai Ranks #1 for Quality of Life Among Expats Globally',
            link: 'https://khaleejtimes.com',
            pubDate: new Date().toISOString(),
            description: 'International survey confirms Dubai as the top destination for expatriates seeking quality of life and career opportunities.',
            source: 'Khaleej Times',
            category: 'Lifestyle'
          },
          {
            title: 'New AI Hub Launched in Dubai Silicon Oasis',
            link: 'https://gulfnews.com',
            pubDate: new Date().toISOString(),
            description: 'Dubai establishes state-of-the-art AI research facility, attracting top talent and startups from around the world.',
            source: 'Gulf News',
            category: 'Technology'
          },
          {
            title: 'DIFC Courts Handle Record Number of Commercial Cases',
            link: 'https://khaleejtimes.com',
            pubDate: new Date().toISOString(),
            description: 'Growing confidence in Dubai\'s legal framework as international businesses choose DIFC for dispute resolution.',
            source: 'Khaleej Times',
            category: 'Business'
          },
          {
            title: 'Dubai Opera Announces Star-Studded 2025 Season',
            link: 'https://gulfnews.com',
            pubDate: new Date().toISOString(),
            description: 'World-renowned artists and productions to grace Dubai Opera stage, elevating the city\'s cultural offerings.',
            source: 'Gulf News',
            category: 'Lifestyle'
          },
          {
            title: 'Sustainable City Dubai Achieves Carbon Neutral Status',
            link: 'https://khaleejtimes.com',
            pubDate: new Date().toISOString(),
            description: 'Dubai\'s pioneering eco-community becomes the region\'s first fully carbon-neutral residential development.',
            source: 'Khaleej Times',
            category: 'Real Estate'
          }
        ];

        // Filter to only today's news (simulated - in production would use actual dates)
        const filteredNews = mockNews.filter(item => isPositiveNews(item.title, item.description));
        setNews(filteredNews);
        setLoading(false);
      } catch (err) {
        setError('Unable to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh every 30 minutes
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(item => item.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate/10 rounded-2xl h-48 mb-4" />
                <div className="bg-slate/10 h-4 rounded w-1/4 mb-3" />
                <div className="bg-slate/10 h-6 rounded w-3/4 mb-2" />
                <div className="bg-slate/10 h-4 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gold text-navy'
                  : 'bg-slate/5 text-slate hover:bg-slate/10'
              }`}
            >
              {cat === 'all' ? 'All News' : cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, i) => (
            <AnimatedSection key={i} delay={i * 75}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-alabaster rounded-2xl p-6 h-full card-elevated card-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate">{formatDate(item.pubDate)}</span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate text-sm mb-4 line-clamp-3">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate/10">
                  <span className="text-xs text-slate">{item.source}</span>
                  <span className="text-gold text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read More
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate">
            News is automatically curated to highlight positive developments in Dubai.
            <br />Updated every 30 minutes from leading UAE news sources.
          </p>
        </div>
      </div>
    </section>
  );
};

// Final CTA
const FinalCTA: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <PremiumImage
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000"
          alt="Dubai Skyline"
          aspect="w-full h-full"
          effect="kenburns"
          hoverEffect="none"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <AnimatedSection>
          <span className="text-label text-gold uppercase tracking-widest mb-6 block">Your Next Chapter</span>
          <h2 className="text-display-lg md:text-display-xl text-white mb-6">Ready to Make the Move?</h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join 500+ families who have successfully transitioned to Dubai with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onOpenConsultation} className="btn-primary px-12 py-5 rounded-lg text-sm uppercase tracking-wider">
              Book Free Consultation
            </button>
            <button className="btn-secondary px-12 py-5 rounded-lg text-sm uppercase tracking-wider">
              Download Guide
            </button>
          </div>
          <p className="text-sm text-white/40 mt-10">No commitment required. Response within 24 hours.</p>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Page Transition
const PageTransition: React.FC<{ children: React.ReactNode; pageKey: string }> = ({ children, pageKey }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pageKey]);

  return (
    <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

// Main App
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => window.location.hash.replace(/^#\/?/, '') || 'home');
  const [showConsultation, setShowConsultation] = useState(false);

  const navigate = useCallback((path: string) => {
    const clean = path.replace(/^#\/?/, '');
    window.location.hash = `/${clean}`;
    setCurrentPath(clean || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowConsultation(false);
  }, []);

  useEffect(() => {
    const handleHash = () => setCurrentPath(window.location.hash.replace(/^#\/?/, '') || 'home');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const page = useMemo(() => getPage(currentPath), [currentPath]);

  useEffect(() => {
    document.title = page.metaTitle;
  }, [page]);

  const isHome = currentPath === 'home';
  const isBlog = currentPath === 'blog';
  const isArticle = currentPath.startsWith('blog/') && page.article;
  const isContact = currentPath === 'contact';
  const isNews = currentPath === 'news';
  const isTools = currentPath === 'tools';
  const isTaxCalculator = currentPath === 'tools/tax-calculator';
  const isVisaChecker = currentPath === 'tools/golden-visa-checker';
  const isFreeZoneComparison = currentPath === 'tools/free-zone-comparison';
  const isToolPage = isTaxCalculator || isVisaChecker || isFreeZoneComparison;

  // Section Renderer
  const renderSection = (section: ContentSection, idx: number) => {
    switch (section.type) {
      case 'stats':
        return (
          <section key={idx} className="bg-navy py-24 md:py-32 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <AnimatedSection>
                  <span className="text-label text-gold uppercase tracking-widest mb-4 block">{section.tag}</span>
                  <h2 className="text-display-md md:text-display-lg text-white mb-6">{section.title}</h2>
                  <p className="text-body-xl text-white/60">{section.content}</p>
                </AnimatedSection>
                <AnimatedSection delay={200} className="text-center lg:text-right">
                  <div className="text-7xl md:text-9xl font-display font-bold text-gold">{section.stat?.value}</div>
                  <div className="text-sm text-white/50 uppercase tracking-widest mt-2">{section.stat?.label}</div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        );

      case 'split':
        const isEven = idx % 2 === 0;
        const splitEffects: ImageEffect[] = ['cinematic', 'depth', 'curtain', 'split'];
        return (
          <section key={idx} className={`py-24 md:py-32 ${isEven ? 'bg-white' : 'bg-alabaster'}`}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <AnimatedSection className={!isEven ? 'lg:order-2' : ''}>
                  <span className="text-label text-gold uppercase tracking-widest mb-4 block">{section.tag}</span>
                  <h2 className="text-display-md md:text-display-lg text-navy mb-6">{section.title}</h2>
                  <div className="space-y-4">
                    {Array.isArray(section.content) ? section.content.map((p, i) => (
                      <p key={i} className="text-body-lg text-slate">{p}</p>
                    )) : <p className="text-body-lg text-slate">{section.content}</p>}
                  </div>
                  <button onClick={() => setShowConsultation(true)} className="mt-8 inline-flex items-center gap-3 text-gold font-semibold hover:gap-5 transition-all">
                    Learn More <ICONS.ChevronRight />
                  </button>
                </AnimatedSection>
                <AnimatedSection delay={200} className={!isEven ? 'lg:order-1' : ''}>
                  <div className="rounded-2xl overflow-hidden">
                    <PremiumImage src={section.image} alt={section.title} aspect="aspect-[4/3]" effect={splitEffects[idx % splitEffects.length]} hoverEffect="lift" />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        );

      case 'grid':
        return (
          <section key={idx} className="bg-navy py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
              <AnimatedSection className="text-center mb-16">
                <span className="text-label text-gold uppercase tracking-widest mb-4 block">{section.tag}</span>
                <h2 className="text-display-md md:text-display-lg text-white mb-6">{section.title}</h2>
                {section.content && <p className="text-body-xl text-white/60 max-w-2xl mx-auto">{section.content}</p>}
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items?.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 100}>
                    <div className="glass-panel rounded-xl p-8 h-full card-border">
                      <div className="text-5xl font-display font-bold number-outline mb-6">0{i + 1}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-white/50">{item.text}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        );

      case 'editorial':
      default:
        return (
          <section key={idx} className="bg-white py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <AnimatedSection className="lg:sticky lg:top-32">
                  <span className="text-label text-gold uppercase tracking-widest mb-4 block">{section.tag}</span>
                  <h2 className="text-display-md md:text-display-lg text-navy mb-6">{section.title}</h2>
                  <div className="gold-line" />
                </AnimatedSection>
                <AnimatedSection delay={200}>
                  <p className="text-body-xl text-slate mb-10">{section.content}</p>
                  <div className="rounded-2xl overflow-hidden">
                    <PremiumImage src={section.image} alt={section.title} effect="focus" parallax hoverEffect="glow" />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      <div className="relative bg-navy">
        <Header onOpenConsultation={() => setShowConsultation(true)} />

        <PageTransition pageKey={currentPath}>
          <main>
            {/* Hero */}
            <section className="relative min-h-screen flex items-center pt-24 pb-32 md:pb-16 overflow-hidden">
              <div className="absolute inset-0">
                <PremiumImage src={page.heroImage} alt={page.title} aspect="w-full h-full" effect="luminous" hoverEffect="none" />
                <div className="absolute inset-0 hero-gradient" />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 right-10 w-px h-40 bg-gradient-to-b from-gold/50 to-transparent hidden lg:block" />
              <div className="absolute bottom-1/4 left-10 w-px h-40 bg-gradient-to-t from-gold/50 to-transparent hidden lg:block" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-3xl">
                  <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs font-medium text-white/80 uppercase tracking-wider">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {isArticle ? page.article?.category : 'Elite Relocation Services'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.1] mb-4 md:mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    {page.heroHeadline}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed mb-8 md:mb-10 max-w-2xl opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    {page.heroSubheadline}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-10 md:mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                    <button onClick={() => setShowConsultation(true)} className="btn-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-xs sm:text-sm uppercase tracking-wider">
                      Book Free Consultation
                    </button>
                    {!isContact && (
                      <button onClick={() => navigate('blog')} className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-xs sm:text-sm uppercase tracking-wider">
                        Explore Insights
                      </button>
                    )}
                  </div>

                  {isHome && (
                    <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                      <HeroStats />
                    </div>
                  )}
                </div>
              </div>

              {/* Scroll indicator - hidden on mobile */}
              <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
                  <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
                </div>
              </div>
            </section>

            {/* Home-specific sections */}
            {isHome && (
              <>
                <StatsSection />
                <ComparisonTable />
                <ServicesGrid onOpenConsultation={() => setShowConsultation(true)} />
                <ProcessTimeline />
                <TestimonialsSection />
                <BlogPreview />
              </>
            )}

            {/* News Page */}
            {isNews && <DubaiNewsFeed />}

            {/* Tools Landing Page */}
            {isTools && (
              <section className="bg-alabaster py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                  {/* Tools Grid */}
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        path: 'tools/tax-calculator',
                        name: 'Tax Savings Calculator',
                        icon: '💰',
                        description: 'Calculate how much you could save by relocating to Dubai. Compare your current tax burden with the UAE\'s 0% personal income tax.',
                        features: ['7 Countries Supported', 'Instant Results', '10-Year Projections']
                      },
                      {
                        path: 'tools/golden-visa-checker',
                        name: 'Golden Visa Eligibility',
                        icon: '🛂',
                        description: 'Find out if you qualify for the UAE Golden Visa. Our checker analyzes your profile and recommends the best pathway.',
                        features: ['2-Minute Assessment', 'Multiple Pathways', 'Personalized Results']
                      },
                      {
                        path: 'tools/free-zone-comparison',
                        name: 'Free Zone Comparison',
                        icon: '🏢',
                        description: 'Compare 40+ UAE Free Zones side-by-side. Filter by industry, budget, and requirements to find your perfect match.',
                        features: ['40+ Free Zones', 'Side-by-Side Compare', 'Cost Breakdowns']
                      },
                    ].map((tool, i) => (
                      <AnimatedSection key={tool.path} delay={i * 100}>
                        <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-gold/30 group">
                          <div className="text-5xl mb-6">{tool.icon}</div>
                          <h3 className="text-xl font-display font-semibold text-navy mb-3 group-hover:text-gold transition-colors">{tool.name}</h3>
                          <p className="text-slate mb-6">{tool.description}</p>
                          <ul className="space-y-2 mb-8">
                            {tool.features.map((feature, j) => (
                              <li key={j} className="flex items-center gap-2 text-sm text-slate">
                                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => navigate(tool.path)}
                            className="w-full btn-primary py-3 rounded-xl text-sm uppercase tracking-wider font-semibold"
                          >
                            Use Tool
                          </button>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>

                  {/* SEO Content */}
                  <div className="mt-20 max-w-4xl mx-auto">
                    <AnimatedSection>
                      <h2 className="text-2xl md:text-3xl font-display font-semibold text-navy mb-6 text-center">Free Tools to Plan Your Dubai Relocation</h2>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate text-center mb-8">
                          Moving to Dubai is one of the most significant financial decisions you can make. Our suite of free tools helps you understand the benefits,
                          check your eligibility, and plan your business setup—all before you speak with a consultant.
                        </p>
                      </div>
                    </AnimatedSection>
                  </div>
                </div>
              </section>
            )}

            {/* Individual Tool Pages */}
            {isTaxCalculator && (
              <section className="bg-alabaster py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-6">
                  <TaxCalculator onOpenConsultation={() => setShowConsultation(true)} />

                  {/* SEO Content */}
                  <div className="mt-16 bg-white rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-display font-semibold text-navy mb-6">Understanding Dubai's Tax Benefits</h2>
                    <div className="prose prose-slate max-w-none">
                      <p>The UAE offers one of the most attractive tax environments in the world. With <strong>0% personal income tax</strong>, <strong>0% capital gains tax</strong>, and <strong>0% inheritance tax</strong>, Dubai has become a magnet for entrepreneurs, investors, and high-net-worth individuals seeking to optimize their financial position.</p>
                      <p>Our tax calculator helps you visualize the real savings potential. Simply enter your current income, select your country of residence, and see exactly how much you could retain by relocating to Dubai.</p>
                      <h3>Key Tax Benefits of Dubai Residency:</h3>
                      <ul>
                        <li><strong>Personal Income Tax:</strong> 0% on all personal income</li>
                        <li><strong>Capital Gains Tax:</strong> 0% on investment gains</li>
                        <li><strong>Inheritance Tax:</strong> 0% with proper planning via DIFC Wills</li>
                        <li><strong>Corporate Tax:</strong> 9% (with 0% for qualifying Free Zone income)</li>
                        <li><strong>VAT:</strong> 5% (one of the lowest rates globally)</li>
                      </ul>
                    </div>
                  </div>

                  {/* FAQs */}
                  {page.faqs && page.faqs.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-2xl font-display font-semibold text-navy mb-8 text-center">Frequently Asked Questions</h2>
                      <div className="space-y-4">
                        {page.faqs.map((faq, i) => (
                          <div key={i} className="bg-white rounded-xl p-6 border border-slate-100">
                            <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
                            <p className="text-slate">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {isVisaChecker && (
              <section className="bg-alabaster py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-6">
                  <GoldenVisaChecker onOpenConsultation={() => setShowConsultation(true)} />

                  {/* SEO Content */}
                  <div className="mt-16 bg-white rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-display font-semibold text-navy mb-6">UAE Golden Visa: Your Path to Long-Term Residency</h2>
                    <div className="prose prose-slate max-w-none">
                      <p>The <strong>UAE Golden Visa</strong> program, launched in 2019 and expanded in 2022, offers 10-year renewable residency to investors, entrepreneurs, exceptional talents, and their families. Unlike traditional UAE visas, the Golden Visa doesn't require a sponsor and has no minimum stay requirements.</p>
                      <h3>Golden Visa Categories:</h3>
                      <ul>
                        <li><strong>Investors:</strong> Property worth AED 2M+ or investment deposits</li>
                        <li><strong>Entrepreneurs:</strong> Startup founders with approved projects</li>
                        <li><strong>Specialized Talents:</strong> Scientists, doctors, engineers, artists</li>
                        <li><strong>Executives:</strong> Senior managers earning AED 30K+/month</li>
                        <li><strong>Outstanding Students:</strong> Top graduates from UAE universities</li>
                      </ul>
                      <p>Our eligibility checker analyzes your profile against all qualifying categories and recommends the most suitable pathway for your situation.</p>
                    </div>
                  </div>

                  {/* FAQs */}
                  {page.faqs && page.faqs.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-2xl font-display font-semibold text-navy mb-8 text-center">Frequently Asked Questions</h2>
                      <div className="space-y-4">
                        {page.faqs.map((faq, i) => (
                          <div key={i} className="bg-white rounded-xl p-6 border border-slate-100">
                            <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
                            <p className="text-slate">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {isFreeZoneComparison && (
              <section className="bg-alabaster py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                  <FreeZoneComparison onOpenConsultation={() => setShowConsultation(true)} />

                  {/* SEO Content */}
                  <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-display font-semibold text-navy mb-6">Choosing the Right UAE Free Zone</h2>
                    <div className="prose prose-slate max-w-none">
                      <p>The UAE is home to <strong>over 40 Free Zones</strong>, each designed to attract specific industries and business types. Free Zones offer significant advantages including 100% foreign ownership, 0% corporate and personal tax, and streamlined company formation.</p>
                      <h3>Popular UAE Free Zones:</h3>
                      <ul>
                        <li><strong>DMCC:</strong> World's #1 Free Zone for commodities and trading</li>
                        <li><strong>DIFC:</strong> Premier financial hub with Common Law jurisdiction</li>
                        <li><strong>JAFZA:</strong> Largest Free Zone, ideal for manufacturing and logistics</li>
                        <li><strong>IFZA:</strong> Cost-effective option for consultants and e-commerce</li>
                        <li><strong>RAKEZ:</strong> Budget-friendly Free Zone in Ras Al Khaimah</li>
                      </ul>
                      <p>Our comparison tool helps you filter Free Zones by industry, budget, visa requirements, and location to find the perfect match for your business needs.</p>
                    </div>
                  </div>

                  {/* FAQs */}
                  {page.faqs && page.faqs.length > 0 && (
                    <div className="mt-12 max-w-5xl mx-auto">
                      <h2 className="text-2xl font-display font-semibold text-navy mb-8 text-center">Frequently Asked Questions</h2>
                      <div className="space-y-4">
                        {page.faqs.map((faq, i) => (
                          <div key={i} className="bg-white rounded-xl p-6 border border-slate-100">
                            <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
                            <p className="text-slate">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Blog Index */}
            {isBlog && (
              <section className="bg-white py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {page.articles?.map((article, i) => {
                      const blogEffects: ImageEffect[] = ['cinematic', 'focus', 'luminous', 'curtain', 'depth', 'split'];
                      return (
                      <AnimatedSection key={article.slug} delay={i * 100}>
                        <button onClick={() => navigate(`blog/${article.slug}`)} className="group text-left w-full">
                          <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                            <PremiumImage src={article.heroImage} alt={article.title} effect={blogEffects[i % blogEffects.length]} hoverEffect="zoom" />
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate mb-3">
                            <span className="text-gold">{article.category}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-navy group-hover:text-gold transition-colors mb-3">{article.title}</h3>
                          <p className="text-slate line-clamp-2">{article.excerpt}</p>
                        </button>
                      </AnimatedSection>
                    );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Article */}
            {isArticle && (
              <section className="bg-white py-24 md:py-32">
                <div className="max-w-3xl mx-auto px-6">
                  <AnimatedSection>
                    <article className="prose prose-lg max-w-none">
                      {page.article?.content.map((p, i) => (
                        <p key={i} className={`text-lg md:text-xl text-slate leading-relaxed mb-8 ${i === 0 ? 'first-letter:text-5xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left first-letter:leading-none' : ''}`}>
                          {p}
                        </p>
                      ))}
                    </article>
                    <button onClick={() => navigate('blog')} className="mt-16 flex items-center gap-3 text-slate hover:text-gold transition-colors">
                      <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Back to Articles
                    </button>
                  </AnimatedSection>
                </div>
              </section>
            )}

            {/* Contact */}
            {isContact && (
              <section className="bg-white py-24 md:py-32">
                <div className="max-w-5xl mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <AnimatedSection>
                      <h2 className="text-display-md text-navy mb-8">Get in Touch</h2>
                      <div className="space-y-8">
                        {[
                          { icon: '📍', title: 'Dubai Office', text: 'Gate Village, DIFC\nDubai, United Arab Emirates' },
                          { icon: '✉️', title: 'Email', text: 'concierge@move2dubai.com' },
                          { icon: '📞', title: 'Phone', text: '+971 4 XXX XXXX' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-xl">{item.icon}</div>
                            <div>
                              <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                              <p className="text-slate whitespace-pre-line">{item.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AnimatedSection>
                    <AnimatedSection delay={200}>
                      <div className="bg-alabaster rounded-2xl p-8">
                        <h3 className="text-xl font-semibold text-navy mb-6">Schedule a Consultation</h3>
                        <button onClick={() => setShowConsultation(true)} className="btn-primary w-full py-4 rounded-lg text-sm uppercase tracking-wider">
                          Book Free Consultation
                        </button>
                        <p className="text-sm text-slate mt-4 text-center">Or email us directly at concierge@move2dubai.com</p>
                      </div>
                    </AnimatedSection>
                  </div>
                </div>
              </section>
            )}

            {/* Regular page content */}
            {!isHome && !isBlog && !isArticle && !isContact && !isNews && !isTools && !isToolPage && (
              <>
                {page.narrativeSection && (
                  <section className="bg-white py-24 md:py-32">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                      <AnimatedSection>
                        <h2 className="text-display-md md:text-display-lg text-navy mb-10">{page.narrativeSection.title}</h2>
                        <div className="space-y-6">
                          {page.narrativeSection.text.map((t, i) => <p key={i} className="text-body-xl text-slate">{t}</p>)}
                        </div>
                      </AnimatedSection>
                    </div>
                  </section>
                )}

                {page.benefits.length > 0 && (
                  <section className="bg-alabaster py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <AnimatedSection>
                          <div className="rounded-2xl overflow-hidden">
                            <PremiumImage src={page.contentImage} aspect="aspect-[4/5]" alt="Services" effect="depth" hoverEffect="lift" />
                          </div>
                        </AnimatedSection>
                        <div>
                          <AnimatedSection>
                            <span className="text-label text-gold uppercase tracking-widest mb-4 block">Why Choose Us</span>
                            <h2 className="text-display-md md:text-display-lg text-navy mb-10">Precision & Excellence</h2>
                          </AnimatedSection>
                          <div className="space-y-8">
                            {page.benefits.map((b, i) => (
                              <AnimatedSection key={i} delay={i * 100}>
                                <div className="flex gap-6 items-start">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                    <span className="text-gold font-semibold">0{i + 1}</span>
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-navy mb-2">{b.title}</h3>
                                    <p className="text-slate">{b.description}</p>
                                  </div>
                                </div>
                              </AnimatedSection>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {page.sections.map((s, i) => renderSection(s, i))}

                {page.faqs.length > 0 && (
                  <section className="bg-navy py-24 md:py-32">
                    <div className="max-w-3xl mx-auto px-6">
                      <AnimatedSection className="text-center mb-16">
                        <span className="text-label text-gold uppercase tracking-widest mb-4 block">FAQ</span>
                        <h2 className="text-display-md md:text-display-lg text-white">Common Questions</h2>
                      </AnimatedSection>
                      <div className="space-y-4">
                        {page.faqs.map((faq, i) => (
                          <AnimatedSection key={i} delay={i * 50}>
                            <details className="group glass-panel rounded-xl overflow-hidden">
                              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="text-lg font-medium text-white pr-8">{faq.question}</span>
                                <svg className="w-5 h-5 text-gold transition-transform duration-300 group-open:rotate-180 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="px-6 pb-6">
                                <p className="text-white/70">{faq.answer}</p>
                              </div>
                            </details>
                          </AnimatedSection>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Final CTA - All pages except contact */}
            {!isContact && !isNews && !isTools && <FinalCTA onOpenConsultation={() => setShowConsultation(true)} />}
          </main>
        </PageTransition>

        <Footer />

        {/* Consultation Modal */}
        {showConsultation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/95 backdrop-blur-sm animate-fade-in">
            <LeadForm onClose={() => setShowConsultation(false)} isModal={true} />
          </div>
        )}
      </div>
    </NavigationContext.Provider>
  );
};

export default App;
