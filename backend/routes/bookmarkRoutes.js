const express = require("express");
const router = express.Router();

const {
  addBookMark,
} = require("../controllers/bookMarkController");

router.post("/addBookMark", addBookMark);

// Export the router
module.exports = router;