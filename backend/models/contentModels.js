const mongoose = require('mongoose');

const toJSONWithId = {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
};

const ProjectSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  image: String,
  technologies: [String],
  demoLink: String,
  githubLink: String,
}, { timestamps: true });
ProjectSchema.set('toJSON', toJSONWithId);

const TestimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  avatar: String,
  rating: Number,
  feedback: String,
}, { timestamps: true });
TestimonialSchema.set('toJSON', toJSONWithId);

const ServiceSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  technologies: [String],
  benefits: String,
}, { timestamps: true });
ServiceSchema.set('toJSON', toJSONWithId);

const TechStackSchema = new mongoose.Schema({
  category: String,
  technologies: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
TechStackSchema.set('toJSON', toJSONWithId);

const AboutValueSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  color: String,
  bgColor: String,
}, { timestamps: true });
AboutValueSchema.set('toJSON', toJSONWithId);

const AboutTimelineSchema = new mongoose.Schema({
  year: String,
  event: String,
  description: String,
}, { timestamps: true });
AboutTimelineSchema.set('toJSON', toJSONWithId);

module.exports = {
  projects: mongoose.models.Project || mongoose.model('Project', ProjectSchema),
  testimonials: mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema),
  services: mongoose.models.Service || mongoose.model('Service', ServiceSchema),
  techStack: mongoose.models.TechStack || mongoose.model('TechStack', TechStackSchema),
  aboutValues: mongoose.models.AboutValue || mongoose.model('AboutValue', AboutValueSchema),
  aboutTimeline: mongoose.models.AboutTimeline || mongoose.model('AboutTimeline', AboutTimelineSchema),
};
