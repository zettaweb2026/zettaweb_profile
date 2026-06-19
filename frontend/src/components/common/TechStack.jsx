import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as SiIcons from 'react-icons/si';
import * as FaIcons from 'react-icons/fa';
import { Code2 } from 'lucide-react';

import { fallbackTechStack } from '../../lib/fallbackData';

// Map technology names to their corresponding brand icons and colors
const iconMap = {
  'React': { Icon: SiIcons.SiReact, color: 'text-[#61DAFB]' },
  'Next.js': { Icon: SiIcons.SiNextdotjs, color: 'text-foreground' },
  'Vue.js': { Icon: SiIcons.SiVuedotjs, color: 'text-[#4FC08D]' },
  'TypeScript': { Icon: SiIcons.SiTypescript, color: 'text-[#3178C6]' },
  'Tailwind CSS': { Icon: SiIcons.SiTailwindcss, color: 'text-[#06B6D4]' },
  'Node.js': { Icon: SiIcons.SiNodedotjs, color: 'text-[#339933]' },
  'Python': { Icon: SiIcons.SiPython, color: 'text-[#3776AB]' },
  'Express': { Icon: SiIcons.SiExpress, color: 'text-foreground/80' },
  'FastAPI': { Icon: SiIcons.SiFastapi, color: 'text-[#009688]' },
  'GraphQL': { Icon: SiIcons.SiGraphql, color: 'text-[#E10098]' },
  'TensorFlow': { Icon: SiIcons.SiTensorflow, color: 'text-[#FF6F00]' },
  'PyTorch': { Icon: SiIcons.SiPytorch, color: 'text-[#EE4C2C]' },
  'OpenAI': { Icon: SiIcons.SiOpenai, color: 'text-[#10A37F]' },
  'Scikit-learn': { Icon: SiIcons.SiScikitlearn, color: 'text-[#F7931E]' },
  'Hugging Face': { Icon: SiIcons.SiHuggingface, color: 'text-[#FFD21E]' },
  'AWS': { Icon: FaIcons.FaAws, color: 'text-[#FF9900]' },
  'Docker': { Icon: SiIcons.SiDocker, color: 'text-[#2496ED]' },
  'Kubernetes': { Icon: SiIcons.SiKubernetes, color: 'text-[#326CE5]' },
  'GitHub Actions': { Icon: SiIcons.SiGithubactions, color: 'text-[#2088FF]' },
  'Linux': { Icon: SiIcons.SiLinux, color: 'text-[#FCC624]' }
};

const TechIcon = ({ name }) => {
  const iconConfig = iconMap[name];
  if (iconConfig) {
    const { Icon, color } = iconConfig;
    return <Icon className={`w-10 h-10 mx-auto ${color} group-hover:scale-110 transition-all duration-300`} />;
  }
  return <Code2 className="w-10 h-10 mx-auto text-primary group-hover:scale-110 transition-all duration-300" />;
};

export const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const [techCategories, setTechCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/techStack`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setTechCategories(data);
        } else {
          setTechCategories(fallbackTechStack);
        }
      } catch (error) {
        console.error('Failed to fetch tech stack, using frontend fallback:', error);
        setTechCategories(fallbackTechStack);
      } finally {
        setLoading(false);
      }
    };
    fetchTechStack();
  }, []);

  if (loading || techCategories.length === 0) return null;

  return (
    <section id="tech-stack" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Visual background layers */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[130px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[110px] pointer-events-none select-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Title Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-left mb-16 max-w-4xl"
        >
          <div className="relative inline-block mb-4">
            <span className="absolute -top-6 left-0 text-xs font-semibold text-primary/45 tracking-wider">03</span>
            <div className="inline-block glass px-4 py-2 rounded-full border-primary/20 animate-pulse-glow-blue">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Technology Stack</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Our Tech <span className="gradient-text glow-text">Arsenal</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            We leverage the latest and most powerful technologies to build robust, 
            scalable, and future-proof solutions.
          </p>
        </motion.div>

        {/* Categories of Stack */}
        <div className="space-y-16">
          {techCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIndex * 0.12 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold flex items-center gap-3 text-center sm:text-left">
                <span className="text-primary font-mono text-xl select-none">//</span> 
                <span className="text-foreground tracking-tight">{category.category}</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: catIndex * 0.1 + techIndex * 0.05 }}
                    className={`glass p-6 rounded-2xl text-center hover:scale-105 border transition-all duration-300 group cursor-pointer ${tech.color}`}
                  >
                    {/* Floating Tech Icon */}
                    <div className="mb-4 h-12 flex items-center justify-center group-hover:rotate-6 transition-all duration-300 select-none">
                      <TechIcon name={tech.name} />
                    </div>
                    <h4 className="font-extrabold text-foreground mb-1 text-sm tracking-wide">
                      {tech.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground group-hover:text-foreground/90 transition-colors">
                      {tech.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creative Code Sandbox Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          {/* Terminal Mockup Header */}
          <div className="w-full glass rounded-t-2xl border-b border-muted/30 px-5 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block"></span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">zettaweb_sandbox.js</span>
            <div className="w-12"></div>
          </div>
          
          {/* Terminal Mockup Body */}
          <div className="w-full glass rounded-b-2xl p-6 font-mono text-sm leading-relaxed border-t-0 shadow-2xl bg-black/60">
            <p className="text-muted-foreground">// Setting up the team core expertise</p>
            <p>
              <span className="text-purple-400">const</span> <span className="text-blue-400">zettawebStack</span> = {'{'}
            </p>
            <p className="pl-4">
              <span className="text-red-400">development</span>: <span className="text-yellow-300">"Modern Web, Android, iOS"</span>,
            </p>
            <p className="pl-4">
              <span className="text-red-400">intelligence</span>: <span className="text-yellow-300">"Custom LLMs & Neural Analytics"</span>,
            </p>
            <p className="pl-4">
              <span className="text-red-400">performance</span>: <span className="text-yellow-300">"60fps Animations & Heavy Optimizations"</span>,
            </p>
            <p className="pl-4">
              <span className="text-red-400">philosophy</span>: <span className="text-yellow-300">"Continuous learning, zero lag"</span>
            </p>
            <p>{'};'}</p>
            <br />
            <p>
              <span className="text-green-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-blue-400">zettawebStack</span>.<span className="text-red-400">philosophy</span>);
            </p>
            <p className="text-yellow-400 font-bold mt-2">&gt; "Continuous learning, zero lag"</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;