const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Get all students (accessible by University and System Admins)
router.get('/', authenticate, authorizeRoles('ADMIN', 'UNIVERSITY'), studentController.getAllStudents);

// Get authenticated student's applications
router.get('/applications', authenticate, authorizeRoles('STUDENT'), studentController.getStudentApplications);

// Get authenticated student's active internship
router.get('/internship', authenticate, authorizeRoles('STUDENT'), studentController.getActiveInternship);
// Get authenticated student's stats
router.get('/stats', authenticate, authorizeRoles('STUDENT'), studentController.getStudentStats);
router.get('/me/stats', authenticate, authorizeRoles('STUDENT'), studentController.getStudentStats);

// Get specific student profile
router.get('/:id', authenticate, studentController.getStudentById);

// Update student profile
router.put('/:id', authenticate, studentController.updateStudent);

// Delete student account (System Admins only)
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), studentController.deleteStudent);

module.exports = router;
