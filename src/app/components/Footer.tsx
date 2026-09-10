import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12 text-center text-xs text-[var(--text-muted)]">
      <div className="mx-auto max-w-6xl px-4 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Building2 className="h-4 w-4 text-[var(--gold)] stroke-[1.8]" />
          <span className="font-bold tracking-widest text-[var(--text-primary)]">
            PROPERTY BY ENCI
          </span>
        </div>
        <p className="mx-auto max-w-md leading-relaxed">
          Layanan katalog properti pilihan dengan konsultasi langsung dan tepercaya.
        </p>
        <div className="pt-2 text-[11px]">
          © 2026 Property By Enci. All rights reserved.
        </div>
      </div>
    </footer>
  );
}