const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { authenticate, authorizeRoles, requireApprovedRecruiter } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all recruiters (Admin & University only)
router.get('/', authenticate, authorizeRoles('ADMIN', 'UNIVERSITY'), recruiterController.getAllRecruiters);

// Get authenticated recruiter's own profile (no raw ID needed)
router.get('/me', authenticate, authorizeRoles('RECRUITER'), recruiterController.getCurrentRecruiterProfile);

// Get recruiter stats
router.get('/stats', authenticate, recruiterController.getRecruiterStats);
router.get('/me/stats', authenticate, recruiterController.getRecruiterStats);

// Upload company logo
router.post('/upload-logo', authenticate, authorizeRoles('RECRUITER'), requireApprovedRecruiter, upload.single('file'), recruiterController.uploadLogo);

// Get recruiter details by ID
router.get('/:id', authenticate, recruiterController.getRecruiterById);

// Update recruiter details and company profile by ID
router.put('/:id', authenticate, recruiterController.updateRecruiter);

module.exports = router;
