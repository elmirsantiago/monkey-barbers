import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* HERO */}
      <section
        id="inicio"
        className="flex min-h-screen items-center justify-center px-6 pt-28"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.35em] text-red-500">
              Barbería · Rosario
            </p>

            <h1 className="text-5xl font-black leading-none sm:text-6xl lg:text-8xl">
              TU ESTILO.
              <br />
              <span className="text-neutral-400">NUESTRA</span>
              <br />
              PRECISIÓN.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-400">
              Cortes, barba y estilo en Monkey Barber&apos;s. Elegí tu servicio,
              tu barbero y reservá tu próximo turno online.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#reservar"
                className="rounded-md bg-red-600 px-7 py-4 font-bold transition hover:bg-red-700"
              >
                RESERVAR TURNO
              </a>

              <a
                href="#servicios"
                className="rounded-md border border-white/20 px-7 py-4 font-bold transition hover:bg-white hover:text-black"
              >
                VER SERVICIOS
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-400">
              <span>📍 Mendoza 7065</span>
              <span>🕙 Mar - Sáb · 10:00 - 19:00</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-600/20 blur-3xl" />

              <Image
                src="/images/logo.jpg"
                alt="Logo Monkey Barber's"
                width={550}
                height={550}
                className="relative w-full max-w-[520px] rounded-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section
        id="servicios"
        className="border-t border-white/10 bg-neutral-950 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-red-500">
              Monkey Barber&apos;s
            </p>

            <h2 className="text-4xl font-black sm:text-5xl">
              NUESTROS SERVICIOS
            </h2>

            <p className="mt-4 max-w-2xl text-neutral-400">
              Elegí el servicio que necesitás y reservá tu turno con Bruno o
              Santi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              name="Corte + cejas"
              price="$15.000"
              duration="30 min"
            />

            <ServiceCard
              name="Corte + barba"
              price="$17.000"
              duration="40 min"
            />

            <ServiceCard
              name="Barba"
              price="$10.000"
              duration="20 min"
            />

            <ServiceCard
              name="VIP"
              price="$12.000"
              duration="30 min"
            />

            <ServiceCard
              name="VIP barba"
              price="$14.000"
              duration="40 min"
            />
          </div>
        </div>
      </section>

      {/* BARBEROS */}
      <section
        id="barberos"
        className="border-t border-white/10 bg-black px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-red-500">
              Nuestro equipo
            </p>

            <h2 className="text-4xl font-black sm:text-5xl">
              ELEGÍ TU BARBERO
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
              Reservá tu turno con Bruno o Santi y elegí el profesional que
              prefieras.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <BarberCard
              name="Bruno"
              initials="B"
              description="Cortes, barba y estilo con atención personalizada."
            />

            <BarberCard
              name="Santi"
              initials="S"
              description="Precisión, detalle y estilo en cada servicio."
            />
          </div>
        </div>
      </section>

      {/* RESERVAS */}
      <section
        id="reservar"
        className="border-t border-white/10 bg-neutral-950 px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-red-500">
              Tu próximo corte
            </p>

            <h2 className="text-4xl font-black sm:text-5xl">
              RESERVÁ TU TURNO
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
              Elegí tu servicio, barbero, fecha y horario para reservar tu
              próximo turno.
            </p>
          </div>

          <div className="grid gap-6 rounded-2xl border border-white/10 bg-black p-6 md:grid-cols-2 lg:p-10">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Servicio
              </label>

              <select className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500">
                <option>Seleccioná un servicio</option>
                <option>Corte + cejas</option>
                <option>Corte + barba</option>
                <option>Barba</option>
                <option>VIP</option>
                <option>VIP barba</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Barbero
              </label>

              <select className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500">
                <option>Seleccioná un barbero</option>
                <option>Bruno</option>
                <option>Santi</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Fecha
              </label>

              <input
                type="date"
                className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Horario
              </label>

              <select className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-red-500">
                <option>Seleccioná un horario</option>
                <option>10:00</option>
                <option>10:30</option>
                <option>11:00</option>
                <option>11:30</option>
                <option>12:00</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Nombre
              </label>

              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-300">
                Teléfono
              </label>

              <input
                type="tel"
                placeholder="Tu número de WhatsApp"
                className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
              />
            </div>

            <button
              type="button"
              className="mt-2 rounded-lg bg-red-600 px-7 py-4 font-bold transition hover:bg-red-700 md:col-span-2"
            >
              CONFIRMAR TURNO
            </button>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        className="border-t border-white/10 bg-black px-6 py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-red-500">
              Visitá Monkey Barber&apos;s
            </p>

            <h2 className="text-4xl font-black sm:text-5xl">CONTACTO</h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-400">
              Estamos en Mendoza 7065, Rosario. Atendemos de martes a sábado de
              10:00 a 19:00.
            </p>

            <div className="mt-10 space-y-5">
              <ContactItem
                title="WhatsApp"
                value="341 719-7599"
                href="https://wa.me/543417197599"
              />

              <ContactItem
                title="Instagram"
                value="@monkeybarbers"
                href="https://www.instagram.com/monkeybarbers"
              />

              <ContactItem
                title="Dirección"
                value="Mendoza 7065 · Rosario"
                href="https://www.google.com/maps/search/?api=1&query=Mendoza+7065+Rosario"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <div className="flex min-h-[420px] items-center justify-center p-10 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
                  Mendoza 7065
                </p>

                <h3 className="mt-4 text-3xl font-black">
                  MONKEY BARBER&apos;S
                </h3>

                <p className="mx-auto mt-4 max-w-md text-neutral-400">
                  Tocá el botón para abrir la ubicación directamente en Google
                  Maps.
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Mendoza+7065+Rosario"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-block rounded-md border border-white/20 px-7 py-4 font-bold transition hover:bg-white hover:text-black"
                >
                  VER UBICACIÓN
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-neutral-950 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Monkey Barber's"
              width={55}
              height={55}
              className="rounded-full"
            />

            <div>
              <p className="font-bold">MONKEY BARBER&apos;S</p>
              <p className="text-sm text-neutral-500">
                Rosario · EST. 2022
              </p>
            </div>
          </div>

          <p className="text-sm text-neutral-500">
            © 2026 Monkey Barber&apos;s. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

type ServiceCardProps = {
  name: string;
  price: string;
  duration: string;
};

function ServiceCard({
  name,
  price,
  duration,
}: ServiceCardProps) {
  return (
    <article className="group rounded-xl border border-white/10 bg-black p-7 transition duration-300 hover:-translate-y-1 hover:border-red-600/60">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-neutral-500">{duration}</p>
          <h3 className="text-2xl font-bold">{name}</h3>
        </div>

        <span className="text-2xl font-black text-red-500">{price}</span>
      </div>

      <a
        href="#reservar"
        className="inline-flex items-center gap-2 font-semibold text-neutral-300 transition group-hover:text-white"
      >
        Reservar este servicio
        <span className="text-red-500">→</span>
      </a>
    </article>
  );
}

type BarberCardProps = {
  name: string;
  initials: string;
  description: string;
};

function BarberCard({
  name,
  initials,
  description,
}: BarberCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 transition duration-300 hover:-translate-y-1 hover:border-red-600/60">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
        <div className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-red-600/50 bg-neutral-900 text-6xl font-black text-red-500 shadow-2xl">
          {initials}
        </div>
      </div>

      <div className="p-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
          Barber
        </p>

        <h3 className="text-3xl font-black">{name}</h3>

        <p className="mt-4 leading-7 text-neutral-400">{description}</p>

        <a
          href="#reservar"
          className="mt-7 inline-flex items-center gap-2 font-bold transition hover:text-red-500"
        >
          Reservar con {name}
          <span className="text-red-500">→</span>
        </a>
      </div>
    </article>
  );
}

type ContactItemProps = {
  title: string;
  value: string;
  href: string;
};

function ContactItem({
  title,
  value,
  href,
}: ContactItemProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-white/10 bg-neutral-950 p-5 transition hover:border-red-600/50"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold">{value}</p>
    </a>
  );
}