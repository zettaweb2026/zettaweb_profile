/**
 * app/App.jsx — Application root.
 * Wires together the Router, Suspense boundary, Home page, and all routes.
 * Route definitions live in app/routes.jsx (same directory).
 */
import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Layout
import { Navbar, Footer } from '../components/layout';

// Common
import { ParticleBackground, WhatsAppButton, SEO, SectionDivider, TechStack } from '../components/common';

// Features — eager loaded for the home page
import { Hero, WhyChooseUs } from '../features/home';
import { ServicesPreview } from '../features/services';
import { ProjectsPreview } from '../features/projects';
import { TestimonialsPreview } from '../features/testimonials';
import { ContactPreview } from '../features/contact';
import { About } from '../features/about';
import { FAQ } from '../features/faq';

// SEO schemas
import { organizationSchema, localBusinessSchema, serviceSchema, faqSchema } from '../lib/schemas';

// Global styles
import '../index.css';

// Routes (same app/ directory)
import AppRoutes from './routes';

// ─── Loading Spinner ─────────────────────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">Loading Zettaweb...</p>
    </div>
  </div>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <SEO
        title="AI Solutions, Web Development & Cloud Technologies"
        description="ZettaWeb is a top software development company providing premium web development, AI solutions, and cloud services for modern businesses."
        keywords="AI Solutions, Web Development, Cloud Technologies, Software Development Company, Tech Startup"
        url="https://www.zetta-web.in/"
        schema={[organizationSchema, localBusinessSchema, serviceSchema, faqSchema]}
      />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <SectionDivider />
        <ServicesPreview />
        <SectionDivider />
        <ProjectsPreview />
        <SectionDivider />
        <WhyChooseUs />
        <SectionDivider />
        <TechStack />
        <SectionDivider />
        <About />
        <SectionDivider />
        <TestimonialsPreview />
        <SectionDivider />
        <FAQ />
        <SectionDivider />
        <ContactPreview />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
const App = () => (
  <Router>
    <div className="relative min-h-screen bg-background text-foreground">
      <Suspense fallback={<LoadingSpinner />}>
        <AppRoutes Home={Home} />
      </Suspense>
    </div>
  </Router>
);

export default App;
