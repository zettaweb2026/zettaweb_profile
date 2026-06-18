require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize MongoDB Connection Cache
const connectDb = require('./config/db');
connectDb()
  .then(() => console.log('MongoDB database initialization completed.'))
  .catch((err) => console.error('MongoDB database initialization failed:', err.message));

const app = express();

app.use(cors());
app.use(express.json());

// Database connection middleware for API routes
const dbMiddleware = require('./middleware/dbMiddleware');
app.use('/api', dbMiddleware);

// Selective Cache-Control to prevent caching on dynamic auth/dashboard endpoints
app.use(['/api/auth', '/api/admin', '/api/clients', '/api/upload'], (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Import Modular Routers
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contentRoutes = require('./routes/contentRoutes');
const emailRoutes = require('./routes/emailRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/send-email', emailRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', contentRoutes); // Matches /api/:resource and /api/:resource/:id

// Utility Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.send('Zetta Web API is running'));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
