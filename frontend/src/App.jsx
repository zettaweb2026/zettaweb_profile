import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import SectionDivider from './components/SectionDivider';
import ServicesPreview from './components/ServicesPreview';
import ProjectsPreview from './components/ProjectsPreview';
import TestimonialsPreview from './components/TestimonialsPreview';
import ContactPreview from './components/ContactPreview';
import TechStack from './components/TechStack';
import WhyChooseUs from './components/WhyChooseUs';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import SEO from './components/SEO';
import { organizationSchema, localBusinessSchema, serviceSchema, faqSchema } from './lib/schemas';
import './index.css';

// Lazy load pages for code splitting & speed optimization
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const BookNow = lazy(() => import('./pages/BookNow'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AccessDenied = lazy(() => import('./pages/AccessDenied'));
// Dedicated content pages
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">Loading Zettaweb...</p>
    </div>
  </div>
);

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

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
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

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen bg-background text-foreground">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/services/web-development" element={
            <ServicePage 
              title="Web Development Services" 
              heading="Premium Web Development"
              slug="web-development"
              description="Custom web applications, responsive websites, and highly optimized frontend portals using React, Next.js, and modern tech stacks."
              keywords="Web Development, React, Next.js, Custom Websites, Responsive Design, Frontend Portals"
              content={<><h2 className="text-2xl font-bold text-foreground">Custom Web Solutions</h2><p>We build highly performant, scalable, and responsive web applications tailored to your business goals. Our web development process focuses on rich user experiences, fast load times, and robust architectures.</p></>}
            />
          } />
          <Route path="/services/ai-solutions" element={
            <ServicePage 
              title="AI & ML Solutions" 
              heading="Advanced AI Solutions"
              slug="ai-solutions"
              description="Integrate cutting-edge Artificial Intelligence and Machine Learning models into your business workflows for automation and predictive insights."
              keywords="AI Solutions, Machine Learning, Automation, Predictive Analytics, NLP, Computer Vision"
              content={<><h2 className="text-2xl font-bold text-foreground">Intelligent Automation</h2><p>Leverage the power of custom LLMs, neural classification, and forecasting. We specialize in building AI tools that enhance decision-making and operational efficiency.</p></>}
            />
          } />
          <Route path="/services/cloud-services" element={
            <ServicePage 
              title="Cloud Services & DevOps" 
              heading="Scalable Cloud Services"
              slug="cloud-services"
              description="Secure, automated, and auto-scaling CI/CD deployments on AWS, Google Cloud, and Azure."
              keywords="Cloud Services, AWS, DevOps, CI/CD, Docker, Kubernetes, Serverless"
              content={<><h2 className="text-2xl font-bold text-foreground">Cloud Architecture</h2><p>We provide comprehensive cloud migration, infrastructure management, and DevOps pipelines to ensure your applications run smoothly and scale effortlessly on demand.</p></>}
            />
          } />
          <Route path="/services/software-development" element={
            <ServicePage 
              title="Custom Software Development" 
              heading="Custom Software Development"
              slug="software-development"
              description="End-to-end software development services from MVP creation to full-scale enterprise products."
              keywords="Software Development, Custom Software, Enterprise Solutions, Full-stack Development, Tech Startup"
              content={<><h2 className="text-2xl font-bold text-foreground">Enterprise Software</h2><p>Our experienced engineers build robust, scalable, and secure software applications. We handle everything from backend architecture and API design to seamless frontend integrations.</p></>}
            />
          } />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/register" element={<Navigate to="/admin/login" replace />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/forgot-password" element={<Navigate to="/" replace />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/projects/create" element={<AdminPanel />} />
            <Route path="/admin/projects/update" element={<AdminPanel />} />
            <Route path="/admin/projects/delete" element={<AdminPanel />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
