const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 's_bridge_super_secret_jwt_key_change_in_production';

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        student: {
          include: {
            skills: {
              include: { skill: true }
            }
          }
        },
        recruiter: true,
        university: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(500).json({ error: 'Internal server error in auth' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next();
  };
}

/**
 * Middleware that ensures the authenticated user is a RECRUITER whose
 * account has been approved by the university.
 * Use AFTER authenticate() on routes that mutate recruiter-owned resources
 * (e.g. creating internships, updating application statuses, scheduling interviews).
 */
function requireApprovedRecruiter(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  if (req.user.role !== 'RECRUITER') {
    // Non-recruiter roles (ADMIN, UNIVERSITY) are not subject to this gate
    return next();
  }

  if (!req.user.recruiter) {
    return res.status(403).json({ error: 'Recruiter profile not found' });
  }

  if (!req.user.recruiter.isApproved) {
    return res.status(403).json({
      error: 'Your recruiter account is pending approval by the university. Please wait for verification before performing this action.'
    });
  }

  next();
}

module.exports = {
  authenticate,
  authorizeRoles,
  requireApprovedRecruiter
};
