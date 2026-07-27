const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Submit a weekly report (Students only)
router.post('/', authenticate, authorizeRoles('STUDENT'), reportController.submitReport);

// Get list of reports (Students view own, University/Supervisors view assigned)
router.get('/', authenticate, reportController.getReports);

// Get report details by ID
router.get('/:id', authenticate, reportController.getReportById);

// Update report status (University, Recruiter/Supervisor, Admin)
router.patch('/:id/status', authenticate, authorizeRoles('UNIVERSITY', 'RECRUITER', 'ADMIN'), reportController.updateReportStatus);

module.exports = router;
