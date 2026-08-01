const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const applicationController = require('../controllers/applicationController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all students (accessible by University and System Admins)
router.get('/', authenticate, authorizeRoles('ADMIN', 'UNIVERSITY'), studentController.getAllStudents);

// Get authenticated student's applications
router.get('/applications', authenticate, authorizeRoles('STUDENT'), studentController.getStudentApplications);

// Get authenticated student's active internship
router.get('/internship', authenticate, authorizeRoles('STUDENT'), studentController.getActiveInternship);
// Get authenticated student's stats
router.get('/stats', authenticate, authorizeRoles('STUDENT'), studentController.getStudentStats);
router.get('/me/stats', authenticate, authorizeRoles('STUDENT'), studentController.getStudentStats);

// Get authenticated student's interviews
router.get('/interviews', authenticate, authorizeRoles('STUDENT'), applicationController.getInterviews || studentController.getStudentInterviews);

// Saved Jobs endpoints
router.get('/saved-jobs', authenticate, authorizeRoles('STUDENT'), studentController.getSavedJobs);
router.post('/saved-jobs', authenticate, authorizeRoles('STUDENT'), studentController.saveJob);
router.post('/saved-jobs/:internshipId', authenticate, authorizeRoles('STUDENT'), studentController.saveJob);
router.delete('/saved-jobs/:id', authenticate, authorizeRoles('STUDENT'), studentController.removeSavedJob);

// Upload CV (PDF)
router.post('/upload-cv', authenticate, authorizeRoles('STUDENT'), upload.single('file'), studentController.uploadCV);

// Upload profile picture
router.post('/upload-avatar', authenticate, authorizeRoles('STUDENT'), upload.single('file'), studentController.uploadAvatar);

// Get specific student profile
router.get('/:id', authenticate, studentController.getStudentById);

// Update student profile
router.put('/:id', authenticate, studentController.updateStudent);

// Delete student account (System Admins only)
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), studentController.deleteStudent);

module.exports = router;

