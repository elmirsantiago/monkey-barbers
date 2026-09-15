const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const login = async (username, password) => {
  if (!username || !password) {
    throw new Error(
      "Usuario y contraseña son obligatorios"
    );
  }

  const admin = await Admin.findOne({
    username: username
      .trim()
      .toLowerCase(),
  });

  if (!admin) {
    throw new Error(
      "Usuario o contraseña incorrectos"
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      admin.password
    );

  if (!passwordMatches) {
    throw new Error(
      "Usuario o contraseña incorrectos"
    );
  }

  const token = jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return {
    token,

    admin: {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
  };
};

module.exports = {
  login,
};