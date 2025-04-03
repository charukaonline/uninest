const express = require("express");
const router = express.Router();

const {
  addBookMark,
  getBookMark,
  getBookmarksByUser, // Ensure this is imported
} = require("../controllers/bookMarkController");

router.post("/addBookMark", addBookMark);

router.get("/getBookMark", getBookMark);

// Route to fetch bookmarks for a specific user
router.get("/:userId", getBookmarksByUser); // Ensure this uses the correct function

// Export the router
module.exports = router;