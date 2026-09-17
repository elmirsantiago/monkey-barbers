"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

type Barber = "bruno" | "santi";

type BlockedTime = {
  _id: string;
  barber: Barber;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdAt: string;
};

type BlockedTimesManagerProps = {
  selectedDate: string;
};

export default function BlockedTimesManager({
  selectedDate,
}: BlockedTimesManagerProps) {
  const router = useRouter();

  const [blockedTimes, setBlockedTimes] =
    useState<BlockedTime[]>([]);

  const [barber, setBarber] =
    useState<Barber>("bruno");

  const [startTime, setStartTime] =
    useState("10:00");

  const [endTime, setEndTime] =
    useState("11:00");

  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // CARGAR BLOQUEOS MANUALMENTE
  // ==========================================

  const loadBlockedTimes =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/blocked-times?date=${selectedDate}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
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
              "No se pudieron cargar los bloqueos"
          );
        }

        setBlockedTimes(
          data.blockedTimes || []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error cargando los bloqueos"
        );
      } finally {
        setLoading(false);
      }
    }, [selectedDate, router]);

  // ==========================================
  // CARGA INICIAL / CAMBIO DE FECHA
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function fetchBlockedTimes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/blocked-times?date=${selectedDate}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
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
              "No se pudieron cargar los bloqueos"
          );
        }

        if (!cancelled) {
          setBlockedTimes(
            data.blockedTimes || []
          );
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Error cargando los bloqueos"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchBlockedTimes();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, router]);

  // ==========================================
  // CREAR BLOQUEO
  // ==========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/blocked-times`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            barber,
            date: selectedDate,
            startTime,
            endTime,
            reason,
          }),
        }
      );

      if (response.status === 401) {
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
            "No se pudo bloquear el horario"
        );
      }

      setSuccess(
        "Horario bloqueado correctamente"
      );

      setReason("");

      await loadBlockedTimes();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error bloqueando el horario"
      );
    } finally {
      setCreating(false);
    }
  }

  // ==========================================
  // ELIMINAR BLOQUEO
  // ==========================================

  async function handleDelete(
    blockedTime: BlockedTime
  ) {
    const barberName =
      blockedTime.barber === "bruno"
        ? "Bruno"
        : "Santi";

    const confirmed =
      window.confirm(
        `¿Eliminar el bloqueo de ${barberName} de ${blockedTime.startTime} a ${blockedTime.endTime}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        blockedTime._id
      );

      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/blocked-times/${blockedTime._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 401) {
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
            "No se pudo eliminar el bloqueo"
        );
      }

      setSuccess(
        "Bloqueo eliminado correctamente"
      );

      await loadBlockedTimes();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error eliminando el bloqueo"
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-black p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-500">
          Disponibilidad
        </p>

        <h3 className="mt-2 text-2xl font-black">
          Bloquear agenda
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          Bloqueá horarios en los que
          Bruno o Santi no estén
          disponibles.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* BARBERO */}

        <div>
          <label
            htmlFor="blocked-barber"
            className="mb-2 block text-sm font-semibold text-neutral-300"
          >
            Barbero
          </label>

          <select
            id="blocked-barber"
            value={barber}
            onChange={(event) =>
              setBarber(
                event.target
                  .value as Barber
              )
            }
            className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
          >
            <option value="bruno">
              Bruno
            </option>

            <option value="santi">
              Santi
            </option>
          </select>
        </div>

        {/* DESDE */}

        <div>
          <label
            htmlFor="blocked-start"
            className="mb-2 block text-sm font-semibold text-neutral-300"
          >
            Desde
          </label>

          <input
            id="blocked-start"
            type="time"
            min="10:00"
            max="19:00"
            step="600"
            value={startTime}
            onChange={(event) =>
              setStartTime(
                event.target.value
              )
            }
            required
            className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
          />
        </div>

        {/* HASTA */}

        <div>
          <label
            htmlFor="blocked-end"
            className="mb-2 block text-sm font-semibold text-neutral-300"
          >
            Hasta
          </label>

          <input
            id="blocked-end"
            type="time"
            min="10:00"
            max="19:00"
            step="600"
            value={endTime}
            onChange={(event) =>
              setEndTime(
                event.target.value
              )
            }
            required
            className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
          />
        </div>

        {/* MOTIVO */}

        <div>
          <label
            htmlFor="blocked-reason"
            className="mb-2 block text-sm font-semibold text-neutral-300"
          >
            Motivo
          </label>

          <input
            id="blocked-reason"
            type="text"
            value={reason}
            onChange={(event) =>
              setReason(
                event.target.value
              )
            }
            placeholder="Ej: Trámite"
            maxLength={100}
            className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-700 focus:border-red-500"
          />
        </div>

        {/* BOTÓN */}

        <div className="md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-red-600 px-6 py-3 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating
              ? "BLOQUEANDO..."
              : "BLOQUEAR HORARIO"}
          </button>
        </div>
      </form>

      {/* ERROR */}

      {error && (
        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ÉXITO */}

      {success && (
        <div className="mt-5 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* LISTADO */}

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h4 className="font-bold">
            Bloqueos del día
          </h4>

          <button
            type="button"
            onClick={
              loadBlockedTimes
            }
            className="text-sm font-semibold text-red-500 transition hover:text-red-400"
          >
            Actualizar
          </button>
        </div>

        {loading && (
          <p className="text-sm text-neutral-500">
            Cargando bloqueos...
          </p>
        )}

        {!loading &&
          blockedTimes.length ===
            0 && (
            <div className="rounded-xl border border-dashed border-white/10 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                No hay horarios
                bloqueados para esta
                fecha.
              </p>
            </div>
          )}

        {!loading &&
          blockedTimes.length >
            0 && (
            <div className="space-y-3">
              {blockedTimes.map(
                (blockedTime) => (
                  <div
                    key={
                      blockedTime._id
                    }
                    className="flex flex-col gap-4 rounded-xl border border-white/10 bg-neutral-950 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                          BLOQUEADO
                        </span>

                        <p className="font-bold">
                          {blockedTime.barber ===
                          "bruno"
                            ? "Bruno"
                            : "Santi"}
                        </p>
                      </div>

                      <p className="mt-3 text-xl font-black">
                        {
                          blockedTime.startTime
                        }{" "}
                        —{" "}
                        {
                          blockedTime.endTime
                        }
                      </p>

                      {blockedTime.reason && (
                        <p className="mt-1 text-sm text-neutral-500">
                          {
                            blockedTime.reason
                          }
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        blockedTime._id
                      }
                      onClick={() =>
                        handleDelete(
                          blockedTime
                        )
                      }
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId ===
                      blockedTime._id
                        ? "Eliminando..."
                        : "Eliminar bloqueo"}
                    </button>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}