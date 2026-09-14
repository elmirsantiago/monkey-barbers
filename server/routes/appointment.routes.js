const express = require("express");

const {
  createAppointment,
  getAvailability,
} = require("../controllers/appointment.controller");

const router = express.Router();

router.get("/availability", getAvailability);

router.post("/", createAppointment);

module.exports = router;