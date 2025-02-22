const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to validate file types (PDFs for NICs, images for listings)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    // Allow only PDFs for landlord NIC upload
    req.fileType = "pdf";
    cb(null, true);
  } else if (file.mimetype.startsWith("image/")) {
    // Allow only images for listing images
    req.fileType = "image";
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed!"), false);
  }
};

// Multer instance with defined storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for both PDFs and images
  },
});

module.exports = upload;
