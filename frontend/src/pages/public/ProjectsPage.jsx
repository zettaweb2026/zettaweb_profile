import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Award, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ParticleBackground from '../../components/common/ParticleBackground';
import Projects from '../../features/projects/Projects';
import SEO from '../../components/common/SEO';
import WhatsAppButton from '../../components/common/WhatsAppButton';

const stats = [
  { icon: Layers, value: '50+', label: 'Projects Delivered' },
  { icon: Award, value: '100%', label: 'Client Satisfaction' },
  { icon: Rocket, value: '3x', label: 'Faster Time to Market' },
];

const ProjectsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Our Projects | ZettaWeb Portfolio"
        description="Browse ZettaWeb's portfolio of successful web development, AI, and software projects delivered to clients worldwide. Real results, real impact."
        keywords="ZettaWeb Projects, Web Development Portfolio, AI Projects, Software Portfolio, React Projects, Full Stack Development"
        url="https://www.zetta-web.in/projects"
      />

      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24">
        {/* ─── Hero Section ─── */}
        <section className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block glass px-5 py-2 rounded-full border border-primary/25 animate-pulse-glow-blue mb-6"
            >
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Our Portfolio
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              Work That{' '}
              <span className="gradient-text glow-text">Speaks</span> for Itself
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
              Explore the projects we've built — from AI-powered platforms to beautifully
              crafted web applications. Each project is a story of innovation and craft.
            </p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-2"
            >
              {stats.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex flex-col items-center glass px-6 py-4 rounded-2xl border border-primary/15 min-w-[120px]"
                >
                  <Icon className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-black gradient-text">{value}</span>
                  <span className="text-xs text-muted-foreground font-semibold mt-1">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Projects Grid (Reused Component) ─── */}
        <Projects />

        {/* ─── Start a Project CTA ─── */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-4xl text-center relative z-10"
          >
            <div className="glass p-10 sm:p-16 rounded-3xl border border-primary/15">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Want Us to Build Your{' '}
                <span className="gradient-text glow-text">Next Project?</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join our growing list of satisfied clients and bring your idea to life.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/book-now')}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl text-base shadow-lg animate-pulse-glow-blue transition-all duration-300 border-none cursor-pointer"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 glass border border-primary/20 hover:border-primary/50 text-foreground font-bold px-8 py-4 rounded-xl text-base transition-all duration-300 cursor-pointer"
                >
                  View Our Services
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ProjectsPage;
