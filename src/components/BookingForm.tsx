"use client";

import { useMemo, useState } from "react";

const services = [
  {
    id: "corte-cejas",
    name: "Corte + cejas",
    price: 15000,
    duration: 30,
  },
  {
    id: "corte-barba",
    name: "Corte + barba",
    price: 17000,
    duration: 40,
  },
  {
    id: "barba",
    name: "Barba",
    price: 10000,
    duration: 20,
  },
  {
    id: "vip",
    name: "VIP",
    price: 12000,
    duration: 30,
  },
  {
    id: "vip-barba",
    name: "VIP barba",
    price: 14000,
    duration: 40,
  },
];

const barbers = [
  {
    id: "bruno",
    name: "Bruno",
  },
  {
    id: "santi",
    name: "Santi",
  },
];

const OPENING_HOUR = 10;
const CLOSING_HOUR = 19;
const SLOT_INTERVAL = 10;

export default function BookingForm() {
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const selectedService = services.find(
    (service) => service.id === serviceId
  );

  const selectedBarber = barbers.find(
    (barber) => barber.id === barberId
  );

  const today = getLocalDateString();

  const dateError = useMemo(() => {
    if (!date) return "";

    const selectedDate = createLocalDate(date);

    if (!selectedDate) {
      return "La fecha seleccionada no es válida.";
    }

    const day = selectedDate.getDay();

    if (day === 0) {
      return "Monkey Barber's no abre los domingos.";
    }

    if (day === 1) {
      return "Monkey Barber's no abre los lunes.";
    }

    return "";
  }, [date]);

  const availableTimes = useMemo(() => {
    if (!selectedService || !barberId || !date || dateError) {
      return [];
    }

    return generateAvailableTimes(
      date,
      selectedService.duration
    );
  }, [selectedService, barberId, date, dateError]);

  const canSubmit =
    Boolean(selectedService) &&
    Boolean(selectedBarber) &&
    Boolean(date) &&
    Boolean(time) &&
    Boolean(name.trim()) &&
    Boolean(phone.trim()) &&
    !dateError;

  function handleServiceChange(service: string) {
    setServiceId(service);
    setTime("");
  }

  function handleBarberChange(barber: string) {
    setBarberId(barber);
    setTime("");
  }

  function handleDateChange(selectedDate: string) {
    setDate(selectedDate);
    setTime("");
  }

  function handleSubmit() {
    if (!canSubmit || !selectedService || !selectedBarber) {
      return;
    }

    alert(
      `Turno listo para confirmar:\n\n` +
        `${selectedService.name}\n` +
        `Barbero: ${selectedBarber.name}\n` +
        `Fecha: ${formatDate(date)}\n` +
        `Horario: ${time}\n` +
        `Cliente: ${name}\n` +
        `Teléfono: ${phone}`
    );
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-white/10 bg-black p-6 md:grid-cols-2 lg:p-10">
      {/* SERVICIO */}
      <div>
        <label
          htmlFor="service"
          className="mb-2 block text-sm font-semibold text-neutral-300"
        >
          Servicio
        </label>

        <select
          id="service"
          value={serviceId}
          onChange={(event) =>
            handleServiceChange(event.target.value)
          }
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500"
        >
          <option value="">Seleccioná un servicio</option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* BARBERO */}
      <div>
        <label
          htmlFor="barber"
          className="mb-2 block text-sm font-semibold text-neutral-300"
        >
          Barbero
        </label>

        <select
          id="barber"
          value={barberId}
          onChange={(event) =>
            handleBarberChange(event.target.value)
          }
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500"
        >
          <option value="">Seleccioná un barbero</option>

          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </div>

      {/* FECHA */}
      <div>
        <label
          htmlFor="date"
          className="mb-2 block text-sm font-semibold text-neutral-300"
        >
          Fecha
        </label>

        <input
          id="date"
          type="date"
          min={today}
          value={date}
          onChange={(event) =>
            handleDateChange(event.target.value)
          }
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500"
        />

        {dateError && (
          <p className="mt-2 text-sm font-medium text-red-500">
            {dateError}
          </p>
        )}
      </div>

      {/* HORARIO */}
      <div>
        <label
          htmlFor="time"
          className="mb-2 block text-sm font-semibold text-neutral-300"
        >
          Horario
        </label>

        <select
          id="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          disabled={
            !selectedService ||
            !barberId ||
            !date ||
            Boolean(dateError)
          }
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="">
            {!selectedService || !barberId || !date
              ? "Completá los datos anteriores"
              : dateError
                ? "La barbería está cerrada"
                : availableTimes.length === 0
                  ? "No hay horarios disponibles"
                  : "Seleccioná un horario"}
          </option>

          {availableTimes.map((availableTime) => (
            <option
              key={availableTime}
              value={availableTime}
            >
              {availableTime}
            </option>
          ))}
        </select>
      </div>

      {/* INFORMACIÓN DEL SERVICIO */}
      {selectedService && (
        <div className="rounded-xl border border-red-600/20 bg-red-600/5 p-5 md:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Servicio seleccionado
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold">
                {selectedService.name}
              </p>

              <p className="mt-1 text-neutral-400">
                Duración: {selectedService.duration} minutos
              </p>

              {selectedBarber && (
                <p className="mt-1 text-neutral-400">
                  Barbero: {selectedBarber.name}
                </p>
              )}
            </div>

            <p className="text-2xl font-black text-red-500">
              $
              {selectedService.price.toLocaleString(
                "es-AR"
              )}
            </p>
          </div>
        </div>
      )}

      {/* NOMBRE */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-neutral-300"
        >
          Nombre
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tu nombre"
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
        />
      </div>

      {/* TELÉFONO */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-neutral-300"
        >
          Teléfono
        </label>

        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Tu número de WhatsApp"
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
        />
      </div>

      {/* RESUMEN */}
      {canSubmit && selectedService && selectedBarber && (
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-5 md:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Resumen del turno
          </p>

          <div className="mt-4 grid gap-2 text-neutral-300 sm:grid-cols-2">
            <p>
              Servicio:{" "}
              <strong className="text-white">
                {selectedService.name}
              </strong>
            </p>

            <p>
              Barbero:{" "}
              <strong className="text-white">
                {selectedBarber.name}
              </strong>
            </p>

            <p>
              Fecha:{" "}
              <strong className="text-white">
                {formatDate(date)}
              </strong>
            </p>

            <p>
              Horario:{" "}
              <strong className="text-white">
                {time}
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* CONFIRMAR */}
      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="mt-2 rounded-lg bg-red-600 px-7 py-4 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 md:col-span-2"
      >
        CONFIRMAR TURNO
      </button>
    </div>
  );
}

function generateAvailableTimes(
  date: string,
  serviceDuration: number
) {
  const times: string[] = [];

  const openingMinutes = OPENING_HOUR * 60;
  const closingMinutes = CLOSING_HOUR * 60;

  const isToday = date === getLocalDateString();

  const now = new Date();
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  for (
    let start = openingMinutes;
    start + serviceDuration <= closingMinutes;
    start += SLOT_INTERVAL
  ) {
    if (isToday && start <= currentMinutes) {
      continue;
    }

    times.push(minutesToTime(start));
  }

  return times;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
}

function getLocalDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createLocalDate(date: string) {
  const parts = date.split("-").map(Number);

  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts;

  return new Date(year, month - 1, day);
}

function formatDate(date: string) {
  const localDate = createLocalDate(date);

  if (!localDate) {
    return date;
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(localDate);
}