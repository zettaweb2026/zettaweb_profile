require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Models = require('./models/contentModels');
const { authenticateUser, authorizeAdmin } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = Models[resource];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    const data = await Model.find();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post('/api/:resource', authenticateUser, authorizeAdmin, async (req, res) => {
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

app.put('/api/:resource/:id', authenticateUser, authorizeAdmin, async (req, res) => {
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

app.delete('/api/:resource/:id', authenticateUser, authorizeAdmin, async (req, res) => {
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

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
