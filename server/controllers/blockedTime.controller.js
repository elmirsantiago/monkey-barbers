const blockedTimeService = require("../services/blockedTime.service");

const createBlockedTime = async (req, res) => {
  try {
    const blockedTime = await blockedTimeService.createBlockedTime(req.body);

    res.status(201).json({
      status: "success",
      message: "Horario bloqueado correctamente",
      blockedTime,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getBlockedTimes = async (req, res) => {
  try {
    const { date } = req.query;

    const blockedTimes =
      await blockedTimeService.getBlockedTimes(date);

    res.status(200).json({
      status: "success",
      blockedTimes,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteBlockedTime = async (req, res) => {
  try {
    const blockedTime =
      await blockedTimeService.deleteBlockedTime(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Bloqueo eliminado correctamente",
      blockedTime,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createBlockedTime,
  getBlockedTimes,
  deleteBlockedTime,
};