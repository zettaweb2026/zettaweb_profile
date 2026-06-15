import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message via backend server');
      }

      setIsSuccess(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Unexpected error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@zetta-web.in',
      link: 'mailto:support@zetta-web.in',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 9674171451',
      link: 'tel:+91 9674171451',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Kolkata, West Bengal',
      link: 'https://www.google.com/maps/place/Kolkata,+West+Bengal/@22.5355649,88.2649518,12z',
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[110px] pointer-events-none select-none"></div>

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
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Let's Build <span className="gradient-text glow-text">Something Amazing</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto items-start">
          {/* Contact Details Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-foreground">Contact Information</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Reach out to us through any of these channels. We're here to translate your software ideas into high-fidelity products.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 glass rounded-2xl hover:border-primary/45 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground mb-0.5">{info.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{info.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Follow Us social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-6"
            >
              <h4 className="font-bold text-sm tracking-wide uppercase text-muted-foreground mb-4">Follow Us</h4>
              <div className="flex gap-3 select-none">
                {['linkedin', 'github', 'twitter', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:border-primary/40 hover:scale-115 transition-all duration-300"
                    aria-label={social}
                  >
                    <span className="text-primary font-black text-xs uppercase">
                      {social.substring(0, 2)}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Input Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass p-6 sm:p-10 rounded-3xl border-muted/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="glass border-muted/30 focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] rounded-xl py-6 bg-background/40 transition-all duration-300"
                    />
                  </div>
                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="glass border-muted/30 focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] rounded-xl py-6 bg-background/40 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="glass border-muted/30 focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] rounded-xl py-6 bg-background/40 transition-all duration-300"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your project or service requirements..."
                    className="glass border-muted/30 focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] rounded-xl bg-background/40 resize-none transition-all duration-300"
                  />
                </div>

                {/* Action button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground px-8 py-6 font-bold rounded-xl shadow-lg border-none animate-pulse-glow-blue"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;