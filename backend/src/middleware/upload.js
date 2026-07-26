const multer = require('multer');

// Use memory storage so we can stream the file buffer directly to Cloudinary
const storage = multer.memoryStorage();

/**
 * File filter that restricts uploads to images and PDFs only
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, WEBP) and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware for single file upload — used in routes as upload.single('file')
module.exports = upload;
