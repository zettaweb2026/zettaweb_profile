/**
 * app/routes.jsx — Centralized route definitions.
 * All route configuration lives here. App.jsx simply imports and renders this.
 */
import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedAdminRoute } from '../components/common';

// Public pages — lazy loaded for code splitting
const BookNow = lazy(() => import('../pages/public/BookNow'));
const ServicePage = lazy(() => import('../pages/public/ServicePage'));
const ServicesPage = lazy(() => import('../pages/public/ServicesPage'));
const ProjectsPage = lazy(() => import('../pages/public/ProjectsPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const TestimonialsPage = lazy(() => import('../pages/public/TestimonialsPage'));

// Admin pages — lazy loaded
const AdminPanel = lazy(() => import('../pages/admin/AdminPanel'));
const Login = lazy(() => import('../pages/admin/Login'));
const AccessDenied = lazy(() => import('../pages/admin/AccessDenied'));

const AppRoutes = ({ Home }) => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/book-now" element={<BookNow />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/testimonials" element={<TestimonialsPage />} />

    {/* Individual Service Detail Pages */}
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

    {/* Auth Routes — redirect to login page */}
    <Route path="/admin/login" element={<Login />} />
    <Route path="/login" element={<Navigate to="/admin/login" replace />} />
    <Route path="/register" element={<Navigate to="/admin/login" replace />} />
    <Route path="/admin/register" element={<Navigate to="/admin/login" replace />} />
    <Route path="/access-denied" element={<AccessDenied />} />
    <Route path="/forgot-password" element={<Navigate to="/" replace />} />

    {/* Protected Admin Routes */}
    <Route element={<ProtectedAdminRoute />}>
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminPanel />} />
      <Route path="/admin/projects/create" element={<AdminPanel />} />
      <Route path="/admin/projects/update" element={<AdminPanel />} />
      <Route path="/admin/projects/delete" element={<AdminPanel />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
