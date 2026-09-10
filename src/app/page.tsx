import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/utils";
import Filters from "./filters";
import Header from "./components/Header";
import PropertyGrid from "./components/PropertyGrid";
import Footer from "./components/Footer";

async function getProperties(filters: { [key: string]: string | string[] | undefined }) {
  try {
    const type = filters.type as string | undefined;
    const category = filters.category as string | undefined;
    const status = filters.status as string | undefined;
    const city = filters.city as string | undefined;
    const q = filters.q as string | undefined;
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    if (city) where.city = { contains: city };
    if (q) where.OR = [{ title: { contains: q } }, { city: { contains: q } }];

    return await prisma.property.findMany({
      where,
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database connection error in getProperties:", error);
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  const properties = await getProperties(await searchParams);
  const heroImage = properties[0]?.images?.[0]?.url;

  // Format harga di Server Component sebelum dikirim ke Client
  const formattedProperties = properties.map((p) => ({
    ...p,
    priceFormatted: rupiah(p.price),
  }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">

      <Header />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Left Text Column */}
          <div className="space-y-6 lg:col-span-7" data-scroll-reveal="fade-up">
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
                  <svg className="h-3.5 w-3.5 stroke-[2]" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
              <svg className="h-4 w-4 stroke-[1.8]" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16m-8-8h16M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v8m12 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span>Didukung respon cepat via WhatsApp</span>
            </div>
          </div>

          {/* Right Hero Image Card (Double-Bezel) */}
          <div className="lg:col-span-5" data-scroll-reveal="fade-up" style={{ transitionDelay: '100ms' }}>
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-2 shadow-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[var(--surface-muted)] sm:aspect-[4/3] lg:aspect-[1/1]">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt="Properti Unggulan"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--surface-subtle)]">
                    <svg className="h-12 w-12 text-[var(--text-muted)] stroke-[1.2]" fill="none" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16m-8-8h16M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 002-2v8m12 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--bg)]">
                      Unggulan
                    </span>
                    <p className="mt-1 line-clamp-1 text-base font-semibold text-white">
                      {properties[0]?.title || "Katalog Properti Terbaru"}
                    </p>
                  </div>

                  {heroImage && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                      <svg className="h-4 w-4 stroke-[2]" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Filters />

      <section id="listing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" data-scroll-reveal="fade-up">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Katalog Properti
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Pilihan listing rumah, ruko, tanah, dan apartemen aktif.
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--gold)]">
            Total {properties.length} Properti
          </span>
        </div>

        <PropertyGrid properties={formattedProperties} />
      </section>

      <Footer />
    </main>
  );
}