import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { fallbackTestimonials } from '../../lib/fallbackData';

/**
 * TestimonialsPreview — Lightweight homepage teaser.
 * Shows first 2 testimonial cards side by side + CTA to /testimonials
 */
export const TestimonialsPreview = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const [testimonials, setTestimonials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch2Testimonials = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/testimonials`
        );
        const data = await response.json();
        const list = Array.isArray(data) && data.length > 0 ? data : fallbackTestimonials;
        setTestimonials(list.slice(0, 2)); // Only first 2
      } catch {
        setTestimonials(fallbackTestimonials.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    fetch2Testimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

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
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              What Clients <span className="gradient-text glow-text">Say</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/testimonials')}
            className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all duration-300 group flex-shrink-0"
          >
            Read All Reviews
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* 2 Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card className="glass p-7 rounded-3xl border-muted/20 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group h-full flex flex-col justify-between">
                <Quote className="w-10 h-10 text-primary/10 absolute -top-1 right-3 group-hover:text-primary/20 transition-colors" />
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-4">
                    "{t.feedback}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-5 border-t border-muted/20 mt-4">
                  <Avatar className="w-11 h-11 bg-primary/10 border border-primary/20">
                    <AvatarFallback className="text-primary font-black text-sm">
                      {t.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-extrabold text-foreground text-sm">{t.name}</h4>
                    <p className="text-[11px] text-muted-foreground font-semibold">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/testimonials')}
            className="inline-flex items-center gap-2 glass border border-primary/20 hover:border-primary/50 text-foreground font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 group hover:bg-primary/5"
          >
            See All Testimonials
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
