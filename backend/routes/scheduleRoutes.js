const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

router.post("/addSchedule", scheduleController.addSchedule);

router.get("/user/:userId", scheduleController.getSchedulesByUserId);

router.get("/landlord/:landlordId", scheduleController.getSchedulesByLandlordId);

router.patch("/:scheduleId/status", scheduleController.updateScheduleStatus);

module.exports = router;
