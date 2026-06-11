import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#about' },
      { name: 'Careers', href: '#contact' },
      { name: 'Contact', href: '#contact' },
    ],
    Services: [
      { name: 'Web Development', href: '#services' },
      { name: 'App Development', href: '#services' },
      { name: 'AI/ML Solutions', href: '#services' },
      { name: 'Cloud & DevOps', href: '#services' },
    ],
    Resources: [
      { name: 'Portfolio', href: '#projects' },
      { name: 'Tech Stack', href: '#tech-stack' },
      { name: 'Blog', href: '#' },
      { name: 'Documentation', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/zettaweb2026', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@zettaweb.com', label: 'Email' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success('Successfully subscribed to Zettaweb Newsletter!');
  };

  return (
    <footer className="relative z-10 glass border-t border-primary/20 mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Socials Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 select-none">
              <div className="overflow-hidden rounded-xl border border-primary/20 p-1 bg-background/50">
                <img 
                  src="/logo.png" 
                  alt="Zettaweb Logo" 
                  className="h-10 w-10 object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-black tracking-tight gradient-text glow-text">Zettaweb</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
              Building innovative digital solutions that transform businesses and shape the future of technology.
            </p>
            <div className="flex gap-3 select-none">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    onClick={(e) => {
                      if (social.href === '#') e.preventDefault();
                    }}
                    aria-label={social.label}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:border-primary/45 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav Categories */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Box */}
        <div className="mt-12 pt-8 border-t border-muted/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-1">
              <h3 className="font-bold text-lg text-foreground">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter for the latest tech insights and updates.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="px-4 py-3 glass rounded-xl border border-muted/30 focus:border-primary/70 focus:ring-0 outline-none text-xs sm:text-sm flex-1 lg:w-64 bg-background/30 transition-all"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright / policies bar */}
        <div className="mt-12 pt-8 border-t border-muted/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5 flex-wrap justify-center">
              <span>&copy; {currentYear} Zettaweb. All rights reserved. Made with</span>
              <Heart className="w-3.5 h-3.5 text-primary fill-primary inline animate-pulse" />
              <span>by Zettaweb Team</span>
            </p>
            <div className="flex gap-6 select-none">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;