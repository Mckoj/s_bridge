const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Get all recruiters (Admin & University only)
router.get('/', authenticate, authorizeRoles('ADMIN', 'UNIVERSITY'), recruiterController.getAllRecruiters);

// Get recruiter details by ID
router.get('/:id', authenticate, recruiterController.getRecruiterById);

// Update recruiter details and company profile by ID
router.put('/:id', authenticate, recruiterController.updateRecruiter);

module.exports = router;
