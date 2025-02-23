const fs = require("fs").promises;
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Ensure upload directory exists
(async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
  }
})();

const tempStorage = {
  saveImages: async (files) => {
    const savedPaths = [];
    for (const file of files) {
      const fileName = `${Date.now()}_${file.originalname.replace(
        /\s+/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      await fs.writeFile(filePath, file.buffer);
      savedPaths.push({ path: filePath, name: fileName });
    }
    return savedPaths;
  },

  cleanupImages: async (paths) => {
    for (const path of paths) {
      try {
        await fs.unlink(path);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    }
  },
};

module.exports = tempStorage;
