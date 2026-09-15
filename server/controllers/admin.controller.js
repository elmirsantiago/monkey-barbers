const adminService = require(
  "../services/admin.service"
);

const login = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const {
      token,
      admin,
    } = await adminService.login(
      username,
      password
    );

    res.cookie(
      "adminToken",
      token,
      {
        httpOnly: true,

        sameSite: "lax",

        secure:
          process.env.NODE_ENV ===
          "production",

        maxAge:
          8 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      status: "success",
      message:
        "Sesión iniciada correctamente",
      admin,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCurrentAdmin = async (
  req,
  res
) => {
  res.status(200).json({
    status: "success",
    admin: req.admin,
  });
};

const logout = (req, res) => {
  res.clearCookie(
    "adminToken",
    {
      httpOnly: true,
      sameSite: "lax",

      secure:
        process.env.NODE_ENV ===
        "production",
    }
  );

  res.status(200).json({
    status: "success",
    message:
      "Sesión cerrada correctamente",
  });
};

module.exports = {
  login,
  getCurrentAdmin,
  logout,
};