import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const [activeFilter, setActiveFilter] = useState('All');

  const handleLinkClick = (e, link, label, projectTitle) => {
    e.preventDefault();
    if (!link || link === '#') {
      toast.info(`${label} for "${projectTitle}" is coming soon!`);
    } else {
      window.open(link, '_blank');
    }
  };

  const projects = [
    {
      title: 'E-Commerce Platform',
      category: 'Web',
      description: 'Full-featured online shopping platform with payment integration, inventory management, and admin dashboard.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      demoLink: '#',
      githubLink: '#',
    },
    {
      title: 'AI Chatbot Assistant',
      category: 'AI',
      description: 'Intelligent conversational AI powered by GPT-4, capable of understanding context and providing helpful responses.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      technologies: ['Python', 'OpenAI', 'FastAPI', 'React'],
      demoLink: '#',
      githubLink: '#',
    },
    {
      title: 'Task Automation Suite',
      category: 'Automation',
      description: 'Custom automation tools for business workflows, data processing, and report generation.',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
      technologies: ['Python', 'Selenium', 'Pandas', 'Docker'],
      demoLink: '#',
      githubLink: '#',
    },
    {
      title: 'Healthcare Management App',
      category: 'Web',
      description: 'Patient management system with appointment scheduling, medical records, and telemedicine features.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      technologies: ['Next.js', 'PostgreSQL', 'WebRTC', 'AWS'],
      demoLink: '#',
      githubLink: '#',
    },
    {
      title: 'Real-time Analytics Dashboard',
      category: 'Web',
      description: 'Interactive dashboard with real-time data visualization, custom reports, and predictive analytics.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      technologies: ['React', 'D3.js', 'WebSocket', 'Redis'],
      demoLink: '#',
      githubLink: '#',
    },
    {
      title: 'Image Recognition System',
      category: 'AI',
      description: 'Computer vision solution for object detection, classification, and facial recognition.',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80',
      technologies: ['TensorFlow', 'Python', 'OpenCV', 'Flask'],
      demoLink: '#',
      githubLink: '#',
    },
  ];

  const filters = ['All', 'Web', 'AI', 'Automation'];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section id="projects" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none select-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Title Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass px-4 py-2 rounded-full mb-4 border-primary/20 animate-pulse-glow-blue">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Featured <span className="gradient-text glow-text">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successful projects that showcase our expertise and commitment to excellence.
          </p>
        </motion.div>

        {/* Filter Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter:</span>
          </div>
          
          <div className="flex flex-wrap p-1.5 glass rounded-2xl border border-muted/20">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 rounded-xl ${
                    isActive ? 'text-primary-foreground font-black' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="relative z-10">{filter}</span>
                  {/* Glowing layout slide indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_15px_#3fa7e6] z-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Cards Grid */}
        <motion.div 
          layout 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.45 }}
                className="h-full"
              >
                <Card className="glass-card overflow-hidden h-full flex flex-col justify-between group rounded-3xl border-muted/20 hover:border-primary/30">
                  <div>
                    {/* Project Header Image */}
                    <div className="relative h-52 overflow-hidden select-none">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-95"></div>
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-none font-bold text-[10px] tracking-widest uppercase">
                        {project.category}
                      </Badge>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono font-medium px-2.5 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 pb-6 pt-3 flex gap-3">
                    <Button
                      size="sm"
                      className="flex-grow bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl shadow-md border-none flex items-center justify-center gap-1.5"
                      onClick={(e) => handleLinkClick(e, project.demoLink, 'Interactive demo', project.title)}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-grow glass border-primary/20 hover:bg-primary/5 rounded-xl font-bold flex items-center justify-center gap-1.5"
                      onClick={(e) => handleLinkClick(e, project.githubLink, 'Source code', project.title)}
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;