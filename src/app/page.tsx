import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Monkey Barber's"
              width={65}
              height={65}
              className="rounded-full"
              priority
            />

            <div>
              <p className="text-lg font-bold tracking-wider">
                MONKEY BARBER&apos;S
              </p>
              <p className="text-xs text-neutral-400">EST. 2022</p>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#inicio" className="transition hover:text-red-500">
              Inicio
            </a>

            <a href="#servicios" className="transition hover:text-red-500">
              Servicios
            </a>

            <a href="#barberos" className="transition hover:text-red-500">
              Barberos
            </a>

            <a href="#contacto" className="transition hover:text-red-500">
              Contacto
            </a>

            <a
              href="#reservar"
              className="rounded-md bg-red-600 px-5 py-3 font-bold transition hover:bg-red-700"
            >
              RESERVAR TURNO
            </a>
          </div>
        </nav>
      </header>

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

          <h3 className="text-2xl font-bold">
            {name}
          </h3>
        </div>

        <span className="text-2xl font-black text-red-500">
          {price}
        </span>
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