import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MessageSquare, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import Contact from '../components/Contact';
import SEO from '../components/SEO';
import WhatsAppButton from '../components/WhatsAppButton';

const features = [
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'We respond to all inquiries within 24 hours on business days.',
  },
  {
    icon: MessageSquare,
    title: 'Free Consultation',
    description: 'Book a no-obligation discovery call to discuss your project.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Ongoing support and maintenance for all our delivered projects.',
  },
];

const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Contact Us | ZettaWeb"
        description="Get in touch with ZettaWeb. We're ready to discuss your project, answer questions, and help you build your next digital solution."
        keywords="Contact ZettaWeb, Web Development Inquiry, AI Solutions Contact, Software Project Quote, Hire Developers"
        url="https://www.zetta-web.in/contact"
      />

      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-24">
        {/* ─── Hero Section ─── */}
        <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-secondary/6 rounded-full blur-[110px] pointer-events-none" />

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
                Get in Touch
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              Let's Build{' '}
              <span className="gradient-text glow-text">Together</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12">
              Have a project in mind, or just want to chat? We'd love to hear from you.
              Drop us a message and we'll get back to you promptly.
            </p>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
            >
              {features.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="glass p-5 rounded-2xl border border-primary/12 hover:border-primary/35 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Contact Form (Reused Component) ─── */}
        <Contact />

        {/* ─── Quick Action Banner ─── */}
        <section className="py-20 px-4 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-3xl text-center"
          >
            <p className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
              Prefer a direct conversation?
            </p>
            <button
              onClick={() => navigate('/book-now')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl text-base shadow-lg animate-pulse-glow-blue transition-all duration-300 border-none cursor-pointer"
            >
              Book a Free Call
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ContactPage;
