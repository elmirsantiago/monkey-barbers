"use client";

import { useState } from "react";

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

export default function BookingForm() {
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState("");

  const selectedService = services.find(
    (service) => service.id === serviceId
  );

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
          onChange={(event) => setServiceId(event.target.value)}
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
          onChange={(event) => setBarberId(event.target.value)}
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
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500"
        />
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
          disabled={!serviceId || !barberId || !date}
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="">
            {!serviceId || !barberId || !date
              ? "Completá los datos anteriores"
              : "Próximo paso: calcular disponibilidad"}
          </option>
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
            </div>

            <p className="text-2xl font-black text-red-500">
              ${selectedService.price.toLocaleString("es-AR")}
            </p>
          </div>
        </div>
      )}

      {/* DATOS CLIENTE */}
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
          placeholder="Tu nombre"
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
        />
      </div>

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
          placeholder="Tu número de WhatsApp"
          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
        />
      </div>

      <button
        type="button"
        disabled
        className="mt-2 rounded-lg bg-red-600 px-7 py-4 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 md:col-span-2"
      >
        CONFIRMAR TURNO
      </button>
    </div>
  );
}