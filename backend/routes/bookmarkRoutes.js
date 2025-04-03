const express = require("express");
const router = express.Router();

const {
  addBookMark,
  getBookMark,
} = require("../controllers/bookMarkController");

router.post("/addBookMark", addBookMark);

router.get("/getBookMark", getBookMark);

// Export the router
module.exports = router;