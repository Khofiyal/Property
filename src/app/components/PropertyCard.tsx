"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, MapPin, Maximize2, MessageCircle } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: string | number | bigint;
    priceFormatted: string;
    type: string;
    category: string;
    status: string;
    bedrooms: number | null;
    bathrooms: number | null;
    landArea: number | null;
    buildingArea: number | null;
    city: string;
    district: string | null;
    agentPhone: string;
    images: { url: string }[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const isSold = property.status === "SOLD";

  return (
    <article
      key={property.id}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-2 shadow-sm transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-md"
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-[calc(1.75rem-0.375rem)] border border-[var(--border)] bg-[var(--surface-card)]">
        {/* Image Box */}
        <Link href={`/property/${property.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-subtle)]">
          <Image
            src={property.images?.[0]?.url ?? "/globe.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/70 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isSold
                  ? "bg-red-600 text-white"
                  : property.type === "DIJUAL"
                  ? "bg-[var(--gold)] text-[var(--bg)]"
                  : "bg-blue-600 text-white"
              }`}
            >
              {isSold ? "Terjual" : property.type}
            </span>
            <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
              {property.category}
            </span>
          </div>

          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white drop-shadow">
            <MapPin className="h-3.5 w-3.5 text-[var(--gold)] stroke-[2]" />
            {property.city}{property.district ? `, ${property.district}` : ""}
          </span>
        </Link>

        {/* Information Body */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <Link href={`/property/${property.slug}`}>
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--gold)]">
                {property.title}
              </h3>
            </Link>

            {/* Specs */}
            <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-4 text-xs text-[var(--text-secondary)]">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5 text-[var(--gold)] stroke-[1.8]" />
                  {property.bedrooms} KT
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5 text-[var(--gold)] stroke-[1.8]" />
                  {property.bathrooms} KM
                </span>
              )}
              {property.landArea != null && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5 text-[var(--gold)] stroke-[1.8]" />
                  LT {property.landArea}m²
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions & Price */}
          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Harga
              </span>
              <p className="text-base font-bold text-[var(--gold)]">
                {property.priceFormatted}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${property.agentPhone || "6281291300412"}?text=Halo%20Enci,%20saya%20tertarik%20dengan%20properti:%20${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat WhatsApp untuk ${property.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-primary)] transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--bg)]"
              >
                <MessageCircle className="h-4 w-4 stroke-[1.8]" />
              </a>
              <Link
                href={`/property/${property.slug}`}
                aria-label={`Detail untuk ${property.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)] text-[var(--bg)] transition-transform hover:scale-105 active:scale-95"
              >
                <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}