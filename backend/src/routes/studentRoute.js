const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Get all students (accessible by University and System Admins)
router.get('/', authenticate, authorizeRoles('ADMIN', 'UNIVERSITY'), studentController.getAllStudents);

// Get specific student profile
router.get('/:id', authenticate, studentController.getStudentById);

// Update student profile
router.put('/:id', authenticate, studentController.updateStudent);

// Delete student account (System Admins only)
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), studentController.deleteStudent);

module.exports = router;
