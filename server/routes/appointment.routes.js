const express = require("express");

const {
  createAppointment,
  getAvailability,
  getAppointments,
} = require(
  "../controllers/appointment.controller"
);

const router = express.Router();

router.get(
  "/availability",
  getAvailability
);

router.get(
  "/",
  getAppointments
);

router.post(
  "/",
  createAppointment
);

module.exports = router;