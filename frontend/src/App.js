import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import AccessDenied from './components/AccessDenied';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Login from './components/ui/Login';
import Register from './components/ui/Register';
import './index.css';

const Home = () => (
  <>
    <ParticleBackground />
    <Navbar />
    <main className="relative z-10">
      <Hero />
      <About />
      <Services />
      <TechStack />
      <Projects />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

const App = () => {
  useEffect(() => {
    // Set document title
    document.title = 'Zettaweb - Building Digital Solutions for the Future';
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register" element={<Navigate to="/admin/register" replace />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/projects/create" element={<AdminPanel />} />
            <Route path="/admin/projects/update" element={<AdminPanel />} />
            <Route path="/admin/projects/delete" element={<AdminPanel />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
