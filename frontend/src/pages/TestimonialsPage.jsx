import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, ThumbsUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';
import WhatsAppButton from '../components/WhatsAppButton';

const stats = [
  { icon: Star, value: '4.9★', label: 'Average Rating' },
  { icon: Users, value: '100+', label: 'Happy Clients' },
  { icon: ThumbsUp, value: '98%', label: 'Satisfaction Rate' },
];

const TestimonialsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Client Testimonials | ZettaWeb"
        description="See what our clients say about ZettaWeb. Real reviews from businesses we've helped with web development, AI solutions, and digital transformation."
        keywords="ZettaWeb Reviews, Client Testimonials, Web Development Reviews, Software Company Reviews, Customer Feedback"
        url="https://www.zetta-web.in/testimonials"
      />

      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24">
        {/* ─── Hero Section ─── */}
        <section className="min-h-[52vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-secondary/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block glass px-5 py-2 rounded-full border border-primary/25 animate-pulse-glow-blue mb-6"
            >
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Client Stories
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              Trusted by{' '}
              <span className="gradient-text glow-text">Businesses</span>{' '}
              Worldwide
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12">
              Real feedback from real clients. Discover how we've helped businesses grow,
              innovate, and lead their industries with powerful digital solutions.
            </p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {stats.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex flex-col items-center glass px-8 py-5 rounded-2xl border border-primary/15 min-w-[130px]"
                >
                  <Icon className="w-5 h-5 text-primary mb-2" />
                  <span className="text-3xl font-black gradient-text">{value}</span>
                  <span className="text-xs text-muted-foreground font-semibold mt-1">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Testimonials Carousel (Reused Component) ─── */}
        <Testimonials />

        {/* ─── CTA Section ─── */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-3xl text-center relative z-10"
          >
            <div className="glass p-10 sm:p-16 rounded-3xl border border-primary/15">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Ready to Join Our{' '}
                <span className="gradient-text glow-text">Success Stories?</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Let's create something amazing together. Book a free consultation today.
              </p>
              <button
                onClick={() => navigate('/book-now')}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl text-base shadow-lg animate-pulse-glow-blue transition-all duration-300 border-none cursor-pointer"
              >
                Book a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default TestimonialsPage;
