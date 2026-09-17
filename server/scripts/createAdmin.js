const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const createAdmin = async () => {
  try {
    // ==========================================
    // VARIABLES DE ENTORNO
    // ==========================================

    const username =
      process.env.ADMIN_USERNAME;

    const plainPassword =
      process.env.ADMIN_PASSWORD;

    const name =
      process.env.ADMIN_NAME;

    const role =
      process.env.ADMIN_ROLE || "admin";

    // ==========================================
    // VALIDAR CONFIGURACIÓN
    // ==========================================

    if (
      !username ||
      !plainPassword ||
      !name
    ) {
      throw new Error(
        "Faltan ADMIN_USERNAME, ADMIN_PASSWORD o ADMIN_NAME en el archivo .env"
      );
    }

    if (
      !["admin", "barber"].includes(role)
    ) {
      throw new Error(
        "ADMIN_ROLE debe ser admin o barber"
      );
    }

    if (plainPassword.length < 8) {
      throw new Error(
        "ADMIN_PASSWORD debe tener al menos 8 caracteres"
      );
    }

    // ==========================================
    // CONECTAR A MONGODB
    // ==========================================

    await connectDB();

    // ==========================================
    // COMPROBAR SI YA EXISTE
    // ==========================================

    const normalizedUsername =
      username.trim().toLowerCase();

    const existingAdmin =
      await Admin.findOne({
        username: normalizedUsername,
      });

    if (existingAdmin) {
      console.log(
        "⚠️ El usuario ya existe"
      );

      process.exit(0);
    }

    // ==========================================
    // HASHEAR CONTRASEÑA
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(
        plainPassword,
        10
      );

    // ==========================================
    // CREAR ADMIN
    // ==========================================

    await Admin.create({
      username: normalizedUsername,
      password: hashedPassword,
      name: name.trim(),
      role,
    });

    console.log(
      "✅ Usuario admin creado correctamente"
    );

    console.log(
      "Usuario:",
      normalizedUsername
    );

    // IMPORTANTE:
    // nunca mostramos la contraseña
    // en la consola.

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