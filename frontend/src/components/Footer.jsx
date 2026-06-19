import React from 'react';
import { Github, Linkedin, Facebook, Instagram, Mail, Heart } from 'lucide-react';
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
      { name: 'Blog', href: '#', badge: 'Coming Soon' },
      { name: 'Documentation', href: '#', badge: 'Coming Soon' },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/zettawebsolutions/', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61590293921402', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/zetta_web_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', label: 'Instagram' },
    { icon: Github, href: 'https://github.com/zettaweb2026', label: 'GitHub' },
    { icon: Mail, href: 'mailto:support@zetta-web.in', label: 'Email' },
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

  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    toast.success('Successfully subscribed to Zettaweb Newsletter!');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
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
                  alt="ZettaWeb - Best AI Solutions & Web Development Services Logo" 
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
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                  <li key={link.name} className="flex items-center gap-2">
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-wider scale-90 select-none">
                        {link.badge}
                      </span>
                    )}
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
            {isSubscribed ? (
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-5 py-3 text-primary text-sm font-bold animate-pulse-glow-blue w-full lg:w-auto">
                <span className="text-xl">🎉</span>
                <span>You're subscribed to Zettaweb Newsletter!</span>
              </div>
            ) : (
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
            )}
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