"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, MessageCircle } from "lucide-react";
import ThemeToggle from "../theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Property By Enci home">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--bg)] shadow-sm">
            <Building2 className="h-3.5 w-3.5 stroke-[1.8]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] sm:text-xs sm:tracking-[0.2em]">
            PROPERTY BY ENCI
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <Link
            href="/admin"
            className="hidden rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--gold)] sm:block"
          >
            Admin
          </Link>

          <ThemeToggle />

          <a
            href="https://wa.me/6281291300412?text=Halo%20Enci,%20saya%20ingin%20konsultasi%20properti"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-3 py-1.5 text-xs font-bold text-[var(--bg)] shadow-sm transition-all ease-spring hover:brightness-105 active:scale-[0.98] sm:px-4 sm:py-2"
          >
            <span className="hidden sm:inline-block">Hubungi Enci</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg)]/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3 w-3 stroke-[2]" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}