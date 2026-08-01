const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoute');
const studentRoutes = require('./routes/studentRoute');
const recruiterRoutes = require('./routes/recruiterRoute');
const applicationRoutes = require('./routes/applicationRoute');
const internshipRoutes = require('./routes/internshipRoute');
const reportRoutes = require('./routes/reportRoute');
const notificationRoutes = require('./routes/notificationRoute');
const universityRoutes = require('./routes/universityRoute');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Cache-Control headers ────────────────────────────────────────────────────
// GET requests: tell the browser (and any shared proxy) to cache responses
// privately for 60 seconds. This drastically reduces latency on revisited pages.
// Mutation requests: explicitly prohibit caching.
app.use((req, res, next) => {
  if (req.method === 'GET') {
    // private: only browser may cache (not CDN/proxy) — safe for authenticated routes
    // max-age=60: reuse for up to 60 seconds without re-hitting the server
    // stale-while-revalidate=30: serve stale content for up to 30s while refreshing
    res.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
  } else {
    // Never cache POST / PUT / PATCH / DELETE responses
    res.set('Cache-Control', 'no-store');
  }
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/universities', universityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Global Error handling middleware (e.g. Multer file size / type errors)
app.use((err, req, res, next) => {
  if (err) {
    console.error('Express error handler caught:', err.message);
    return res.status(400).json({ error: err.message || 'An error occurred during request processing' });
  }
  next();
});

module.exports = app;