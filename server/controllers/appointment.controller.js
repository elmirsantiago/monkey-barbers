const appointmentService = require(
  "../services/appointment.service"
);

// ==========================================
// CREAR TURNO
// ==========================================

const createAppointment = async (req, res) => {
  try {
    const appointment =
      await appointmentService.createAppointment(
        req.body
      );

    res.status(201).json({
      status: "success",
      message: "Turno reservado correctamente",
      appointment,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ==========================================
// DISPONIBILIDAD
// ==========================================

const getAvailability = async (req, res) => {
  try {
    const {
      service,
      barber,
      date,
    } = req.query;

    const availableTimes =
      await appointmentService.getAvailability(
        service,
        barber,
        date
      );

    res.status(200).json({
      status: "success",
      availableTimes,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ==========================================
// LISTAR TURNOS
// ==========================================

const getAppointments = async (req, res) => {
  try {
    const { date } = req.query;

    const appointments =
      await appointmentService.getAppointments(
        date
      );

    res.status(200).json({
      status: "success",
      appointments,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ==========================================
// CANCELAR TURNO
// ==========================================

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment =
      await appointmentService.cancelAppointment(
        id
      );

    res.status(200).json({
      status: "success",
      message: "Turno cancelado correctamente",
      appointment,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAvailability,
  getAppointments,
  cancelAppointment,
};