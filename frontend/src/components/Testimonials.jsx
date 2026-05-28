import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

export const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      avatar: 'SJ',
      rating: 5,
      feedback:
        'Zettaweb transformed our digital presence completely. Their team delivered a stunning website that increased our conversions by 250%. Professional, creative, and always on time!',
    },
    {
      name: 'Michael Chen',
      role: 'CTO, DataFlow Systems',
      avatar: 'MC',
      rating: 5,
      feedback:
        'Working with Zettaweb on our AI project was exceptional. They understood our complex requirements and delivered a solution that exceeded expectations. Highly recommended!',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, HealthCare Plus',
      avatar: 'ER',
      rating: 5,
      feedback:
        'The mobile app Zettaweb built for us is incredible. Our patients love the interface, and the backend is rock solid. They truly care about their clients\' success.',
    },
    {
      name: 'David Park',
      role: 'Director, FinTech Solutions',
      avatar: 'DP',
      rating: 5,
      feedback:
        'Security was our top priority, and Zettaweb delivered. Their expertise in cybersecurity and cloud infrastructure gave us peace of mind. Outstanding work!',
    },
    {
      name: 'Lisa Anderson',
      role: 'Marketing Head, EcomGrowth',
      avatar: 'LA',
      rating: 5,
      feedback:
        'From concept to launch, Zettaweb was with us every step. The e-commerce platform they built is fast, beautiful, and drives sales. Best investment we made!',
    },
  ];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const indices = [
      currentIndex,
      (currentIndex + 1) % testimonials.length,
      (currentIndex + 2) % testimonials.length,
    ];
    return indices.map((idx) => testimonials[idx]);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none select-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none select-none"></div>

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
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            What Our <span className="gradient-text glow-text">Clients Say</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
          </p>
        </motion.div>

        {/* Carousel Content Container */}
        <div className="relative min-h-[380px] sm:min-h-[320px] mb-8 overflow-hidden px-2">
          {/* Desktop View - Shows 3 Cards with Slider Entry */}
          <div className="hidden lg:grid grid-cols-3 gap-8 h-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.name}-${currentIndex}-${index}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="h-full"
                >
                  <Card className="glass p-8 h-full flex flex-col justify-between rounded-3xl border-muted/20 hover:border-primary/20 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
                    <Quote className="w-10 h-10 text-primary/10 absolute -top-1 right-3 group-hover:text-primary/20 transition-colors select-none" />
                    
                    <div className="space-y-4">
                      <div className="flex gap-1 select-none">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
                        "{testimonial.feedback}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 pt-6 border-t border-muted/20 mt-4 select-none">
                      <Avatar className="w-12 h-12 bg-primary/10 border border-primary/20">
                        <AvatarFallback className="text-primary font-black text-sm">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-extrabold text-foreground text-sm tracking-wide">{testimonial.name}</h4>
                        <p className="text-[11px] text-muted-foreground font-semibold">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile View - Shows 1 Card */}
          <div className="lg:hidden h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={`mobile-${currentIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-md h-full"
              >
                <Card className="glass p-6 rounded-3xl border-muted/20 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
                  <Quote className="w-10 h-10 text-primary/10 absolute -top-1 right-3 select-none" />
                  
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                      "{testimonials[currentIndex].feedback}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t border-muted/20 mt-4">
                    <Avatar className="w-11 h-11 bg-primary/10 border border-primary/20">
                      <AvatarFallback className="text-primary font-bold text-xs">
                        {testimonials[currentIndex].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{testimonials[currentIndex].name}</h4>
                      <p className="text-[10px] text-muted-foreground">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel controls bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="glass border-primary/20 hover:bg-primary/5 rounded-xl"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-1.5 select-none">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-primary/20 hover:bg-primary/45'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="glass border-primary/20 hover:bg-primary/5 rounded-xl"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;