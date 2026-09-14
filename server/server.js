const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const appointmentRoutes = require(
  "./routes/appointment.routes"
);

const app = express();

const PORT =
  process.env.API_PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message:
      "Monkey Barber's API funcionando",
  });
});

app.use(
  "/api/appointments",
  appointmentRoutes
);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🐒 Monkey Barber's API corriendo en http://localhost:${PORT}`
    );
  });
};

startServer();