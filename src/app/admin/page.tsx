"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import BlockedTimesManager from "@/components/admin/BlockedTimesManager";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

type Appointment = {
  _id: string;
  service: string;
  barber: "bruno" | "santi";
  date: string;
  time: string;
  duration: number;
  price: number;
  customerName: string;
  customerPhone: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
};

type Admin = {
  id: string;
  username: string;
  name: string;
  role: "admin" | "barber";
};

const SERVICE_NAMES: Record<
  string,
  string
> = {
  "corte-cejas": "Corte + cejas",
  "corte-barba": "Corte + barba",
  barba: "Barba",
  vip: "VIP",
  "vip-barba": "VIP barba",
};

export default function AdminPage() {
  const router = useRouter();

  const [admin, setAdmin] =
    useState<Admin | null>(null);

  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(getToday());

  const [
    barberFilter,
    setBarberFilter,
  ] = useState<
    "all" | "bruno" | "santi"
  >("all");

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ========================================
  // CARGAR TURNOS
  // ========================================

  const loadAppointments =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/appointments?date=${selectedDate}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (
          response.status === 401
        ) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "No se pudieron cargar los turnos"
          );
        }

        setAppointments(
          data.appointments || []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error cargando los turnos"
        );
      } finally {
        setLoading(false);
      }
    }, [selectedDate, router]);

  // ========================================
  // VERIFICAR SESIÓN
  // ========================================

  useEffect(() => {
    async function checkSession() {
      try {
        const response =
          await fetch(
            `${API_URL}/api/admin/me`,
            {
              credentials:
                "include",

              cache: "no-store",
            }
          );

        if (!response.ok) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        const data =
          await response.json();

        setAdmin(data.admin);
      } catch {
        router.replace(
          "/admin/login"
        );
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [router]);

  // ========================================
  // CARGAR TURNOS CUANDO HAY SESIÓN
  // ========================================

 useEffect(() => {
  if (!admin) {
    return;
  }

  const timeoutId = window.setTimeout(() => {
    void loadAppointments();
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [admin, loadAppointments]);
  // ========================================
  // LOGOUT
  // ========================================

  async function handleLogout() {
    try {
      await fetch(
        `${API_URL}/api/admin/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } finally {
      router.replace(
        "/admin/login"
      );

      router.refresh();
    }
  }

  // ========================================
  // FILTROS Y ESTADÍSTICAS
  // ========================================

  const filteredAppointments =
    useMemo(() => {
      if (
        barberFilter === "all"
      ) {
        return appointments;
      }

      return appointments.filter(
        (appointment) =>
          appointment.barber ===
          barberFilter
      );
    }, [
      appointments,
      barberFilter,
    ]);

  const totalRevenue =
    useMemo(() => {
      return filteredAppointments.reduce(
        (
          total,
          appointment
        ) =>
          total +
          appointment.price,
        0
      );
    }, [filteredAppointments]);

  const brunoAppointments =
    appointments.filter(
      (appointment) =>
        appointment.barber ===
        "bruno"
    ).length;

  const santiAppointments =
    appointments.filter(
      (appointment) =>
        appointment.barber ===
        "santi"
    ).length;

  // ========================================
  // VERIFICANDO LOGIN
  // ========================================

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-500">
            Monkey Barber&apos;s
          </p>

          <p className="mt-3 text-neutral-500">
            Verificando sesión...
          </p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="min-h-screen bg-neutral-950" />
    );
  }

  // ========================================
  // PANEL
  // ========================================

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HEADER */}

      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
              Monkey Barber&apos;s
            </p>

            <h1 className="mt-1 text-2xl font-black">
              Panel de administración
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">
                Hola, {admin.name}
              </p>

              <p className="text-xs text-neutral-500">
                {admin.role ===
                "admin"
                  ? "Administrador"
                  : "Barbero"}
              </p>
            </div>

            <Link
              href="/"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:border-white/30 hover:text-white"
            >
              Ver sitio
            </Link>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-600 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* TITULO */}

        <section className="mb-8">
          <p className="text-sm font-semibold text-red-500">
            Agenda
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            Turnos del día
          </h2>

          <p className="mt-2 text-neutral-400">
            Administrá las reservas
            de Bruno y Santi.
          </p>
        </section>

        {/* FILTROS */}

        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black p-5 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-xs">
            <label
              htmlFor="admin-date"
              className="mb-2 block text-sm font-semibold text-neutral-300"
            >
              Fecha
            </label>

            <input
              id="admin-date"
              type="date"
              value={
                selectedDate
              }
              onChange={(
                event
              ) =>
                setSelectedDate(
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-300">
              Barbero
            </p>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={
                  barberFilter ===
                  "all"
                }
                onClick={() =>
                  setBarberFilter(
                    "all"
                  )
                }
              >
                Todos
              </FilterButton>

              <FilterButton
                active={
                  barberFilter ===
                  "bruno"
                }
                onClick={() =>
                  setBarberFilter(
                    "bruno"
                  )
                }
              >
                Bruno
              </FilterButton>

              <FilterButton
                active={
                  barberFilter ===
                  "santi"
                }
                onClick={() =>
                  setBarberFilter(
                    "santi"
                  )
                }
              >
                Santi
              </FilterButton>
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Turnos"
            value={filteredAppointments.length.toString()}
          />

          <StatCard
            label="Ingresos previstos"
            value={`$${totalRevenue.toLocaleString(
              "es-AR"
            )}`}
          />

          <StatCard
            label="Bruno"
            value={`${brunoAppointments} turnos`}
          />

          <StatCard
            label="Santi"
            value={`${santiAppointments} turnos`}
          />
        </section>
        {/* BLOQUEOS DE AGENDA */}

          <BlockedTimesManager
            selectedDate={selectedDate}
          />

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {/* CARGANDO */}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-black p-10 text-center">
            <p className="text-neutral-400">
              Cargando turnos...
            </p>
          </div>
        )}

        {/* SIN TURNOS */}

        {!loading &&
          !error &&
          filteredAppointments.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black p-12 text-center">
              <div className="text-4xl">
                💈
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No hay turnos
              </h3>

              <p className="mt-2 text-neutral-500">
                No hay reservas para
                esta fecha y barbero.
              </p>
            </div>
          )}

        {/* LISTA DE TURNOS */}

        {!loading &&
          !error &&
          filteredAppointments.length >
            0 && (
            <section className="space-y-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {formatFullDate(
                    selectedDate
                  )}
                </h3>

                <button
                  type="button"
                  onClick={
                    loadAppointments
                  }
                  className="text-sm font-semibold text-red-500 transition hover:text-red-400"
                >
                  Actualizar
                </button>
              </div>

              {filteredAppointments.map(
                (
                  appointment
                ) => (
                  <AppointmentCard
                    key={
                      appointment._id
                    }
                    appointment={
                      appointment
                    }
                    onCancelled={
                      loadAppointments
                    }
                  />
                )
              )}
            </section>
          )}
      </div>
    </main>
  );
}

// ==========================================
// TARJETA DE TURNO
// ==========================================

function AppointmentCard({
  appointment,
  onCancelled,
}: {
  appointment: Appointment;
  onCancelled: () => Promise<void>;
}) {
  const router = useRouter();
  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const barberName =
    appointment.barber ===
    "bruno"
      ? "Bruno"
      : "Santi";

  const serviceName =
    SERVICE_NAMES[
      appointment.service
    ] || appointment.service;

  async function handleCancel() {
    const confirmed =
      window.confirm(
        `¿Cancelar el turno de ${appointment.customerName} a las ${appointment.time}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      const response =
        await fetch(
          `${API_URL}/api/appointments/${appointment._id}/cancel`,
          {
            method: "PATCH",
            credentials:
              "include",
          }
        );

      if (
      response.status === 401
) {
      router.replace(
     "/admin/login"
  ); 

  return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "No se pudo cancelar el turno"
        );
      }

      await onCancelled();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Error cancelando el turno"
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black transition hover:border-white/20">
      <div className="flex flex-col md:flex-row">
        {/* HORA */}

        <div className="flex min-w-32 items-center justify-center bg-red-600 px-6 py-6 md:py-0">
          <div className="text-center">
            <p className="text-3xl font-black">
              {appointment.time}
            </p>

            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-red-100">
              {
                appointment.duration
              }{" "}
              min
            </p>
          </div>
        </div>

        {/* DATOS */}

        <div className="flex flex-1 flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-xl font-black">
                {
                  appointment.customerName
                }
              </h4>

              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                Confirmado
              </span>
            </div>

            <p className="mt-2 font-semibold text-red-500">
              {serviceName}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
              <p>
                Barbero:{" "}
                <strong className="text-white">
                  {barberName}
                </strong>
              </p>

              <p>
                Duración:{" "}
                <strong className="text-white">
                  {
                    appointment.duration
                  }{" "}
                  min
                </strong>
              </p>
            </div>
          </div>

          {/* PRECIO / WHATSAPP / CANCELAR */}

          <div className="lg:text-right">
            <p className="text-2xl font-black">
              $
              {appointment.price.toLocaleString(
                "es-AR"
              )}
            </p>

            <a
              href={`https://wa.me/${normalizeWhatsappPhone(
                appointment.customerPhone
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm font-semibold text-green-400 transition hover:text-green-300"
            >
              WhatsApp:{" "}
              {
                appointment.customerPhone
              }
            </a>

            <button
              type="button"
              onClick={
                handleCancel
              }
              disabled={
                cancelling
              }
              className="mt-4 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelling
                ? "Cancelando..."
                : "Cancelar turno"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ==========================================
// TARJETAS DE ESTADÍSTICAS
// ==========================================

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-6">
      <p className="text-sm font-semibold text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// BOTONES DE FILTRO
// ==========================================

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-5 py-3 text-sm font-bold transition ${
        active
          ? "bg-red-600 text-white"
          : "border border-white/10 bg-neutral-950 text-neutral-400 hover:border-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// ==========================================
// HELPERS
// ==========================================

function getToday() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatFullDate(
  date: string
) {
  const [year, month, day] =
    date.split("-").map(Number);

  const localDate = new Date(
    year,
    month - 1,
    day
  );

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(localDate);
}

function normalizeWhatsappPhone(
  phone: string
) {
  const digits =
    phone.replace(/\D/g, "");

  if (
    digits.startsWith("54")
  ) {
    return digits;
  }

  return `54${digits}`;
}