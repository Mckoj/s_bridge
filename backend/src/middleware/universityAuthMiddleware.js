const prisma = require('../config/db');

const requireUniversityContext = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (req.user.role !== 'UNIVERSITY') {
            return res.status(403).json({ error: 'University access required' });
        }

        if (!req.user.universityId) {
            return res.status(403).json({ error: 'University context missing' });
        }

        const university = await prisma.university.findUnique({
            where: { id: req.user.universityId }
        });

        if (!university || !university.isVerified) {
            return res.status(403).json({ error: 'University access is not authorized' });
        }

        req.university = university;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = requireUniversityContext;
