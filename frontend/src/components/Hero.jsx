import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Code, Zap, Globe, Cpu, Database, Server } from 'lucide-react';

export const Hero = () => {
  const [text, setText] = useState('');
  const fullText = 'Building Digital Solutions for the Future';
  const [showCursor, setShowCursor] = useState(true);

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

          {/* Right Column: Stacked 2D Cards */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center h-[550px]">
            <div className="relative w-80 h-[420px]">
              {/* Back Card: Cloud Infrastructures */}
              <div 
                style={{ transform: "translateY(-24px) scale(0.9)" }}
                className="absolute inset-0 glass rounded-3xl border border-secondary/20 p-6 flex flex-col justify-between shadow-2xl z-10"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Server className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-xs font-mono text-secondary">LAYER_03 // CLOUD</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">AWS & Docker</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Secure, automated, and auto-scaling CI/CD deployments.</p>
                </div>
                <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-4/5 rounded-full"></div>
                </div>
              </div>

              {/* Middle Card: AI Models */}
              <div 
                style={{ transform: "translateY(-12px) scale(0.95)" }}
                className="absolute inset-0 glass rounded-3xl border border-primary/20 p-6 flex flex-col justify-between shadow-2xl z-20"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary">LAYER_02 // AI_ML</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Intelligent Engines</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Custom LLMs, neural classification, and forecasting.</p>
                </div>
                <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 rounded-full"></div>
                </div>
              </div>

              {/* Front Card: Web Portal */}
              <div 
                className="absolute inset-0 glass-card rounded-3xl p-6 flex flex-col justify-between shadow-2xl border-primary/30 z-30 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary">LAYER_01 // CORE_UI</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Next-Gen Portals</h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">FPS Optimization</span>
                      <span className="text-primary font-mono font-bold">60.00 FPS</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ["0%", "100%", "98%"] }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-muted/20 pt-4">
                  <span className="text-muted-foreground font-medium">Status: ACTIVE</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                    <span className="font-mono text-[10px] text-green-400">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>
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