const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

router.post("/addSchedule", scheduleController.addSchedule);
router.get("/user/:userId", scheduleController.getSchedulesByUserId);

module.exports = router;
