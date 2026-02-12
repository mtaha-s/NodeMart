import multer from "multer";

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();

// Create the multer instance with the defined storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Export the multer instance for use in routes
export { upload };