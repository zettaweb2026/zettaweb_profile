require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas
const ProjectSchema = new mongoose.Schema({
  title: String, category: String, description: String, image: String,
  technologies: [String], demoLink: String, githubLink: String
}, { timestamps: true });
// Add a transformation so _id maps to id for the frontend
ProjectSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; } });

const TestimonialSchema = new mongoose.Schema({
  name: String, role: String, avatar: String, rating: Number, feedback: String
}, { timestamps: true });
TestimonialSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; } });

const ServiceSchema = new mongoose.Schema({
  icon: String, title: String, description: String, technologies: [String], benefits: String
}, { timestamps: true });
ServiceSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; } });

const TechStackSchema = new mongoose.Schema({
  category: String, technologies: mongoose.Schema.Types.Mixed
}, { timestamps: true });
TechStackSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; } });

const AboutValueSchema = new mongoose.Schema({
  icon: String, title: String, description: String, color: String, bgColor: String
}, { timestamps: true });
AboutValueSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; } });

const AboutTimelineSchema = new mongoose.Schema({
  year: String, event: String, description: String
}, { timestamps: true });
AboutTimelineSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; } });

const Models = {
  projects: mongoose.model('Project', ProjectSchema),
  testimonials: mongoose.model('Testimonial', TestimonialSchema),
  services: mongoose.model('Service', ServiceSchema),
  techStack: mongoose.model('TechStack', TechStackSchema),
  aboutValues: mongoose.model('AboutValue', AboutValueSchema),
  aboutTimeline: mongoose.model('AboutTimeline', AboutTimelineSchema)
};

// GET all
app.get('/api/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = Models[resource];
    if (!Model) return res.status(404).json({ error: 'Resource not found' });
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new
app.post('/api/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = Models[resource];
    if (!Model) return res.status(404).json({ error: 'Resource not found' });
    
    const newItem = new Model(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update
app.put('/api/:resource/:id', async (req, res) => {
  try {
    const { resource, id } = req.params;
    const Model = Models[resource];
    if (!Model) return res.status(404).json({ error: 'Resource not found' });
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const updatedItem = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/api/:resource/:id', async (req, res) => {
  try {
    const { resource, id } = req.params;
    const Model = Models[resource];
    if (!Model) return res.status(404).json({ error: 'Resource not found' });
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deletedItem = await Model.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET health (useful for vercel)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
