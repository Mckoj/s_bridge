const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// System Settings Endpoints (Admin only)
router.get('/settings', authenticate, authorizeRoles('ADMIN'), adminController.getSystemSettings);
router.put('/settings', authenticate, authorizeRoles('ADMIN'), adminController.updateSystemSettings);

// System Audit Trail Endpoint (Admin only)
router.get('/audit-logs', authenticate, authorizeRoles('ADMIN'), adminController.getAuditLogs);

module.exports = router;
