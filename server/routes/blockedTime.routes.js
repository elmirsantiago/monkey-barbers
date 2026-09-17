const express = require("express");

const {
  createBlockedTime,
  getBlockedTimes,
  deleteBlockedTime,
} = require("../controllers/blockedTime.controller");

const {
  requireAdmin,
} = require("../middlewares/adminAuth.middleware");

const router = express.Router();

// Todas las rutas de bloqueos requieren autenticación
router.use(requireAdmin);

router.get("/", getBlockedTimes);
router.post("/", createBlockedTime);
router.delete("/:id", deleteBlockedTime);

module.exports = router;