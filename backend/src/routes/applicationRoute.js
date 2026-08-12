const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorizeRoles, requireApprovedRecruiter } = require('../middleware/auth');

// Apply to an internship (Students only)
router.post('/', authenticate, authorizeRoles('STUDENT'), applicationController.applyToInternship);

// Get list of applications (accessible to students, recruiters, university, and admins with custom filters)
router.get('/', authenticate, authorizeRoles('STUDENT', 'RECRUITER', 'UNIVERSITY', 'ADMIN'), applicationController.getApplications);

// Get interviews
router.get('/interviews', authenticate, authorizeRoles('STUDENT', 'RECRUITER', 'UNIVERSITY', 'ADMIN'), applicationController.getInterviews);

// Schedule interview
router.post('/interviews', authenticate, authorizeRoles('RECRUITER', 'UNIVERSITY', 'ADMIN'), requireApprovedRecruiter, applicationController.scheduleInterview);
router.post('/:id/interviews', authenticate, authorizeRoles('RECRUITER', 'UNIVERSITY', 'ADMIN'), requireApprovedRecruiter, applicationController.scheduleInterview);

// Get application details by ID
router.get('/:id', authenticate, authorizeRoles('STUDENT', 'RECRUITER', 'UNIVERSITY', 'ADMIN'), applicationController.getApplicationById);

// Update application status
router.patch('/:id/status', authenticate, authorizeRoles('RECRUITER', 'UNIVERSITY', 'ADMIN'), applicationController.updateApplicationStatus);


module.exports = router;

