import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/utils";
import { ArrowUpRight, MapPin } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProperty(slug: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (!property) return null;
    return {
      ...property,
      price: property.price.toString(),
    };
  } catch (error) {
    console.error("Database connection error in getProperty:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Properti Tidak Ditemukan" };

  const formattedPrice = rupiah(property.price);
  const title = `${property.title} - ${formattedPrice} | Property By Enci`;
  const description = `${property.category} ${property.type} di ${property.city}. Hubungi Enci via WA.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: property.images[0]?.url || "/globe.svg", width: 1200, height: 630, alt: property.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [property.images[0]?.url || "/globe.svg"],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  const waText = encodeURIComponent(
    `Halo Enci, saya tertarik dengan properti ini: ${property.title}\nLink: ${process.env.NEXT_PUBLIC_BASE_URL || "https://enci-property.com"}/property/${property.slug}`
  );
  const waUrl = `https://wa.me/${property.agentPhone}?text=${waText}`;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--bg)] shadow-sm">
              <svg className="h-3.5 w-3.5 stroke-[1.8]" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16m-8-8h16M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 002-2v8m12 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              PROPERTY BY ENCI
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              {property.type === "DIJUAL"
                ? "DIJUAL"
                : property.type === "DISEWAKAN"
                  ? "DISEWAKAN"
                  : ""}
            </span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              {property.city}
            </span>
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="mx-auto max-w-4xl bg-[var(--bg)] pb-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg)]">
          {property.images.length > 0 ? (
            <>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg)]">
                {property.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="absolute inset-0 transition-opacity duration-500 ease-out"
                    style={{ opacity: 1, transitionDelay: `${i * 100}ms` }}
                  >
                    <Image
                      src={img.url}
                      alt={`${property.title} - Foto ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div>
                  <span className="rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--bg)]">
                    Unggulan
                  </span>
                  <p className="mt-1 line-clamp-1 text-base font-semibold text-white">
                    {property.title}
                  </p>
                </div>

                {property.images.length > 0 && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                    <svg className="h-4 w-4 stroke-[2]" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-transparent to-transparent">
              <svg className="absolute inset-0 w-full h-full fill-none stroke-[var(--gold)] strokeWidth={1.8}" d="M4 4h16m-8-8h16M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 002-2v8m12 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </div>
          )}
        </div>
      </section>

      {/* Detail Content */}
      <section className="mx-auto max-w-4xl px-4 py-6 md:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 shadow-sm md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-start md:justify-between">
            <div>
              <span className="rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--bg)]">
                {property.category}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {property.title}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                📍 {property.city}
                {property.district ? `, ${property.district}` : ""}
              </p>
            </div>

            <div className="mt-2 md:mt-0 md:text-right text-xs text-[var(--text-muted)]">
              <svg className="h-4 w-4 stroke-[1.8]" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16m-8-8h16M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 002-2v8m12 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span>Hubungi Enci via WA</span>
            </div>
          </div>

          {/* Key Specs Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 p-4 sm:grid-cols-4">
            {property.bedrooms != null && (
              <div className="text-center">
                <span className="text-xs text-zinc-500">Kamar Tidur</span>
                <p className="text-lg font-bold text-zinc-800">{property.bedrooms} KT</p>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="text-center">
                <span className="text-xs text-zinc-500">Kamar Mandi</span>
                <p className="text-lg font-bold text-zinc-800">{property.bathrooms} KM</p>
              </div>
            )}
            {property.landArea != null && (
              <div className="text-center">
                <span className="text-xs text-zinc-500">Luas Tanah</span>
                <p className="text-lg font-bold text-zinc-800">{property.landArea} m²</p>
              </div>
            )}
            {property.buildingArea != null && (
              <div className="text-center">
                <span className="text-xs text-zinc-500">Luas Bangunan</span>
                <p className="text-lg font-bold text-zinc-800">{property.buildingArea} m²</p>
              </div>
            )}
          </div>

          {/* Full Specifications Table */}
          <div className="mt-8 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
            <div className="flex justify-between p-3 text-sm">
              <span className="text-zinc-500">Tipe Listing</span>
              <span className="font-semibold text-zinc-800">{property.type}</span>
            </div>
            <div className="flex justify-between p-3 text-sm">
              <span className="text-zinc-500">Kategori</span>
              <span className="font-semibold text-zinc-800">{property.category}</span>
            </div>
            <div className="flex justify-between p-3 text-sm">
              <span className="text-zinc-500">Status</span>
              <span className="font-semibold text-zinc-800">{property.status}</span>
            </div>
            {property.certificate && (
              <div className="flex justify-between p-3 text-sm">
                <span className="text-zinc-500">Sertifikat</span>
                <span className="font-semibold text-zinc-800">{property.certificate}</span>
              </div>
            )}
            {property.electricity != null && (
              <div className="flex justify-between p-3 text-sm">
                <span className="text-zinc-500">Daya Listrik</span>
                <span className="font-semibold text-zinc-800">{property.electricity} VA</span>
              </div>
            )}
            {property.floors != null && (
              <div className="flex justify-between p-3 text-sm">
                <span className="text-zinc-500">Jumlah Lantai</span>
                <span className="font-semibold text-zinc-800">{property.floors}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Deskripsi</h2>
        <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)]">
          {property.description || "Tidak ada deskripsi tambahan."}
        </div>
      </section>

      {/* Sticky Bottom Bar Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs text-[var(--text-muted)]">Agen Properti</span>
            <p className="text-sm font-bold text-[var(--text-primary)]">{property.agentName}</p>
          </div>
          <a
            href={`https://wa.me/${property.agentPhone || "6281291300412"}?text=Halo%20Enci,%20saya%20tertarik%20dengan%20properti:%20${encodeURIComponent(property.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--gold)] font-bold text-[var(--bg)] shadow-md hover:bg-[var(--gold-light)] active:scale-[0.98]"
          >
            💬 Hubungi {property.agentName} via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}