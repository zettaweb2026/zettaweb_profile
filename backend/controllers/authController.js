const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET || 'change-this-jwt-secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  permissions: user.permissions || [],
  createdAt: user.createdAt,
});

const register = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'admin',
      permissions: permissions || ['projects', 'testimonials', 'services', 'techStack', 'aboutValues', 'aboutTimeline'],
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

const getCurrentUser = (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Protect Super Admin account from deletion
    const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (userToDelete.email.toLowerCase().trim() === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'The Super Admin account cannot be deleted',
      });
    }

    await User.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, permissions } = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'support@zetta-web.in').trim().toLowerCase();
    const isSuperAdminEmail = userToUpdate.email.toLowerCase().trim() === SUPER_ADMIN_EMAIL;

    if (isSuperAdminEmail) {
      if (email && email.toLowerCase().trim() !== SUPER_ADMIN_EMAIL) {
        return res.status(400).json({
          success: false,
          message: 'The Super Admin email address cannot be changed',
        });
      }
      if (role && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'The Super Admin role cannot be changed',
        });
      }
    }

    if (email && email.toLowerCase().trim() !== userToUpdate.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }
    }

    if (name) userToUpdate.name = name.trim();
    if (email && !isSuperAdminEmail) userToUpdate.email = email.toLowerCase().trim();
    if (role && !isSuperAdminEmail) userToUpdate.role = role;
    if (permissions && !isSuperAdminEmail) userToUpdate.permissions = permissions;

    if (password) {
      userToUpdate.password = password;
    }

    await userToUpdate.save();

    return res.json({
      success: true,
      message: 'User updated successfully',
      user: sanitizeUser(userToUpdate),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
