const prisma = require('../config/db');
const { createAuditLog } = require('../services/auditService');

async function submitReport(req, res) {
  try {
    const student = req.user.student;
    if (!student) {
      return res.status(403).json({ error: 'Only registered students can submit logbooks' });
    }

    const { internshipId, title, content, fileUrl, weekNumber } = req.body;

    let targetInternshipId = internshipId;

    // If internshipId was not explicitly passed, find student's active/accepted placement
    if (!targetInternshipId) {
      const activeApp = await prisma.application.findFirst({
        where: {
          studentId: student.id,
          status: 'ACCEPTED'
        }
      });

      if (!activeApp) {
        return res.status(400).json({ error: 'No active accepted internship found for student' });
      }

      targetInternshipId = activeApp.internshipId;
    }

    const reportTitle = title || (weekNumber ? `Week ${weekNumber} Progress Report` : 'Weekly Progress Logbook');

    const report = await prisma.report.create({
      data: {
        studentId: student.id,
        internshipId: targetInternshipId,
        title: reportTitle,
        fileUrl: fileUrl || '',
        comment: content || null,
        status: 'PENDING'
      },
      include: {
        internship: {
          select: { title: true, recruiter: { select: { companyName: true } } }
        }
      }
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit weekly report' });
  }
}

async function getReports(req, res) {
  try {
    const { role } = req.user;
    const { page, limit, status, studentId } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    let whereClause = {};

    if (role === 'STUDENT') {
      whereClause.studentId = req.user.student?.id || 'none';
    } else if (role === 'RECRUITER' && req.user.recruiter?.id) {
      whereClause.internship = { recruiterId: req.user.recruiter.id };
      if (studentId) whereClause.studentId = studentId;
    } else if (role === 'UNIVERSITY') {
      const universityId = req.user.universityId || req.user.university?.id;
      if (!universityId) {
        return res.status(403).json({ error: 'University context missing' });
      }
      whereClause.student = { universityId };
      if (studentId) whereClause.studentId = studentId;
    } else if (role === 'ADMIN') {
      if (studentId) whereClause.studentId = studentId;
    } else {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    if (status) {
      whereClause.status = status;
    }

    const [total, reports] = await Promise.all([
      prisma.report.count({ where: whereClause }),
      prisma.report.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentId: true,
              programme: true,
              profilePicUrl: true
            }
          },
          internship: {
            select: {
              id: true,
              title: true,
              recruiter: {
                select: { companyName: true }
              }
            }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      reports,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
}

async function getReportById(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;

    let where = { id };
    if (role === 'UNIVERSITY') {
      const universityId = req.user.universityId || req.user.university?.id;
      if (!universityId) {
        return res.status(403).json({ error: 'University context missing' });
      }
      where.student = { universityId };
    }

    const report = await prisma.report.findFirst({
      where,
      include: {
        student: true,
        internship: {
          include: { recruiter: true }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('Error fetching report detail:', error);
    res.status(500).json({ error: 'Failed to fetch report details' });
  }
}

async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const { role } = req.user;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'Invalid report status' });
    }

    let where = { id };
    if (role === 'UNIVERSITY') {
      const universityId = req.user.universityId || req.user.university?.id;
      if (!universityId) {
        return res.status(403).json({ error: 'University context missing' });
      }
      where.student = { universityId };
    }

    const report = await prisma.report.findFirst({
      where,
      include: { student: true }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        comment: comment !== undefined ? comment : report.comment
      }
    });

    // Send notification to student
    await prisma.notification.create({
      data: {
        userId: report.student.userId,
        title: `Report ${status.toLowerCase()}`,
        message: `Your report "${report.title}" was ${status.toLowerCase()}.${comment ? ` Comment: ${comment}` : ''}`,
        type: 'REPORT'
      }
    });

    createAuditLog({
      req,
      action: 'REPORT_STATUS_CHANGED',
      category: 'REPORT_MANAGEMENT',
      target: 'Report',
      targetId: id,
      description: `Report "${report.title}" status changed from ${report.status} to ${status}`,
      metadata: { previousStatus: report.status, newStatus: status, comment: comment || null }
    });

    res.json({ success: true, report: updatedReport });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
}

module.exports = {
  submitReport,
  getReports,
  getReportById,
  updateReportStatus
};
