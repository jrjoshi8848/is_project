import multer from 'multer';
import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage (to upload images directly to Cloudinary)
const storage = multer.memoryStorage();

// Flexible file upload with Multer that allows dynamic field names
const upload = (fieldName, maxCount = 1) => {
  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit for each file
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(file.originalname.toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true); // Accept the file
      } else {
        return cb(new Error('Only image files are allowed'), false); // Reject the file
      }
    },
  }).array(fieldName, maxCount); // Multiple images upload based on maxCount
};

// Cloudinary upload function
const uploadToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader.upload_stream(
      { resource_type: 'image', public_id: filename },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });
};

export { upload, uploadToCloudinary };
