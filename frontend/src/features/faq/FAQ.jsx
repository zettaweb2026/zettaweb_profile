import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

const faqs = [
  {
    question: "What services does ZettaWeb provide?",
    answer: "ZettaWeb provides comprehensive digital solutions including web development, AI & ML solutions, cloud technologies architectures, and custom software development tailored to your business needs."
  },
  {
    question: "How do I get started with ZettaWeb?",
    answer: "You can easily get started by using our 'Book Now' feature or contacting us through the form below. We'll set up an initial consultation to understand your requirements."
  },
  {
    question: "Do you offer post-launch support and maintenance?",
    answer: "Yes, we provide ongoing support, maintenance, and cloud management services to ensure your digital products remain secure, updated, and highly performant."
  },
  {
    question: "How long does it take to develop a custom web application?",
    answer: "The timeline depends on the project's complexity and scope. A standard web portal might take 4-8 weeks, while complex AI-integrated platforms can take several months. We provide detailed timelines during the scoping phase."
  }
];

export const FAQ = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="faq" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-4">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary/45 tracking-wider">07</span>
            <div className="inline-block glass px-4 py-2 rounded-full border-primary/20 animate-pulse-glow-blue">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">FAQ</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Frequently Asked <span className="gradient-text glow-text">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Find answers to common questions about our services, process, and technical capabilities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass rounded-xl px-6 border-primary/20">
                <AccordionTrigger className="text-left text-lg font-semibold py-4 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
