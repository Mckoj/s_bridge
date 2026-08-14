const prisma = require('../config/db');

/**
 * Sanitizes metadata objects by removing sensitive credentials, tokens, and keys.
 */
function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return null;
  if (Array.isArray(metadata)) return metadata.map(sanitizeMetadata);

  const sensitiveKeys = ['password', 'passwordhash', 'token', 'jwt', 'secret', 'authorization', 'apikey', 'key'];
  const sanitized = {};

  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(s => lowerKey.includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Safely extracts client IP address from express request headers or socket.
 */
function extractIpAddress(req) {
  if (!req) return null;
  const forwarded = req.headers ? req.headers['x-forwarded-for'] : null;
  if (forwarded) {
    const ips = String(forwarded).split(',');
    return ips[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

/**
 * Safely extracts User-Agent from express request headers.
 */
function extractUserAgent(req) {
  if (!req || !req.headers) return null;
  return req.headers['user-agent'] || null;
}

/**
 * Creates a persisted AuditLog entry in the database.
 * Non-blocking helper: wraps database execution in try/catch to ensure primary HTTP operations never fail.
 */
async function createAuditLog({
  req = null,
  actorId = null,
  action,
  category = 'SYSTEM',
  target = null,
  targetId = null,
  description = null,
  metadata = null,
  ipAddress = null,
  userAgent = null
}) {
  try {
    if (!action) return null;

    const resolvedActorId = actorId || req?.user?.id || null;
    const resolvedIp = ipAddress || extractIpAddress(req);
    const resolvedUa = userAgent || extractUserAgent(req);
    const sanitizedMeta = sanitizeMetadata(metadata);

    const auditRecord = await prisma.auditLog.create({
      data: {
        actorId: resolvedActorId,
        action: String(action).toUpperCase(),
        category: String(category).toUpperCase(),
        target: target ? String(target) : null,
        targetId: targetId ? String(targetId) : null,
        description: description ? String(description) : null,
        metadata: sanitizedMeta || undefined,
        ipAddress: resolvedIp ? String(resolvedIp) : null,
        userAgent: resolvedUa ? String(resolvedUa) : null
      }
    });

    return auditRecord;
  } catch (error) {
    console.error('[AuditService] Failed to persist audit log entry:', error.message);
    return null;
  }
}

/**
 * Retrieves paginated and filtered audit log entries for Admin users.
 */
async function getAuditLogs({
  page = 1,
  limit = 25,
  search = '',
  category = '',
  action = '',
  startDate = '',
  endDate = '',
  actorId = ''
} = {}) {
  try {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (p - 1) * l;

    const where = {};

    if (category && category.toUpperCase() !== 'ALL') {
      where.category = category.toUpperCase();
    }

    if (action) {
      where.action = { contains: action.toUpperCase(), mode: 'insensitive' };
    }

    if (actorId) {
      where.actorId = actorId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        // Include full day if date string like YYYY-MM-DD
        if (endDate.length <= 10) {
          end.setHours(23, 59, 59, 999);
        }
        where.timestamp.lte = end;
      }
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      where.OR = [
        { action: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { target: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { actor: { email: { contains: term, mode: 'insensitive' } } },
        { actor: { student: { firstName: { contains: term, mode: 'insensitive' } } } },
        { actor: { student: { lastName: { contains: term, mode: 'insensitive' } } } },
        { actor: { recruiter: { companyName: { contains: term, mode: 'insensitive' } } } }
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: l,
        orderBy: { timestamp: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              role: true,
              student: { select: { firstName: true, lastName: true } },
              recruiter: { select: { companyName: true } },
              university: { select: { universityName: true } }
            }
          }
        }
      })
    ]);

    const formattedLogs = logs.map(log => {
      const actorName = log.actor
        ? [log.actor.student?.firstName, log.actor.student?.lastName].filter(Boolean).join(' ') ||
          log.actor.recruiter?.companyName ||
          log.actor.university?.universityName ||
          log.actor.email
        : 'System Administrator';

      return {
        id: log.id,
        timestamp: log.timestamp.toISOString(),
        actorId: log.actorId,
        actorName,
        actorEmail: log.actor?.email || null,
        actorRole: log.actor?.role || null,
        action: log.action,
        category: log.category,
        target: log.target,
        targetResource: log.target,
        targetId: log.targetId,
        description: log.description,
        details: log.description,
        status: log.action.includes('FAILED') || log.action.includes('UNAUTHORIZED') ? 'FAILED' : 'SUCCESS',
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        metadata: log.metadata || undefined
      };
    });

    return {
      success: true,
      auditLogs: formattedLogs,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages: Math.ceil(total / l) || 1
      }
    };
  } catch (error) {
    console.error('[AuditService] Failed to retrieve audit logs:', error);
    throw error;
  }
}

module.exports = {
  createAuditLog,
  getAuditLogs,
  sanitizeMetadata
};
