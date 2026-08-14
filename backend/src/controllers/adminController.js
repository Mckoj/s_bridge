const prisma = require('../config/db');
const { createAuditLog, getAuditLogs: fetchAuditLogs } = require('../services/auditService');

const DEFAULT_SETTINGS = {
  registrationOpen: 'true',
  autoApproveRecruiters: 'false',
  requireCvUpload: 'true',
  maxApplicationsPerStudent: '5',
  emailNotifications: 'true',
  systemMaintenance: 'false'
};

async function getAuditLogs(req, res) {
  try {
    const { page, limit, search, query, category, action, startDate, endDate, actorId } = req.query;
    const searchParam = query || search || '';
    const result = await fetchAuditLogs({
      page,
      limit,
      search: searchParam,
      category,
      action,
      startDate,
      endDate,
      actorId
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
}

async function getSystemSettings(req, res) {
  try {
    const dbSettings = await prisma.systemSetting.findMany();
    
    const settingsMap = { ...DEFAULT_SETTINGS };
    dbSettings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    res.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
}

async function updateSystemSettings(req, res) {
  try {
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    const updatedMap = {};

    for (const [key, value] of Object.entries(settings)) {
      const strVal = String(value);
      const updated = await prisma.systemSetting.upsert({
        where: { key },
        update: { value: strVal },
        create: { key, value: strVal }
      });
      updatedMap[updated.key] = updated.value;
    }

    await createAuditLog({
      req,
      action: 'SYSTEM_SETTINGS_UPDATED',
      category: 'SYSTEM',
      target: 'System Settings',
      description: 'Updated global platform configuration settings',
      metadata: updatedMap
    });

    res.json({ success: true, settings: updatedMap, message: 'System settings saved successfully' });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ error: 'Failed to update system settings' });
  }
}

module.exports = {
  getSystemSettings,
  updateSystemSettings,
  getAuditLogs
};
