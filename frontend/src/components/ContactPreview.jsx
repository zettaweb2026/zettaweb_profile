import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * ContactPreview — Lightweight homepage teaser.
 * Shows contact info + a simple CTA to /contact (no form)
 */
export const ContactPreview = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email Us',
      value: 'support@zetta-web.in',
      href: 'mailto:support@zetta-web.in',
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+91 9674171451',
      href: 'tel:+919674171451',
    },
    {
      icon: MapPin,
      label: 'Find Us',
      value: 'Kolkata, West Bengal',
      href: 'https://www.google.com/maps/place/Kolkata',
    },
  ];

  const handleContactInfoClick = (e, item) => {
    if (item.label === 'Email Us') {
      e.preventDefault();
      navigator.clipboard.writeText(item.value);
      toast.success('Email address copied to clipboard!');
      window.location.href = item.href;
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="inline-block glass px-4 py-2 rounded-full border-primary/20 animate-pulse-glow-blue mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Let's Build <span className="gradient-text glow-text">Together</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Ready to start your project? Reach out and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10"
        >
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleContactInfoClick(e, item)}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center text-center p-6 glass rounded-2xl hover:border-primary/40 transition-all duration-300 group border border-transparent"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.value}
                </p>
              </motion.a>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl text-base shadow-lg animate-pulse-glow-blue transition-all duration-300 border-none cursor-pointer"
          >
            Send Us a Message
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/book-now')}
            className="inline-flex items-center gap-2 glass border border-primary/20 hover:border-primary/50 text-foreground font-bold px-8 py-4 rounded-xl text-base transition-all duration-300 cursor-pointer"
          >
            Book a Free Call
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPreview;
