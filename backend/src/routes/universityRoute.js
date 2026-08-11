const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Get university dashboard statistics
router.get('/stats', authenticate, authorizeRoles('UNIVERSITY', 'ADMIN'), universityController.getUniversityStats);

// Get university analytics (placement funnel, department breakdown, report compliance)
router.get('/analytics', authenticate, authorizeRoles('UNIVERSITY', 'ADMIN'), universityController.getUniversityAnalytics);

// Approve a recruiter
router.patch('/recruiters/:id/approve', authenticate, authorizeRoles('UNIVERSITY', 'ADMIN'), universityController.approveRecruiter);

// Announcement routes
router.get('/announcements', authenticate, universityController.getUniversityAnnouncements);
router.post('/announcements', authenticate, authorizeRoles('UNIVERSITY', 'ADMIN'), universityController.createAnnouncement);

module.exports = router;

