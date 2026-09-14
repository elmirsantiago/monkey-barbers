const Appointment = require("../models/Appointment");

const SERVICES = {
  "corte-cejas": {
    name: "Corte + cejas",
    price: 15000,
    duration: 30,
  },

  "corte-barba": {
    name: "Corte + barba",
    price: 17000,
    duration: 40,
  },

  barba: {
    name: "Barba",
    price: 10000,
    duration: 20,
  },

  vip: {
    name: "VIP",
    price: 12000,
    duration: 30,
  },

  "vip-barba": {
    name: "VIP barba",
    price: 14000,
    duration: 40,
  },
};

const OPENING_HOUR = 10;
const CLOSING_HOUR = 19;

const createAppointment = async (data) => {
  const {
    service,
    barber,
    date,
    time,
    customerName,
    customerPhone,
  } = data;

  if (
    !service ||
    !barber ||
    !date ||
    !time ||
    !customerName ||
    !customerPhone
  ) {
    throw new Error("Todos los campos son obligatorios");
  }

  const selectedService = SERVICES[service];

  if (!selectedService) {
    throw new Error("Servicio inválido");
  }

  if (!["bruno", "santi"].includes(barber)) {
    throw new Error("Barbero inválido");
  }

  validateDate(date);
  validateTime(time, selectedService.duration);

  const newStart = timeToMinutes(time);
  const newEnd = newStart + selectedService.duration;

  const existingAppointments = await Appointment.find({
    barber,
    date,
    status: "confirmed",
  });

  const hasConflict = existingAppointments.some((appointment) => {
    const existingStart = timeToMinutes(appointment.time);
    const existingEnd = existingStart + appointment.duration;

    return newStart < existingEnd && newEnd > existingStart;
  });

  if (hasConflict) {
    throw new Error(
      "Ese horario ya no está disponible para el barbero seleccionado"
    );
  }

  const appointment = await Appointment.create({
    service,
    barber,
    date,
    time,
    duration: selectedService.duration,
    price: selectedService.price,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
  });

  return appointment;
};

function validateDate(date) {
  const selectedDate = createLocalDate(date);

  if (!selectedDate) {
    throw new Error("Fecha inválida");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error("No se pueden reservar fechas pasadas");
  }

  const day = selectedDate.getDay();

  if (day === 0 || day === 1) {
    throw new Error(
      "La barbería permanece cerrada los domingos y lunes"
    );
  }
}

function validateTime(time, duration) {
  const start = timeToMinutes(time);

  if (start === null) {
    throw new Error("Horario inválido");
  }

  const openingMinutes = OPENING_HOUR * 60;
  const closingMinutes = CLOSING_HOUR * 60;
  const end = start + duration;

  if (start < openingMinutes || end > closingMinutes) {
    throw new Error(
      "El turno debe estar dentro del horario de atención"
    );
  }
}

function timeToMinutes(time) {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);

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

function createLocalDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);

  const result = new Date(year, month - 1, day);

  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day
  ) {
    return null;
  }

  result.setHours(0, 0, 0, 0);

  return result;
}

module.exports = {
  createAppointment,
};