const BlockedTime = require("../models/BlockedTime");
const Appointment = require("../models/Appointment");

const BARBERS = ["bruno", "santi"];

// ==========================================
// CREAR BLOQUEO
// ==========================================

const createBlockedTime = async (data) => {
  const {
    barber,
    date,
    startTime,
    endTime,
    reason,
  } = data;

  if (
    !barber ||
    !date ||
    !startTime ||
    !endTime
  ) {
    throw new Error(
      "Barbero, fecha, hora de inicio y hora de fin son obligatorios"
    );
  }

  if (!BARBERS.includes(barber)) {
    throw new Error("Barbero inválido");
  }

  validateDate(date);

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null) {
    throw new Error("Horario inválido");
  }

  if (start >= end) {
    throw new Error(
      "La hora de fin debe ser posterior a la hora de inicio"
    );
  }

  if (
    start < 10 * 60 ||
    end > 19 * 60
  ) {
    throw new Error(
      "El bloqueo debe estar dentro del horario de atención"
    );
  }

  // Buscamos bloqueos y turnos confirmados
  // del barbero para ese día.
  const [
    existingBlocks,
    existingAppointments,
  ] = await Promise.all([
    BlockedTime.find({
      barber,
      date,
    }),

    Appointment.find({
      barber,
      date,
      status: "confirmed",
    }),
  ]);

  // ==========================================
  // CONFLICTO CON OTROS BLOQUEOS
  // ==========================================

  const hasBlockConflict =
    existingBlocks.some((block) => {
      const existingStart =
        timeToMinutes(block.startTime);

      const existingEnd =
        timeToMinutes(block.endTime);

      return (
        start < existingEnd &&
        end > existingStart
      );
    });

  if (hasBlockConflict) {
    throw new Error(
      "Ya existe un bloqueo que se superpone con ese horario"
    );
  }

  // ==========================================
  // CONFLICTO CON TURNOS CONFIRMADOS
  // ==========================================

  const hasAppointmentConflict =
    existingAppointments.some(
      (appointment) => {
        const appointmentStart =
          timeToMinutes(
            appointment.time
          );

        const appointmentEnd =
          appointmentStart +
          appointment.duration;

        return (
          start < appointmentEnd &&
          end > appointmentStart
        );
      }
    );

  if (hasAppointmentConflict) {
    throw new Error(
      "Hay turnos confirmados dentro de ese horario"
    );
  }

  // ==========================================
  // CREAR BLOQUEO
  // ==========================================

  const blockedTime =
    await BlockedTime.create({
      barber,
      date,
      startTime,
      endTime,
      reason:
        reason?.trim() || "",
    });

  return blockedTime;
};

// ==========================================
// OBTENER BLOQUEOS
// ==========================================

const getBlockedTimes = async (date) => {
  const filter = {};

  if (date) {
    validateDate(date);
    filter.date = date;
  }

  return BlockedTime.find(filter).sort({
    date: 1,
    startTime: 1,
  });
};

// ==========================================
// ELIMINAR BLOQUEO
// ==========================================

const deleteBlockedTime = async (id) => {
  const blockedTime =
    await BlockedTime.findById(id);

  if (!blockedTime) {
    throw new Error(
      "Bloqueo no encontrado"
    );
  }

  await blockedTime.deleteOne();

  return blockedTime;
};

// ==========================================
// VALIDAR FECHA
// ==========================================

function validateDate(date) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    throw new Error("Fecha inválida");
  }

  const [year, month, day] =
    date.split("-").map(Number);

  const selectedDate =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    selectedDate.getFullYear() !==
      year ||
    selectedDate.getMonth() !==
      month - 1 ||
    selectedDate.getDate() !==
      day
  ) {
    throw new Error("Fecha inválida");
  }
}

// ==========================================
// CONVERTIR HORA A MINUTOS
// ==========================================

function timeToMinutes(time) {
  if (
    !/^\d{2}:\d{2}$/.test(time)
  ) {
    return null;
  }

  const [hours, minutes] =
    time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

module.exports = {
  createBlockedTime,
  getBlockedTimes,
  deleteBlockedTime,
};