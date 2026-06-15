import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Code, Zap, Globe, Cpu, Database, Server } from 'lucide-react';

export const Hero = () => {
  const [text, setText] = useState('');
  const fullText = 'Building Digital Solutions for the Future';
  const [showCursor, setShowCursor] = useState(true);

  // Mouse tracking for 3D card rotation (normalized -1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 18 });

  const rotateX = useTransform(springY, [-1, 1], [15, -15]);
  const rotateY = useTransform(springX, [-1, 1], [-15, 15]);

  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized coordinates (-1 to 1)
    const x = ((e.clientX - rect.left) / width) * 2 - 1;
    const y = ((e.clientY - rect.top) / height) * 2 - 1;
    
    mouseX.set(x);
    mouseY.set(y);

    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Code, label: 'Projects Completed', value: '150+' },
    { icon: Globe, label: 'Happy Clients', value: '80+' },
    { icon: Zap, label: 'Years Experience', value: '5+' },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 lg:pb-20">
      {/* Premium Generated Background with Gradient Mask */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-background/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10"></div>
        <img
          src="/hero-bg.png"
          alt="ZettaWeb - AI Solutions, Cloud Technologies and Web Development Background"
          className="w-full h-full object-cover opacity-45 scale-105"
        />
        {/* Floating gradient blobs for 3D depth */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-float-slow -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-secondary/15 rounded-full blur-[100px] animate-float-delayed -z-10"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Branding and Intro */}
          <div className="lg:col-span-7 text-left space-y-8">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <div className="glass px-5 py-1.5 rounded-full border border-primary/30 inline-flex items-center space-x-2 animate-pulse-glow-blue">
                <Zap className="w-4 h-4 text-primary animate-bounce" />
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase">Innovating Since 2021</span>
              </div>
            </motion.div>

            {/* Heading and Typography */}
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

            {/* Description */}
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

            {/* CTAs */}
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

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-6 max-w-lg border-t border-muted/30"
            >
              {stats.map((stat, i) => {
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
          </div>

          {/* Right Column: Single Front Card */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center perspective-1000 h-[550px]">
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
                boxShadow: isHovered
                  ? "0 25px 50px -12px rgba(63, 167, 230, 0.35), 0 0 40px rgba(243, 191, 74, 0.15)"
                  : "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
              }}
              className="w-80 h-[420px] relative rounded-3xl p-[1.5px] bg-gradient-to-br from-primary/30 via-slate-800/40 to-secondary/30 cursor-grab active:cursor-grabbing preserve-3d transition-all duration-300"
            >
              {/* Dynamic spotlight edge/glow layer */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(180px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, hsl(var(--primary)) 0%, hsl(var(--secondary)) 60%, transparent 100%)`,
                }}
              />

              {/* Inner content container */}
              <div
                className="w-full h-full bg-[#0a0a0f]/90 backdrop-blur-xl rounded-[22px] p-6 flex flex-col justify-between relative z-10 preserve-3d"
              >
                {/* Subtle high-tech grid background pattern */}
                <div 
                  className="absolute inset-0 rounded-[22px] opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
                    backgroundSize: "16px 16px"
                  }}
                />

                {/* Inner spotlight face glow */}
                <div
                  className="absolute inset-0 rounded-[22px] pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(220px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(63, 167, 230, 0.15), transparent 80%)`,
                  }}
                />

                {/* Header Section: translateZ(40px) */}
                <div style={{ transform: "translateZ(40px)" }} className="flex justify-between items-start preserve-3d relative z-20">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-md shadow-primary/10">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary/80 tracking-wider">LAYER_01 // CORE_UI</span>
                </div>
                
                {/* Center Content Section: translateZ(30px) */}
                <div style={{ transform: "translateZ(30px)" }} className="space-y-4 preserve-3d relative z-20">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight drop-shadow-md">Next-Gen Portals</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">FPS Optimization</span>
                      <span className="text-primary font-bold">60.00 FPS</span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <motion.div 
                        animate={{ width: ["0%", "100%", "98%"] }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Section: translateZ(20px) */}
                <div style={{ transform: "translateZ(20px)" }} className="flex items-center justify-between text-xs border-t border-muted/20 pt-4 preserve-3d relative z-20">
                  <span className="text-muted-foreground font-medium font-mono">Status: ACTIVE</span>
                  <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-mono text-[10px] text-green-400 font-bold">ONLINE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
        onClick={() => scrollToSection('#about')}
      >
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center p-1.5 hover:border-primary transition-colors">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;