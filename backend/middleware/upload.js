const multer = require("multer");
const path = require("path");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

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

// Multer instance with memory storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for both PDFs and images
  },
});

module.exports = upload;
