const Appointment = require("../models/Appointment");
const BlockedTime = require("../models/BlockedTime");

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

// ==========================================
// CREAR TURNO
// ==========================================

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

  // Evita reservar un horario que ya pasó si la fecha es hoy.
  validateNotPastTime(date, time);

  const newStart = timeToMinutes(time);
  const newEnd =
    newStart + selectedService.duration;

  // Buscamos turnos y bloqueos al mismo tiempo.
  const [
    existingAppointments,
    blockedTimes,
  ] = await Promise.all([
    Appointment.find({
      barber,
      date,
      status: "confirmed",
    }),

    BlockedTime.find({
      barber,
      date,
    }),
  ]);

  // ==========================================
  // CONFLICTO CON OTROS TURNOS
  // ==========================================

  const hasAppointmentConflict =
    existingAppointments.some(
      (appointment) => {
        const existingStart =
          timeToMinutes(
            appointment.time
          );

        const existingEnd =
          existingStart +
          appointment.duration;

        return (
          newStart < existingEnd &&
          newEnd > existingStart
        );
      }
    );

  if (hasAppointmentConflict) {
    throw new Error(
      "Ese horario ya no está disponible para el barbero seleccionado"
    );
  }

  // ==========================================
  // CONFLICTO CON BLOQUEOS
  // ==========================================

  const hasBlockedTimeConflict =
    blockedTimes.some((block) => {
      const blockedStart =
        timeToMinutes(block.startTime);

      const blockedEnd =
        timeToMinutes(block.endTime);

      return (
        newStart < blockedEnd &&
        newEnd > blockedStart
      );
    });

  if (hasBlockedTimeConflict) {
    throw new Error(
      "Ese horario está bloqueado para el barbero seleccionado"
    );
  }

  // ==========================================
  // GUARDAR TURNO
  // ==========================================

  const appointment =
    await Appointment.create({
      service,
      barber,
      date,
      time,
      duration:
        selectedService.duration,
      price: selectedService.price,
      customerName:
        customerName.trim(),
      customerPhone:
        customerPhone.trim(),
    });

  // El turno ya quedó guardado.
  // Si WhatsApp falla, no perdemos la reserva.
  try {
    await sendAppointmentConfirmation({
      customerName:
        appointment.customerName,

      customerPhone:
        appointment.customerPhone,

      serviceName:
        selectedService.name,

      barberName:
        barber === "bruno"
          ? "Bruno"
          : "Santi",

      date: appointment.date,
      time: appointment.time,
    });
  } catch (error) {
    console.error(
      "⚠️ El turno fue creado pero falló WhatsApp:",
      error.message
    );
  }

  return appointment;
};

// ==========================================
// DISPONIBILIDAD
// ==========================================

const getAvailability = async (
  service,
  barber,
  date
) => {
  if (!service || !barber || !date) {
    throw new Error(
      "Servicio, barbero y fecha son obligatorios"
    );
  }

  const selectedService =
    SERVICES[service];

  if (!selectedService) {
    throw new Error("Servicio inválido");
  }

  if (
    !["bruno", "santi"].includes(
      barber
    )
  ) {
    throw new Error("Barbero inválido");
  }

  validateDate(date);

  // Consultamos turnos y bloqueos
  // al mismo tiempo.
  const [
    appointments,
    blockedTimes,
  ] = await Promise.all([
    Appointment.find({
      barber,
      date,
      status: "confirmed",
    }),

    BlockedTime.find({
      barber,
      date,
    }),
  ]);

  const openingMinutes =
    OPENING_HOUR * 60;

  const closingMinutes =
    CLOSING_HOUR * 60;

  const availableTimes = [];

  // Hora actual real de Argentina.
  const argentinaNow =
    getArgentinaNow();

  const isToday =
    date === argentinaNow.date;

  for (
    let start = openingMinutes;
    start +
      selectedService.duration <=
    closingMinutes;
    start += SLOT_INTERVAL
  ) {
    const end =
      start +
      selectedService.duration;

    // ========================================
    // SI ES HOY, IGNORAR HORARIOS PASADOS
    // ========================================

    if (
      isToday &&
      start <= argentinaNow.minutes
    ) {
      continue;
    }

    // ========================================
    // CONFLICTO CON TURNOS
    // ========================================

    const hasAppointmentConflict =
      appointments.some(
        (appointment) => {
          const existingStart =
            timeToMinutes(
              appointment.time
            );

          const existingEnd =
            existingStart +
            appointment.duration;

          return (
            start < existingEnd &&
            end > existingStart
          );
        }
      );

    // ========================================
    // CONFLICTO CON BLOQUEOS
    // ========================================

    const hasBlockedTimeConflict =
      blockedTimes.some(
        (block) => {
          const blockedStart =
            timeToMinutes(
              block.startTime
            );

          const blockedEnd =
            timeToMinutes(
              block.endTime
            );

          return (
            start < blockedEnd &&
            end > blockedStart
          );
        }
      );

    // Solo mostramos el horario
    // si está completamente disponible.
    if (
      !hasAppointmentConflict &&
      !hasBlockedTimeConflict
    ) {
      availableTimes.push(
        minutesToTime(start)
      );
    }
  }

  return availableTimes;
};

// ==========================================
// LISTAR TURNOS - ADMIN
// ==========================================

const getAppointments = async (
  date
) => {
  const filter = {
    status: "confirmed",
  };

  if (date) {
    const selectedDate =
      createLocalDate(date);

    if (!selectedDate) {
      throw new Error(
        "Fecha inválida"
      );
    }

    filter.date = date;
  }

  const appointments =
    await Appointment.find(
      filter
    ).sort({
      date: 1,
      time: 1,
    });

  return appointments;
};

// ==========================================
// CANCELAR TURNO
// ==========================================

const cancelAppointment = async (
  appointmentId
) => {
  const appointment =
    await Appointment.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Turno no encontrado"
    );
  }

  if (
    appointment.status ===
    "cancelled"
  ) {
    throw new Error(
      "El turno ya está cancelado"
    );
  }

  appointment.status =
    "cancelled";

  await appointment.save();

  return appointment;
};

// ==========================================
// VALIDAR FECHA
// ==========================================

function validateDate(date) {
  const selectedDate =
    createLocalDate(date);

  if (!selectedDate) {
    throw new Error(
      "Fecha inválida"
    );
  }

  // Usamos la fecha de Argentina,
  // no la zona horaria del servidor.
  const argentinaNow =
    getArgentinaNow();

  const today =
    createLocalDate(
      argentinaNow.date
    );

  if (selectedDate < today) {
    throw new Error(
      "No se pueden reservar fechas pasadas"
    );
  }

  const day =
    selectedDate.getDay();

  if (
    day === 0 ||
    day === 1
  ) {
    throw new Error(
      "La barbería permanece cerrada los domingos y lunes"
    );
  }
}

// ==========================================
// VALIDAR HORARIO DE ATENCIÓN
// ==========================================

function validateTime(
  time,
  duration
) {
  const start =
    timeToMinutes(time);

  if (start === null) {
    throw new Error(
      "Horario inválido"
    );
  }

  const openingMinutes =
    OPENING_HOUR * 60;

  const closingMinutes =
    CLOSING_HOUR * 60;

  const end =
    start + duration;

  if (
    start < openingMinutes ||
    end > closingMinutes
  ) {
    throw new Error(
      "El turno debe estar dentro del horario de atención"
    );
  }
}

// ==========================================
// VALIDAR HORARIO PASADO HOY
// ==========================================

function validateNotPastTime(
  date,
  time
) {
  const argentinaNow =
    getArgentinaNow();

  // Si no es hoy, no hace falta
  // validar contra la hora actual.
  if (
    date !== argentinaNow.date
  ) {
    return;
  }

  const appointmentMinutes =
    timeToMinutes(time);

  if (
    appointmentMinutes === null ||
    appointmentMinutes <=
      argentinaNow.minutes
  ) {
    throw new Error(
      "No se puede reservar un horario que ya pasó"
    );
  }
}

// ==========================================
// OBTENER FECHA/HORA DE ARGENTINA
// ==========================================

function getArgentinaNow() {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/Argentina/Cordoba",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",

        hourCycle: "h23",
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  const values = {};

  for (const part of parts) {
    if (
      part.type !== "literal"
    ) {
      values[part.type] =
        part.value;
    }
  }

  return {
    date:
      `${values.year}-` +
      `${values.month}-` +
      `${values.day}`,

    minutes:
      Number(values.hour) *
        60 +
      Number(values.minute),
  };
}

// ==========================================
// CONVERTIR HORA A MINUTOS
// ==========================================

function timeToMinutes(time) {
  if (
    !/^\d{2}:\d{2}$/.test(
      time
    )
  ) {
    return null;
  }

  const [hours, minutes] =
    time
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

  return (
    hours * 60 +
    minutes
  );
}

// ==========================================
// CONVERTIR MINUTOS A HORA
// ==========================================

function minutesToTime(
  totalMinutes
) {
  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  return `${String(
    hours
  ).padStart(
    2,
    "0"
  )}:${String(
    minutes
  ).padStart(
    2,
    "0"
  )}`;
}

// ==========================================
// CREAR FECHA LOCAL
// ==========================================

function createLocalDate(date) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      date
    )
  ) {
    return null;
  }

  const [
    year,
    month,
    day,
  ] = date
    .split("-")
    .map(Number);

  const result =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    result.getFullYear() !==
      year ||
    result.getMonth() !==
      month - 1 ||
    result.getDate() !==
      day
  ) {
    return null;
  }

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createAppointment,
  getAvailability,
  getAppointments,
  cancelAppointment,
};