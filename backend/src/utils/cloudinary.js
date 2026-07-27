const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Target folder in Cloudinary (e.g. 'cvs', 'profiles', 'logos')
 * @param {string} resourceType - 'image' | 'raw' (use 'raw' for PDFs)
 * @returns {Promise<{url: string, publicId: string}>}
 */
async function uploadToCloudinary(buffer, folder, resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `s_bridge/${folder}`,
        resource_type: resourceType,
        allowed_formats: resourceType === 'raw' ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        max_bytes: 5 * 1024 * 1024 // 5MB limit
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { cloudinary, uploadToCloudinary };
