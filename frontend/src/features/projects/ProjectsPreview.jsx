import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { fallbackProjects } from '../../lib/fallbackData';

/**
 * ProjectsPreview — Lightweight homepage teaser.
 * Shows first 3 projects in a responsive grid + CTA to /projects
 */
export const ProjectsPreview = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch3Projects = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/projects`
        );
        const data = await response.json();
        const list = Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
        setProjects(list.slice(0, 3)); // Only first 3
      } catch {
        setProjects(fallbackProjects.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetch3Projects();
  }, []);

  if (loading || projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4"
        >
          <div>
            <div className="inline-block glass px-4 py-2 rounded-full border-primary/20 animate-pulse-glow-blue mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Featured Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Recent <span className="gradient-text glow-text">Projects</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all duration-300 group flex-shrink-0"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* 3 Project Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              onClick={() => navigate('/projects')}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-none font-bold text-[10px] tracking-widest uppercase">
                  {project.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(project.technologies || []).slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[10px] font-mono px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 glass border border-primary/20 hover:border-primary/50 text-foreground font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 group hover:bg-primary/5"
          >
            See All Projects
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
