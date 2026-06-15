import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  Mail, 
  Phone, 
  Send, 
  User, 
  CheckCircle2, 
  Loader2, 
  Building 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import SEO from './SEO';

export const BookNow = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Web Development',
    budget: '',
    timeline: '',
    requirements: ''
  });

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
          type: 'booking',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.requirements,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send booking request via backend server');
      }

      setIsSuccess(true);
      toast.success('Booking request submitted successfully! We will get in touch with you shortly.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Web Development',
        budget: '',
        timeline: '',
        requirements: ''
      });

      // Redirect back home after a short delay
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/', { replace: true });
      }, 3500);

    } catch (error) {
      console.error('Unexpected booking submission error:', error);
      toast.error('Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    'Web Development',
    'App Development',
    'AI / ML Solutions',
    'Automation Tools',
    'Cloud & DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Custom Software'
  ];

  const inputStyle = "glass border-muted/30 focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] rounded-xl py-6 bg-background/40 transition-all duration-300";

  return (
    <>
      <SEO 
        title="Book a Consultation"
        description="Book a project consultation with Zettaweb. We are ready to take your digital product to the next level."
        url="https://www.zetta-web.in/book-now"
      />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground">
        {/* Ambient background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.12),transparent_35%)] pointer-events-none select-none" />

      <section className="relative z-10 w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/logo.png" alt="Zettaweb Logo" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-xl font-black gradient-text glow-text">Zettaweb</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card rounded-3xl border-primary/10 p-2 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <CardHeader className="space-y-3 text-center sm:text-left border-b border-white/5 pb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Book a <span className="gradient-text glow-text">Project Consultation</span>
              </h1>
              <CardDescription className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Ready to take your digital product to the next level? Fill out the booking request details below, 
                and our specialized solutions architects will evaluate your project details.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address *</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        required
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                    <div className="relative">
                      <Building className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company Ltd."
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Service Required */}
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Required *</Label>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/40 border border-muted/30 focus:outline-none focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] text-foreground text-sm h-12 transition-all appearance-none cursor-pointer"
                      >
                        {services.map((svc) => (
                          <option key={svc} value={svc} className="bg-background text-foreground">{svc}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">&#9662;</div>
                    </div>
                  </div>

                  {/* Project Budget */}
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Budget</Label>
                    <div className="relative">
                      <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="budget"
                        name="budget"
                        type="text"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g. $5,000 or Negotiable"
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Project Timeline */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="timeline" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Desired Timeline</Label>
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="timeline"
                        name="timeline"
                        type="text"
                        value={formData.timeline}
                        onChange={handleChange}
                        placeholder="e.g. 2 months or Urgent"
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Project Scope/Requirements */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="requirements" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Details & Requirements</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Please outline the key features, goals, and description of your project..."
                      className="glass border-muted/30 focus:border-primary/70 focus:ring-0 focus:shadow-[0_0_15px_rgba(63,167,230,0.25)] rounded-xl bg-background/40 resize-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Submit and CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5 mt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="flex-grow bg-primary hover:bg-primary/95 text-primary-foreground py-6 rounded-xl font-bold border-none animate-pulse-glow-blue flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting Booking...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Submitted Successfully!
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Request Free Consultation
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="glass border-primary/20 hover:bg-primary/5 rounded-xl py-6 px-6 font-bold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
      </main>
    </>
  );
};

export default BookNow;
