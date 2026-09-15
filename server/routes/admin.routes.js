const express = require("express");

const {
  login,
  getCurrentAdmin,
  logout,
} = require(
  "../controllers/admin.controller"
);

const {
  requireAdmin,
} = require(
  "../middlewares/adminAuth.middleware"
);

const router = express.Router();

router.post(
  "/login",
  login
);

router.get(
  "/me",
  requireAdmin,
  getCurrentAdmin
);

router.post(
  "/logout",
  requireAdmin,
  logout
);

module.exports = router;