const Appointment = require("../models/Appointment");

const {
  sendAppointmentConfirmation,
} = require("./whatsapp.service");

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
const SLOT_INTERVAL = 10;

const createAppointment = async (data) => {
  const {
    service,
    barber,
    date,
    time,
    customerName,
    customerPhone,
  } = data;

  // Validamos campos obligatorios
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

  // Buscamos el servicio seleccionado
  const selectedService = SERVICES[service];

  if (!selectedService) {
    throw new Error("Servicio inválido");
  }

  // Validamos el barbero
  if (!["bruno", "santi"].includes(barber)) {
    throw new Error("Barbero inválido");
  }

  // Validamos fecha y horario
  validateDate(date);
  validateTime(time, selectedService.duration);

  const newStart = timeToMinutes(time);
  const newEnd = newStart + selectedService.duration;

  // Buscamos los turnos ya confirmados
  // de ese barbero para ese día
  const existingAppointments = await Appointment.find({
    barber,
    date,
    status: "confirmed",
  });

  // Revisamos si el nuevo turno se superpone
  // con alguno que ya exista
  const hasConflict = existingAppointments.some(
    (appointment) => {
      const existingStart = timeToMinutes(
        appointment.time
      );

      const existingEnd =
        existingStart + appointment.duration;

      return (
        newStart < existingEnd &&
        newEnd > existingStart
      );
    }
  );

  if (hasConflict) {
    throw new Error(
      "Ese horario ya no está disponible para el barbero seleccionado"
    );
  }

  // Creamos el turno en MongoDB
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

  // Una vez guardado el turno,
  // intentamos enviar la confirmación por WhatsApp
  try {
    await sendAppointmentConfirmation({
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      serviceName: selectedService.name,
      barberName:
        barber === "bruno" ? "Bruno" : "Santi",
      date: appointment.date,
      time: appointment.time,
    });
  } catch (error) {
    // Si WhatsApp falla, NO eliminamos el turno.
    // El turno ya quedó guardado correctamente.
    console.error(
      "⚠️ El turno fue creado pero falló WhatsApp:",
      error.message
    );
  }

  return appointment;
};

const getAvailability = async (
  service,
  barber,
  date
) => {
  // Validamos parámetros
  if (!service || !barber || !date) {
    throw new Error(
      "Servicio, barbero y fecha son obligatorios"
    );
  }

  const selectedService = SERVICES[service];

  if (!selectedService) {
    throw new Error("Servicio inválido");
  }

  if (!["bruno", "santi"].includes(barber)) {
    throw new Error("Barbero inválido");
  }

  validateDate(date);

  // Buscamos los turnos confirmados
  // del barbero seleccionado
  const appointments = await Appointment.find({
    barber,
    date,
    status: "confirmed",
  });

  const openingMinutes = OPENING_HOUR * 60;
  const closingMinutes = CLOSING_HOUR * 60;

  const availableTimes = [];

  // Generamos horarios cada 10 minutos
  for (
    let start = openingMinutes;
    start + selectedService.duration <=
    closingMinutes;
    start += SLOT_INTERVAL
  ) {
    const end =
      start + selectedService.duration;

    // Revisamos si este posible horario
    // se pisa con algún turno existente
    const hasConflict = appointments.some(
      (appointment) => {
        const existingStart = timeToMinutes(
          appointment.time
        );

        const existingEnd =
          existingStart + appointment.duration;

        return (
          start < existingEnd &&
          end > existingStart
        );
      }
    );

    if (!hasConflict) {
      availableTimes.push(
        minutesToTime(start)
      );
    }
  }

  return availableTimes;
};

function validateDate(date) {
  const selectedDate = createLocalDate(date);

  if (!selectedDate) {
    throw new Error("Fecha inválida");
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error(
      "No se pueden reservar fechas pasadas"
    );
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

  const openingMinutes =
    OPENING_HOUR * 60;

  const closingMinutes =
    CLOSING_HOUR * 60;

  const end = start + duration;

  if (
    start < openingMinutes ||
    end > closingMinutes
  ) {
    throw new Error(
      "El turno debe estar dentro del horario de atención"
    );
  }
}

function timeToMinutes(time) {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const [hours, minutes] = time
    .split(":")
    .map(Number);

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

function minutesToTime(totalMinutes) {
  const hours = Math.floor(
    totalMinutes / 60
  );

  const minutes =
    totalMinutes % 60;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function createLocalDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const [year, month, day] = date
    .split("-")
    .map(Number);

  const result = new Date(
    year,
    month - 1,
    day
  );

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
  getAvailability,
};