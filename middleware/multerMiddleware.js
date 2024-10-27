const multer = require("multer");
const path = require("path");

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    const fileExtension = path.extname(file.originalname);
    const filename = `${date}${fileExtension}`; // Create unique filename
    cb(null, filename);
    req.filename = filename; // Store the filename in the request object
  },
});

// Set up multer with file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Export the middleware
module.exports = { upload };
