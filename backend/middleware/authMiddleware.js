const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

const authenticateUser = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-jwt-secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'support@zetta-web.in').trim().toLowerCase();
    const isSuperAdmin = user.email.toLowerCase().trim() === SUPER_ADMIN_EMAIL;

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: isSuperAdmin ? 'admin' : user.role,
      permissions: isSuperAdmin ? ['projects', 'testimonials', 'services', 'techStack', 'aboutValues', 'aboutTimeline'] : (user.permissions || []),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied',
    });
  }

  next();
};

const authorizeSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied',
    });
  }

  const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'support@zetta-web.in').trim().toLowerCase();
  if (req.user.email.toLowerCase().trim() !== SUPER_ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Super Admin only',
    });
  }

  next();
};

const authorizeResource = (resourceParamName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied',
      });
    }

    const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'support@zetta-web.in').trim().toLowerCase();
    const isSuperAdmin = req.user.email.toLowerCase().trim() === SUPER_ADMIN_EMAIL;

    if (isSuperAdmin) {
      return next();
    }

    const resource = req.params[resourceParamName];
    const userPermissions = req.user.permissions || [];

    if (!userPermissions.includes(resource)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied: You do not have permission to manage ${resource}`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeAdmin,
  authorizeSuperAdmin,
  authorizeResource,
};
