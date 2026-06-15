import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from './ui/button';
import { ArrowRight, Code, Zap, Globe, ChevronDown } from 'lucide-react';
import useCountUp from '../hooks/useCountUp';

export const Hero = () => {
  const [text, setText] = useState('');
  const fullText = 'Building Digital Solutions for the Future';
  const [showCursor, setShowCursor] = useState(true);

  // For stat counters — trigger once hero is visible
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const projectsCount = useCountUp('150+', 1600, statsInView);
  const clientsCount  = useCountUp('80+',  1400, statsInView);
  const yearsCount    = useCountUp('5+',   1200, statsInView);

  // Mouse tracking for 3D card rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [12, -12]);
  const rotateY = useTransform(mouseX, [-150, 150], [-12, 12]);

  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  // Spotlight tracking inside the card
  const [spotlight, setSpotlight] = useState({ x: 160, y: 210 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = e.clientX - rect.left - rect.width / 2;
    const yVal = e.clientY - rect.top - rect.height / 2;
    mouseX.set(xVal);
    mouseY.set(yVal);
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 55);
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: Code,  label: 'Projects Completed', value: projectsCount },
    { icon: Globe, label: 'Happy Clients',       value: clientsCount  },
    { icon: Zap,   label: 'Years Experience',    value: yearsCount    },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 lg:pb-20">
      {/* Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-background/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10"></div>
        <img
          src="/hero-bg.png"
          alt="ZettaWeb - AI Solutions, Cloud Technologies and Web Development Background"
          className="w-full h-full object-cover opacity-45 scale-105"
        />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-float-slow -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-secondary/15 rounded-full blur-[100px] animate-float-delayed -z-10"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              {/* #14 FIX: Changed from animate-bounce to animate-pulse on the Zap icon */}
              <div className="glass px-5 py-1.5 rounded-full border border-primary/30 inline-flex items-center space-x-2 animate-pulse-glow-blue">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase">Innovating Since 2021</span>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-none tracking-tight"
              >
                <span className="text-foreground">We Are</span>
                <br />
                <span className="gradient-text glow-text">Zettaweb</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="min-h-[60px] flex items-center"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-foreground/90 font-medium">
                  <span className="font-mono text-primary mr-2">&gt;</span>
                  <span className="text-foreground">{text}</span>
                  {showCursor && <span className="animate-pulse text-secondary ml-1 font-bold">|</span>}
                </h2>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              We craft cutting-edge digital experiences through innovative web development,
              AI/ML solutions, and cloud architectures. Zettaweb translates complex business
              requirements into highly-optimized, high-fidelity software products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('#contact')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold group animate-pulse-glow-blue border-none rounded-xl"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#projects')}
                className="glass border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg font-bold rounded-xl"
              >
                View Projects
              </Button>
            </motion.div>

            {/* #1 FIX: Animated stat counters with useCountUp */}
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-6 max-w-lg border-t border-muted/30"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Icon className="w-4 h-4" />
                      <span className="text-xl sm:text-2xl font-bold text-foreground font-mono">{stat.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>

            {/* #2 FIX: Mobile stats strip — visible only on mobile/tablet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex lg:hidden items-center justify-start gap-3 flex-wrap pt-2"
            >
              {[
                { label: '150+ Projects', color: 'border-primary/30 text-primary' },
                { label: '80+ Clients',   color: 'border-secondary/30 text-secondary' },
                { label: '5+ Years',      color: 'border-primary/30 text-primary' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`glass px-3 py-1 rounded-full border text-xs font-bold font-mono ${badge.color}`}
                >
                  {badge.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: 3D Hover Card */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center perspective-1000 h-[550px]">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-80 h-[420px] cursor-grab active:cursor-grabbing preserve-3d"
            >
              {/* Glowing border wrapper */}
              <div
                className="absolute inset-0 rounded-3xl transition-all duration-500"
                style={{
                  padding: '1.5px',
                  borderRadius: '1.5rem',
                  background: isHovered
                    ? `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(63,167,230,0.95) 0%, rgba(63,167,230,0.5) 35%, rgba(243,191,74,0.2) 65%, transparent 80%)`
                    : 'linear-gradient(135deg, rgba(63,167,230,0.35) 0%, rgba(243,191,74,0.15) 50%, rgba(63,167,230,0.25) 100%)',
                }}
              >
                {/* Inner card dark surface */}
                <div
                  className="w-full h-full rounded-[22px] flex flex-col justify-between p-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(8,8,16,0.97) 0%, rgba(12,12,24,0.99) 100%)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Inner cursor spotlight on face */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[22px] transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(63,167,230,0.1) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Subtle grid pattern */}
                  <div
                    className="absolute inset-0 rounded-[22px] pointer-events-none"
                    style={{
                      opacity: 0.04,
                      backgroundImage: `
                        linear-gradient(rgba(63,167,230,1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(63,167,230,1) 1px, transparent 1px)
                      `,
                      backgroundSize: '28px 28px',
                    }}
                  />

                  {/* Header */}
                  <div style={{ transform: 'translateZ(30px)' }} className="flex justify-between items-start relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">LAYER_01 // CORE_UI</span>
                  </div>

                  {/* Center content */}
                  <div style={{ transform: 'translateZ(20px)' }} className="space-y-5 relative z-10">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">Next-Gen Portals</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground">FPS Optimization</span>
                        <span className="text-primary font-bold">60.00 FPS</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: ['0%', '100%', '98%'] }}
                          transition={{ duration: 2.2, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ transform: 'translateZ(10px)' }} className="flex items-center justify-between text-xs border-t border-white/5 pt-4 relative z-10">
                    <span className="text-muted-foreground font-mono">Status: ACTIVE</span>
                    <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="font-mono text-[10px] text-green-400 font-semibold">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambient glow shadow beneath card */}
              <div
                className="absolute inset-0 rounded-3xl -z-10 blur-xl transition-all duration-500"
                style={{
                  background: isHovered
                    ? 'radial-gradient(ellipse at center, rgba(63,167,230,0.3) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at center, rgba(63,167,230,0.08) 0%, transparent 70%)',
                  transform: 'translateY(16px) scale(0.92)',
                }}
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* #13 FIX: Scroll Down Indicator with label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center gap-2"
        onClick={() => scrollToSection('#about')}
      >
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center p-1.5 hover:border-primary transition-colors">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;