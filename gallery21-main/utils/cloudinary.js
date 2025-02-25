import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * @param {Buffer} buffer - The image file as a Buffer.
 * @param {Object} options - Additional options for Cloudinary.
 * @param {string} options.folder - Folder to organize uploads in Cloudinary.
 * @param {string} [options.publicId] - Optional public ID for the uploaded file.
 * @returns {Promise<Object>} - The Cloudinary upload result.
 */
export const uploadToCloudinary = async (buffer, { folder, publicId, timeout=6000 }) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder, // Organize uploads in a specific folder
        public_id: publicId, // Optional custom public ID
        resource_type: "image", // Specify that we're uploading an image
        timeout,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer); // Write the buffer to the upload stream
  });
};
