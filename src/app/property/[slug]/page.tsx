import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/utils";

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

  const mainImage = property.images[0]?.url || "/globe.svg";
  const formattedPrice = rupiah(property.price);
  const title = `${property.title} - ${formattedPrice} | Property By Enci`;
  const description = `${property.category} ${property.type} di ${property.city}. ${property.bedrooms ? `${property.bedrooms} KT, ` : ""}${property.bathrooms ? `${property.bathrooms} KM, ` : ""}${property.landArea ? `LT ${property.landArea}m²` : ""}. Hubungi Enci via WA.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: mainImage, width: 1200, height: 630, alt: property.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mainImage],
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
    <main className="min-h-screen bg-zinc-50 pb-28">
      {/* Top Header / Back Button */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-zinc-950"
        >
          ← Kembali ke Katalog
        </Link>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          {property.type === "DIJUAL"
            ? property.status === "SOLD"
              ? "TERJUAL"
              : "DIJUAL"
            : "DISEWAKAN"}
        </span>
      </header>

      {/* Gallery / Carousel Section */}
      <section className="mx-auto max-w-4xl bg-black">
        {property.images.length > 0 ? (
          <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide">
            {property.images.map((img: any, i: number) => (
              <div
                key={img.id || i}
                className="relative aspect-[4/3] w-full flex-none snap-center md:aspect-[16/9]"
              >
                <Image
                  src={img.url}
                  alt={`${property.title} - Foto ${i + 1}`}
                  fill
                  className="object-contain"
                  priority={i === 0}
                />
                <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                  {i + 1} / {property.images.length}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative aspect-[4/3] w-full bg-zinc-200 md:aspect-[16/9]">
            <Image
              src="/globe.svg"
              alt="Default image"
              fill
              className="object-cover opacity-50"
            />
          </div>
        )}
      </section>

      {/* Detail Content */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                {property.category}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-zinc-900 md:text-3xl">
                {property.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                📍 {property.city}
                {property.district ? `, ${property.district}` : ""}
                {property.addressNote ? ` (${property.addressNote})` : ""}
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <span className="text-xs text-zinc-400">Harga</span>
              <p className="text-2xl font-extrabold text-emerald-700 md:text-3xl">
                {rupiah(property.price)}
              </p>
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
          <div className="mt-8">
            <h2 className="text-lg font-bold text-zinc-900">Spesifikasi Lengkap</h2>
            <div className="mt-3 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
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

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-zinc-900">Deskripsi</h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">
              {property.description || "Tidak ada deskripsi tambahan."}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white p-3 shadow-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs text-zinc-500">Agen Properti</span>
            <p className="text-sm font-bold text-zinc-800">{property.agentName}</p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-500 active:scale-[0.98]"
          >
            💬 Hubungi {property.agentName} via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
