import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, ShieldCheck, Sparkles } from "lucide-react";

interface HeroProps {
  heroImage?: string;
  featuredTitle?: string;
}

export default function Hero({ heroImage, featuredTitle }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Text Column */}
        <div className="space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 py-1 text-xs font-medium uppercase tracking-widest text-[var(--gold)]">
            <Sparkles className="h-3.5 w-3.5 stroke-[1.8]" />
            <span>Listing Resmi & Terverifikasi</span>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Properti pilihan untuk ruang hidup ideal Anda.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Katalog rumah, ruko, tanah, dan apartemen dengan konsultasi personal langsung bersama Enci.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#listing"
              className="group flex items-center gap-3 rounded-full bg-[var(--gold)] px-6 py-3.5 text-sm font-bold text-[var(--bg)] shadow-md transition-all ease-spring hover:brightness-105 active:scale-[0.98]"
            >
              <span>Lihat Katalog</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg)]/10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2]" />
              </span>
            </a>

            <a
              href="tel:+6281291300412"
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--gold)]"
            >
              Hubungi Telepon
            </a>
          </div>

          <div className="flex items-center gap-3 pt-6 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="h-4 w-4 text-[var(--gold)] stroke-[1.8]" />
            <span>Didukung respon cepat via WhatsApp</span>
          </div>
        </div>

        {/* Right Hero Image Card (Double-Bezel) */}
        <div className="lg:col-span-5">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-2 shadow-xl">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[var(--surface-muted)] sm:aspect-[4/3] lg:aspect-[1/1]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Properti Unggulan"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--surface-subtle)]">
                  <Building2 className="h-12 w-12 text-[var(--text-muted)] stroke-[1.2]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div>
                  <span className="rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--bg)]">
                    Unggulan
                  </span>
                  <p className="mt-1 line-clamp-1 text-base font-semibold text-white">
                    {featuredTitle || "Katalog Properti Terbaru"}
                  </p>
                </div>

                {heroImage && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                    <ArrowUpRight className="h-4 w-4 stroke-[2]" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}