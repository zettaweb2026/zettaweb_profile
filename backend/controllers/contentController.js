const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('../models/contentModels');

const dbFilePath = path.join(__dirname, '../db.json');
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
