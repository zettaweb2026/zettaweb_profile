require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');
const Models = require('./models/contentModels');
const { authenticateUser, authorizeAdmin, authorizeResource } = require('./middleware/authMiddleware');

const app = express();

const dbFilePath = path.join(__dirname, 'db.json');
let fallbackDb = {};

try {
  if (fs.existsSync(dbFilePath)) {
    fallbackDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  }
} catch (err) {
  console.warn('Failed to load fallback db.json:', err.message);
}

const getFallbackResource = (resource) => {
  if (Array.isArray(fallbackDb[resource])) {
    return fallbackDb[resource];
  }
  return [];
};

app.use(cors());
app.use(express.json());

// Transporter cache & pool configuration
let transporterInstance = null;
const getTransporter = () => {
  if (transporterInstance) return transporterInstance;

  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (hasSmtpConfig) {
    const nodemailer = require('nodemailer');
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      pool: true, // Enable connection pooling
      maxConnections: 3,
      maxMessages: 100,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporterInstance;
};

// Rate limiter for email endpoint (max 5 requests per 15 minutes per IP)
const rateLimit = require('express-rate-limit');
const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many email requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

let cachedDb = null;

const connectDb = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    if (!cachedDb) {
      cachedDb = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa');
    }

    await cachedDb;
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    next();
  }
};

app.use('/api', connectDb);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/send-email', emailRateLimiter, async (req, res) => {
  try {
    let { type, name, email, phone, company, service, budget, timeline, message } = req.body;

    // Input sanitization & normalization
    name = (name || '').trim();
    email = (email || '').trim().toLowerCase();
    phone = (phone || '').trim();
    company = (company || '').trim();
    service = (service || '').trim();
    budget = (budget || '').trim();
    timeline = (timeline || '').trim();
    message = (message || '').trim();

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const emailTo = process.env.EMAIL_TO || 'support@zetta-web.in';
    let subject = '';
    let html = '';

    if (type === 'booking') {
      subject = `New Booking Request from ${name}`;
      html = `
        <h2>New Project Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Required:</strong> ${service || 'N/A'}</p>
        <p><strong>Estimated Budget:</strong> ${budget || 'N/A'}</p>
        <p><strong>Desired Timeline:</strong> ${timeline || 'N/A'}</p>
        <p><strong>Project Details:</strong></p>
        <p>${message || 'N/A'}</p>
      `;
    } else {
      subject = `New Contact Form Message from ${name}`;
      html = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'N/A'}</p>
      `;
    }

    const transporter = getTransporter();

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_USER}>`,
          replyTo: email,
          to: emailTo,
          subject: subject,
          html: html,
        });

        console.log(`Email successfully sent via SMTP to ${emailTo}`);
        return res.json({ success: true, message: 'Email sent successfully' });
      } catch (smtpError) {
        console.error('SMTP sending failed, falling back to console log:', smtpError.message);
      }
    }

    // Fallback console log for local development
    console.log('--- DEVELOPMENT EMAIL LOG ---');
    console.log(`To: ${emailTo}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]*>/g, '').trim()}`);
    console.log('------------------------------');

    return res.json({
      success: true,
      message: 'Email logged to server console (SMTP not configured or failed)',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = Models[resource];

    if (!Model) {
      const fallbackData = getFallbackResource(resource);
      if (fallbackData.length > 0) {
        return res.json(fallbackData);
      }
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    let data = [];
    try {
      if (mongoose.connection.readyState === 1) {
        data = await Model.find();
      } else {
        const fallbackData = getFallbackResource(resource);
        if (fallbackData.length > 0) {
          return res.json(fallbackData);
        }
        return res.status(503).json({
          success: false,
          message: 'Database offline and no fallback available',
        });
      }
    } catch (queryError) {
      const fallbackData = getFallbackResource(resource);
      if (fallbackData.length > 0) {
        return res.json(fallbackData);
      }
      throw queryError;
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
    res.send("Zetta Web API is running");
});

// POST new
app.post('/api/:resource', authenticateUser, authorizeResource('resource'), async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = Models[resource];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    const newItem = new Model(req.body);
    await newItem.save();

    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put('/api/:resource/:id', authenticateUser, authorizeResource('resource'), async (req, res) => {
  try {
    const { resource, id } = req.params;
    const Model = Models[resource];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
    }

    const updatedItem = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    return res.json(updatedItem);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete('/api/:resource/:id', authenticateUser, authorizeResource('resource'), async (req, res) => {
  try {
    const { resource, id } = req.params;
    const Model = Models[resource];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
    }

    const deletedItem = await Model.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    return res.json({
      success: true,
      message: 'Deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
