const express = require("express");
const router = express.Router();

const { addReport } = require("../controllers/reportController");

router.post("/addReport", addReport);

module.exports = router;