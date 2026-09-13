const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('../models/contentModels');

const possiblePaths = [
  path.join(__dirname, '../data/db.json'),
  path.join(__dirname, '../db.json')
];
let fallbackDb = {};

for (const p of possiblePaths) {
  try {
    if (fs.existsSync(p)) {
      fallbackDb = JSON.parse(fs.readFileSync(p, 'utf8'));
      break;
    }
  } catch (err) {
    console.warn(`Failed to load fallback ${p}:`, err.message);
  }
}

const getFallbackResource = (resource) => {
  if (Array.isArray(fallbackDb[resource])) {
    return fallbackDb[resource];
  }
  return [];
};

// GET all items of a resource
exports.getAllContent = async (req, res) => {
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
      if (mongoose.connection.readyState !== 1) {
        const connectDb = require('../config/db');
        await connectDb();
      }
      data = await Model.find();
    } catch (queryError) {
      console.warn(`[Content API] Query failed for ${resource}, using fallback:`, queryError.message);
      const fallbackData = getFallbackResource(resource);
      if (fallbackData.length > 0) {
        return res.json(fallbackData);
      }
      throw queryError;
    }

    return res.json(data);
  } catch (error) {
    const fallbackData = getFallbackResource(req.params.resource);
    if (fallbackData.length > 0) {
      return res.json(fallbackData);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST new item to a resource
exports.createContent = async (req, res) => {
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
};

// PUT update an item of a resource
exports.updateContent = async (req, res) => {
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
};

// DELETE an item of a resource
exports.deleteContent = async (req, res) => {
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
};
