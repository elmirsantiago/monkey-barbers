const express = require("express");

const {
  createAppointment,
  getAvailability,
  getAppointments,
  cancelAppointment,
} = require(
  "../controllers/appointment.controller"
);

const {
  requireAdmin,
} = require(
  "../middlewares/adminAuth.middleware"
);

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

// Consultar horarios disponibles
router.get(
  "/availability",
  getAvailability
);

// Crear una reserva
router.post(
  "/",
  createAppointment
);

// ==========================================
// RUTAS PROTEGIDAS
// ==========================================

// Listar turnos
router.get(
  "/",
  requireAdmin,
  getAppointments
);

// Cancelar turno
router.patch(
  "/:id/cancel",
  requireAdmin,
  cancelAppointment
);

module.exports = router;