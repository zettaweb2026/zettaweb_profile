import React from 'react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ParticleBackground from '../../components/common/ParticleBackground';
import { serviceSchema, breadcrumbSchema } from '../../lib/schemas';
import { Link } from 'react-router-dom';

const ServicePage = ({ title, heading, description, keywords, slug, content }) => {
  const url = `https://www.zetta-web.in/services/${slug}`;

  const breadcrumbs = [
    { name: "Home", url: "https://www.zetta-web.in/" },
    { name: "Services", url: "https://www.zetta-web.in/#services" },
    { name: title, url: url }
  ];

  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
        url={url}
        schema={[serviceSchema, breadcrumbSchema(breadcrumbs)]}
      />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block glass px-4 py-2 rounded-full mb-6 border-primary/20">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Our Services</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              {heading.split(' ').map((word, i, arr) => 
                i === arr.length - 1 ? <span key={i} className="gradient-text glow-text">{word}</span> : <span key={i}>{word} </span>
              )}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
              {description}
            </p>
            
            <div className="glass p-8 md:p-12 rounded-3xl border-primary/20 space-y-6 text-muted-foreground leading-relaxed">
              {content}
            </div>

            <div className="mt-12 text-center">
              <Link to="/" className="inline-flex items-center text-primary hover:underline font-semibold">
                ← Back to Home Page
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServicePage;
