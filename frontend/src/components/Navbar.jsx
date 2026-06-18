import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Close mobile menu on route change
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (!isHomePage) {
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // IntersectionObserver for Home page scroll sections
    const sectionIds = ['hero', 'about', 'services', 'tech-stack', 'projects', 'contact'];
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [isHomePage]);

  // Navigation items: hash scroll on Home, dedicated pages for the rest
  const navItems = [
    { name: 'Home', type: 'hash', href: '#hero', sectionId: 'hero', path: '/' },
    { name: 'Services', type: 'page', href: '/services', path: '/services' },
    { name: 'Projects', type: 'page', href: '/projects', path: '/projects' },
    { name: 'Testimonials', type: 'page', href: '/testimonials', path: '/testimonials' },
    { name: 'Contact', type: 'page', href: '/contact', path: '/contact' },
  ];

  const isNavItemActive = (item) => {
    if (item.type === 'page') {
      return location.pathname === item.href;
    }
    // Hash items are active based on scroll section, only on home page
    return isHomePage && activeSection === item.sectionId;
  };

  const scrollToSection = (e, href, sectionId) => {
    e.preventDefault();
    if (!isHomePage) {
      // Navigate home first, then scroll
      navigate('/' + href);
      setIsOpen(false);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass border-b border-primary/20 shadow-2xl backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand Link */}
          <Link
            to="/"
            className="flex items-center space-x-3 group relative"
          >
            <div className="relative overflow-hidden rounded-xl border border-primary/20 p-1 bg-background/50 group-hover:border-primary/50 transition-all duration-300">
              <img
                src="/logo.png"
                alt="ZettaWeb - Top Web Development & AI Solutions Company Logo"
                className="h-10 w-10 object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-2xl font-black tracking-tight gradient-text glow-text group-hover:scale-[1.02] transition-transform duration-300">
              Zettaweb
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              if (item.type === 'page') {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors relative group rounded-lg ${
                      isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary shadow-[0_0_8px_#3fa7e6] rounded-full"
                      />
                    )}
                  </Link>
                );
              }
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href, item.sectionId)}
                  className={`px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors relative group rounded-lg ${
                    isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary shadow-[0_0_8px_#3fa7e6] rounded-full"
                    />
                  )}
                </a>
              );
            })}
            <Button
              onClick={() => navigate('/book-now')}
              className="ml-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:animate-pulse-glow-blue border-none"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 text-foreground hover:text-primary transition-colors glass rounded-xl border border-primary/20"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-primary/20 absolute top-full left-0 right-0 shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item);
                if (item.type === 'page') {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-base font-semibold uppercase tracking-wider rounded-xl transition-all ${
                        isActive
                          ? 'text-primary bg-primary/10 border-l-4 border-primary'
                          : 'text-foreground/70 hover:text-foreground hover:bg-muted/35'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href, item.sectionId)}
                    className={`block px-4 py-3 text-base font-semibold uppercase tracking-wider rounded-xl transition-all ${
                      isActive
                        ? 'text-primary bg-primary/10 border-l-4 border-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/35'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="pt-4 border-t border-muted/20">
                <Button
                  onClick={() => {
                    navigate('/book-now');
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 rounded-xl shadow-lg border-none hover:animate-pulse-glow-blue"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;