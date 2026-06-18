import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Code2, Cloud, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import Services from '../components/Services';
import SEO from '../components/SEO';
import WhatsAppButton from '../components/WhatsAppButton';

const serviceHighlights = [
  { icon: Code2, label: 'Web & App Development' },
  { icon: BrainCircuit, label: 'AI & ML Solutions' },
  { icon: Cloud, label: 'Cloud & DevOps' },
  { icon: Zap, label: 'Custom Software' },
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Our Services | ZettaWeb — Web Development, AI & Cloud"
        description="Explore ZettaWeb's comprehensive service offerings — web development, AI solutions, cloud infrastructure, and custom software tailored for modern businesses."
        keywords="Web Development Services, AI Solutions, Cloud Services, Custom Software, Machine Learning, React, Next.js"
        url="https://www.zetta-web.in/services"
      />

      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24">
        {/* ─── Hero Section ─── */}
        <section className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/6 rounded-full blur-[120px] pointer-events-none" />

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
                What We Offer
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              Premium{' '}
              <span className="gradient-text glow-text">Digital Services</span>
              <br />
              Built to Scale
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              From cutting-edge AI integrations to beautiful, performant web applications —
              we deliver end-to-end solutions that transform your business vision into reality.
            </p>

            {/* Service highlights row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-10"
            >
              {serviceHighlights.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl border border-primary/15 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-300"
                >
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-semibold">{label}</span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              onClick={() => navigate('/book-now')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl text-base shadow-lg animate-pulse-glow-blue transition-all duration-300 border-none cursor-pointer"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>

        {/* ─── Services Grid (Reused Component) ─── */}
        <Services />

        {/* ─── Bottom CTA Banner ─── */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-4xl text-center relative z-10"
          >
            <div className="glass p-10 sm:p-16 rounded-3xl border border-primary/15">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
                Ready to Build Something{' '}
                <span className="gradient-text glow-text">Extraordinary?</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Let's discuss your project requirements. Our team is ready to craft your
                perfect digital solution.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/book-now')}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl text-base shadow-lg animate-pulse-glow-blue transition-all duration-300 border-none cursor-pointer"
                >
                  Book a Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 glass border border-primary/20 hover:border-primary/50 text-foreground font-bold px-8 py-4 rounded-xl text-base transition-all duration-300 cursor-pointer"
                >
                  Contact Us
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

export default ServicesPage;
