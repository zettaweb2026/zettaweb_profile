import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { fallbackServices } from '../../lib/fallbackData';

/**
 * ServicesPreview — Lightweight homepage teaser.
 * Shows first 3 service cards + CTA to /services
 */
export const ServicesPreview = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch3Services = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/services`
        );
        const data = await response.json();
        const list = Array.isArray(data) && data.length > 0 ? data : fallbackServices;
        setServices(list.slice(0, 3)); // Only first 3
      } catch {
        setServices(fallbackServices.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetch3Services();
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4"
        >
          <div>
            <div className="inline-block glass px-4 py-2 rounded-full border-primary/20 animate-pulse-glow-blue mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              What We <span className="gradient-text glow-text">Offer</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all duration-300 group flex-shrink-0"
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* 3 Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {services.map((service, index) => {
            const Icon = LucideIcons[service.icon] || LucideIcons.HelpCircle;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                onClick={() => navigate('/services')}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded border border-border/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 glass border border-primary/20 hover:border-primary/50 text-foreground font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 group hover:bg-primary/5"
          >
            Explore All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
