import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // #3 FIX: Use IntersectionObserver for accurate active section detection
    const sectionIds = ['hero', 'about', 'services', 'tech-stack', 'projects', 'contact'];
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
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
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + href);
      setIsOpen(false);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
      setActiveSection(href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'glass border-b border-primary/20 shadow-2xl backdrop-blur-md py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand Link */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
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
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors relative group rounded-lg ${isActive
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-foreground'
                    }`}
                >
                  {item.name}
                  {/* Underline for Active Section */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary shadow-[0_0_8px_#3fa7e6] rounded-full"
                    />
                  )}
                </a>
              );
            })}
            {/* #16 FIX: Pulse glow only on hover, not constantly */}
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
            <div className="container mx-auto px-4 py-6 space-y-3">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`block px-4 py-3 text-base font-semibold uppercase tracking-wider rounded-xl transition-all ${isActive
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