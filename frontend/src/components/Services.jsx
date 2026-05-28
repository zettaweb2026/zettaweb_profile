import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Globe, 
  Smartphone, 
  Brain, 
  Zap, 
  Cloud, 
  Shield, 
  Palette, 
  Settings 
} from 'lucide-react';
import { Button } from './ui/button';

// Inner component for custom mouse-track 3D Tilt Card
const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to rotational angles
  const rotateX = useTransform(y, [-150, 150], [12, -12]);
  const rotateY = useTransform(x, [-150, 150], [-12, 12]);

  const springX = useSpring(rotateX, { stiffness: 120, damping: 15 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
      }}
      className={`glass-card p-6 h-full flex flex-col justify-between rounded-2xl relative cursor-pointer group hover:-translate-y-1`}
    >
      <div style={{ transform: 'translateZ(30px)' }} className="preserve-3d flex flex-col h-full justify-between">
        <div>
          {/* Card Icon Header */}
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Footer info & tags */}
        <div className="space-y-4 pt-4 border-t border-muted/20">
          <div className="flex flex-wrap gap-1.5">
            {service.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded border border-border/30"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xs text-primary/80 font-bold flex justify-between items-center group-hover:text-secondary transition-colors">
            <span>{service.benefits}</span>
            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-lg font-normal">&rarr;</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Modern, responsive websites built with cutting-edge frameworks like React, Next.js, and Node.',
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript'],
      benefits: 'Fast, SEO-optimized, scalable web apps',
    },
    {
      icon: Smartphone,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      benefits: 'High performance native capabilities',
    },
    {
      icon: Brain,
      title: 'AI / ML Solutions',
      description: 'Intelligent systems powered by neural networks, LLM integrations, and machine learning.',
      technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn'],
      benefits: 'Automated workflow intelligence',
    },
    {
      icon: Zap,
      title: 'Automation Tools',
      description: 'Custom automation tools and web scraping systems to streamline business operations.',
      technologies: ['Python', 'Selenium', 'Zapier', 'N8N'],
      benefits: 'Increase efficiency, drop manual work',
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Cloud infrastructure setup, containers deployments, and unified continuous integration.',
      technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
      benefits: '99.9% uptime, auto-scaling grids',
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Robust security audits, penetration testing and high-standard compliance implementations.',
      technologies: ['Penetration Testing', 'Security Audits', 'Encryption'],
      benefits: 'Ironclad security and complete trust',
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Stunning design mockups, wireframes, and interactive customer journeys.',
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      benefits: 'High user retention and wow factors',
    },
    {
      icon: Settings,
      title: 'Custom Software',
      description: 'Bespoke software systems customized for your enterprise operations.',
      technologies: ['Full Stack', 'API Development', 'Database Design'],
      benefits: 'Fully custom solutions built to scale',
    },
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Graphic blobs */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none select-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Title Header Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass px-4 py-2 rounded-full mb-4 animate-pulse-glow-blue border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            What We <span className="gradient-text glow-text">Offer</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive digital solutions tailored to your business needs. From concept to deployment, 
            we handle every aspect of your digital transformation.
          </p>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 perspective-1000">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Start Project CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold rounded-xl animate-pulse-glow-blue border-none"
          >
            Start Your Project
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;