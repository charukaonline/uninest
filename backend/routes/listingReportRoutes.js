const express = require("express");
const router = express.Router();

const { addReport, getReport } = require("../controllers/reportController");

router.post("/addReport", addReport);

router.get("/get-reports", getReport);

module.exports = router;