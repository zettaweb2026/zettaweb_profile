import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as LucideIcons from 'lucide-react';
import { Card } from './ui/card';

import { fallbackAboutValues, fallbackAboutTimeline } from '../lib/fallbackData';

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const [values, setValues] = React.useState([]);
  const [timeline, setTimeline] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [valuesRes, timelineRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/aboutValues`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/aboutTimeline`)
        ]);
        const [valuesData, timelineData] = await Promise.all([
          valuesRes.json(),
          timelineRes.json()
        ]);
        
        if (Array.isArray(valuesData) && valuesData.length > 0) {
          setValues(valuesData);
        } else {
          setValues(fallbackAboutValues);
        }

        if (Array.isArray(timelineData) && timelineData.length > 0) {
          setTimeline(timelineData);
        } else {
          setTimeline(fallbackAboutTimeline);
        }
      } catch (error) {
        console.error('Failed to fetch about data, using frontend fallback:', error);
        setValues(fallbackAboutValues);
        setTimeline(fallbackAboutTimeline);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading || values.length === 0 || timeline.length === 0) return null;

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background visual assets */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none select-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Title Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-left mb-20 max-w-4xl"
        >
          <div className="relative inline-block mb-4">
            <span className="absolute -top-6 left-0 text-xs font-semibold text-primary/45 tracking-wider">01</span>
            <div className="inline-block glass px-4 py-2 rounded-full border-primary/20 animate-pulse-glow-blue">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">About Us</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Who We <span className="gradient-text glow-text">Are</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Zettaweb is a forward-thinking tech company dedicated to building innovative digital solutions 
            that empower businesses to thrive in the digital age. We combine creativity, technical excellence, 
            and strategic thinking to deliver exceptional results.
          </p>
        </motion.div>

        {/* Mission & Vision cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Card className="glass p-8 h-full rounded-3xl border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(63,167,230,0.15)] flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <LucideIcons.Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To empower businesses with innovative digital solutions that drive growth, efficiency, and 
                  competitive advantage. We strive to be the trusted technology partner that transforms visions 
                  into successful digital realities.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary font-mono select-none">
                // TARGET_EXECUTE
              </div>
            </Card>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Card className="glass p-8 h-full rounded-3xl border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(243,191,74,0.15)] flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
                  <LucideIcons.Eye className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-secondary transition-colors">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To be a global leader in digital innovation, recognized for delivering cutting-edge solutions 
                  that shape the future of technology. We envision a world where businesses of all sizes can 
                  leverage advanced technology to achieve their full potential.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-secondary font-mono select-none">
                // FUTURE_FORECAST
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Core Values grid */}
        <div className="mb-28">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-extrabold text-center mb-12"
          >
            Our Core <span className="gradient-text glow-text">Values</span>
          </motion.h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = LucideIcons[value.icon] || LucideIcons.HelpCircle;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                >
                  <Card className="glass-card p-6 h-full flex flex-col justify-between group rounded-2xl">
                    <div>
                      <div className={`w-12 h-12 ${value.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${value.color}`} />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{value.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline Journey */}
        <div className="relative">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-extrabold text-center mb-16"
          >
            Our <span className="gradient-text glow-text">Journey</span>
          </motion.h3>

          <div className="max-w-3xl mx-auto relative px-4 sm:px-6">
            {/* Timeline Line */}
            <div className="absolute left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-secondary to-primary/20 hidden sm:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  className="relative pl-0 sm:pl-16 flex flex-col sm:flex-row items-start"
                >
                  {/* Timeline Badge Point */}
                  <div className="absolute left-0 sm:left-4 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg z-10 hidden sm:flex">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary animate-pulse-glow-blue"></div>
                  </div>
                  
                  {/* Timeline Content Block */}
                  <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    <div className="inline-block glass px-4 py-1.5 rounded-full border border-primary/30 text-xs font-black font-mono text-primary bg-primary/5 min-w-[70px] text-center">
                      {item.year}
                    </div>
                    
                    <Card className="glass p-6 w-full rounded-2xl hover:border-primary/20 transition-all duration-300">
                      <h4 className="text-lg font-bold text-foreground mb-1.5">{item.event}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;