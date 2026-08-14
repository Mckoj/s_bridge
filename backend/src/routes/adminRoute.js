const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// ─── Public ──────────────────────────────────────────────────────────────────
// No authentication required — returns safe aggregated platform stats
router.get('/stats', adminController.getPlatformStats);

// ─── Admin only ───────────────────────────────────────────────────────────────
router.get('/settings', authenticate, authorizeRoles('ADMIN'), adminController.getSystemSettings);
router.put('/settings', authenticate, authorizeRoles('ADMIN'), adminController.updateSystemSettings);
router.get('/audit-logs', authenticate, authorizeRoles('ADMIN'), adminController.getAuditLogs);

// System Analytics Endpoint (Admin only)
router.get('/analytics', authenticate, authorizeRoles('ADMIN'), adminController.getAdminAnalytics);

module.exports = router;
