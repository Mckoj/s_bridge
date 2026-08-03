const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { authenticate, authorizeRoles, requireApprovedRecruiter } = require('../middleware/auth');

// Create internship listing (Recruiters & Admins)
router.post('/', authenticate, authorizeRoles('RECRUITER', 'ADMIN'), requireApprovedRecruiter, internshipController.createInternship);

// Get all internships with search/filters (Authenticated users)
router.get('/', authenticate, internshipController.getAllInternships);

// Get specific internship details by ID
router.get('/:id', authenticate, internshipController.getInternshipById);

// Update internship details (Recruiter owner or Admin)
router.put('/:id', authenticate, authorizeRoles('RECRUITER', 'ADMIN'), requireApprovedRecruiter, internshipController.updateInternship);

// Delete internship (Recruiter owner or Admin)
router.delete('/:id', authenticate, authorizeRoles('RECRUITER', 'ADMIN'), requireApprovedRecruiter, internshipController.deleteInternship);

module.exports = router;
