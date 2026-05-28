import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Zap, Shield, DollarSign, Clock, Headphones } from 'lucide-react';
import { Card } from './ui/card';

export const WhyChooseUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const reasons = [
    {
      icon: Zap,
      title: 'Modern Tech Stack',
      description: 'We develop utilizing the newest frameworks ensuring your platform is future-proof and robust.',
      highlight: 'Engineered for reliability',
      accentColor: 'group-hover:border-primary/40 hover:shadow-[0_0_20px_rgba(63,167,230,0.15)]',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      icon: Shield,
      title: 'Scalable Architecture',
      description: 'Engineered from day one to handle heavy customer spikes and auto-scale dynamically.',
      highlight: 'Enterprise-grade code',
      accentColor: 'group-hover:border-secondary/40 hover:shadow-[0_0_20px_rgba(243,191,74,0.15)]',
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      icon: DollarSign,
      title: 'Competitive Value',
      description: 'Get the highest industry-standard software products optimized perfectly for your budget.',
      highlight: 'Optimal pricing models',
      accentColor: 'group-hover:border-primary/40 hover:shadow-[0_0_20px_rgba(63,167,230,0.15)]',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      icon: Clock,
      title: 'Strict Delivery Timelines',
      description: 'We respect your schedules. Our team implements agile methodologies to deploy right on time.',
      highlight: 'Accurate milestone mapping',
      accentColor: 'group-hover:border-secondary/40 hover:shadow-[0_0_20px_rgba(243,191,74,0.15)]',
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      icon: Headphones,
      title: 'Constant Support',
      description: 'We stand by our code. Benefit from post-deployment support and regular code iterations.',
      highlight: 'Comprehensive coverage',
      accentColor: 'group-hover:border-primary/40 hover:shadow-[0_0_20px_rgba(63,167,230,0.15)]',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Assurance',
      description: 'Every project goes through automated testing pipelines and rigorous manual reviews.',
      highlight: 'Zero tolerance for leaks',
      accentColor: 'group-hover:border-secondary/40 hover:shadow-[0_0_20px_rgba(243,191,74,0.15)]',
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background visual overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background z-0 select-none pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Title Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass px-4 py-2 rounded-full mb-4 border-primary/20 animate-pulse-glow-blue">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Why Partner <span className="gradient-text glow-text">With Us</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We combine technical excellence with business understanding to deliver 
            solutions that drive real results.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 35 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className={`glass p-6 h-full transition-all duration-300 group rounded-3xl border border-muted/20 ${reason.accentColor}`}>
                  <div className="flex items-start space-x-4">
                    {/* Icon container */}
                    <div className={`w-12 h-12 ${reason.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${reason.iconColor}`} />
                    </div>
                    {/* Details content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {reason.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {reason.description}
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${reason.iconColor} flex-shrink-0`} />
                        <span className="text-[11px] text-foreground/80 font-bold font-mono uppercase tracking-wider">{reason.highlight}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Big Highlight Statistics comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <Card className="glass p-8 rounded-3xl border-primary/20 shadow-2xl relative overflow-hidden group">
            {/* Visual shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
            
            <div className="grid sm:grid-cols-3 gap-8 text-center relative z-10 divide-y sm:divide-y-0 sm:divide-x divide-muted/30">
              <div className="py-4 sm:py-0">
                <div className="text-4xl sm:text-5xl font-black gradient-text glow-text mb-2 font-mono">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Client Satisfaction</div>
              </div>
              <div className="py-4 sm:py-0">
                <div className="text-4xl sm:text-5xl font-black gradient-text glow-text-gold mb-2 font-mono">2x</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Faster Delivery</div>
              </div>
              <div className="py-4 sm:py-0">
                <div className="text-4xl sm:text-5xl font-black gradient-text glow-text mb-2 font-mono">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Code Integrity</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;