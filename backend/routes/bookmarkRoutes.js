const express = require("express");
const router = express.Router();

const {
  addBookMark,
  getBookMark,
  getBookmarksByUser,
  deleteBookmark, // Add the delete function
} = require("../controllers/bookMarkController");

router.post("/addBookMark", addBookMark);

router.get("/getBookMark", getBookMark);

// Route to fetch bookmarks for a specific user
router.get("/:userId", getBookmarksByUser);

// Route to delete a specific bookmark
router.delete("/:bookmarkId", deleteBookmark);

// Export the router
module.exports = router;