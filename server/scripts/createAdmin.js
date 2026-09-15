const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const createAdmin = async () => {
  try {
    await connectDB();

    const username = "bruno";
    const plainPassword = "Monkey1234";

    const existingAdmin = await Admin.findOne({
      username,n
    });

    if (existingAdmin) {
      console.log("⚠️ El usuario ya existe");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      plainPassword,
      10
    );

    await Admin.create({
      username,
      password: hashedPassword,
      name: "Bruno",
      role: "admin",
    });

    console.log("✅ Usuario admin creado");
    console.log("Usuario:", username);
    console.log("Contraseña:", plainPassword);

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Error creando admin:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();