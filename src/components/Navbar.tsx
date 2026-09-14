"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <a
            href="#inicio"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
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

          {/* MENÚ DESKTOP */}
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

            <a href="#reservar" className="transition hover:text-red-500">
              Turnos
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

          {/* BOTÓN HAMBURGUESA */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 md:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-0.5 w-full bg-white transition ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />

              <span
                className={`h-0.5 w-full bg-white transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`h-0.5 w-full bg-white transition ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* MENÚ MOBILE */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-[500px] pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col border-t border-white/10 pt-5">
            <MobileLink href="#inicio" onClick={closeMenu}>
              Inicio
            </MobileLink>

            <MobileLink href="#servicios" onClick={closeMenu}>
              Servicios
            </MobileLink>

            <MobileLink href="#barberos" onClick={closeMenu}>
              Barberos
            </MobileLink>

            <MobileLink href="#reservar" onClick={closeMenu}>
              Turnos
            </MobileLink>

            <MobileLink href="#contacto" onClick={closeMenu}>
              Contacto
            </MobileLink>

            <a
              href="#reservar"
              onClick={closeMenu}
              className="mt-4 rounded-lg bg-red-600 px-5 py-4 text-center font-bold transition hover:bg-red-700"
            >
              RESERVAR TURNO
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

type MobileLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
};

function MobileLink({
  href,
  children,
  onClick,
}: MobileLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="border-b border-white/5 py-4 text-lg font-semibold text-neutral-200 transition hover:text-red-500"
    >
      {children}
    </a>
  );
}