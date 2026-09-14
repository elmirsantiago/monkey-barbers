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

const getAvailability = async (req, res) => {
  try {
    const { service, barber, date } = req.query;

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

module.exports = {
  createAppointment,
  getAvailability,
};