const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Get university dashboard statistics
router.get('/stats', authenticate, authorizeRoles('UNIVERSITY', 'ADMIN'), universityController.getUniversityStats);

// Approve a recruiter
router.patch('/recruiters/:id/approve', authenticate, authorizeRoles('UNIVERSITY', 'ADMIN'), universityController.approveRecruiter);

module.exports = router;
