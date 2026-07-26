const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Apply to an internship (Students only)
router.post('/', authenticate, authorizeRoles('STUDENT'), applicationController.applyToInternship);

// Get list of applications (accessible to students, recruiters, university, and admins with custom filters)
router.get('/', authenticate, applicationController.getApplications);

// Get application details by ID
router.get('/:id', authenticate, applicationController.getApplicationById);

// Update application status
router.patch('/:id/status', authenticate, applicationController.updateApplicationStatus);

module.exports = router;
