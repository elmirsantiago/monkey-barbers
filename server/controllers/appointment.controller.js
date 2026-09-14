const appointmentService = require(
  "../services/appointment.service"
);

const createAppointment = async (req, res) => {
  try {
    const appointment =
      await appointmentService.createAppointment(req.body);

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

module.exports = {
  createAppointment,
};