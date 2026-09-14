const express = require("express");

const {
  createAppointment,
  getAvailability,
  getAppointments,
  cancelAppointment,
} = require(
  "../controllers/appointment.controller"
);

const router = express.Router();

// Consultar disponibilidad
router.get(
  "/availability",
  getAvailability
);

// Listar turnos
router.get(
  "/",
  getAppointments
);

// Crear turno
router.post(
  "/",
  createAppointment
);

// Cancelar turno
router.patch(
  "/:id/cancel",
  cancelAppointment
);

module.exports = router;