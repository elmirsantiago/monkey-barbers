const jwt = require("jsonwebtoken");

const requireAdmin = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message:
          "No estás autenticado",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message:
        "Sesión inválida o expirada",
    });
  }
};

module.exports = {
  requireAdmin,
};