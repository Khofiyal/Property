import Image from "next/image";
import Link from "next/link";

async function getProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?limit=8`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

function rupiah(n: bigint | number) {
  const val = typeof n === "bigint" ? Number(n) : n;
  return `Rp ${val.toLocaleString("id-ID")}`;
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[420px] bg-zinc-900">
        <Image
          src="/globe.svg"
          alt="Hero"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Katalog Properti Enci
          </h1>
          <p className="max-w-xl text-lg text-zinc-300">
            Rumah, Ruko, Tanah, dan Apartemen pilihan. Hubungi langsung via WhatsApp.
          </p>

          <div className="w-full max-w-2xl rounded-2xl bg-white/10 p-4 backdrop-blur-sm md:p-6">
            <form className="flex flex-col gap-3 md:grid md:grid-cols-4 md:gap-4">
              <select className="touch-target rounded-lg bg-zinc-900 p-3 text-black">
                <option>Semua Tipe</option>
                <option>Dijual</option>
                <option>Disewakan</option>
              </select>
              <select className="touch-target rounded-lg bg-zinc-900 p-3 text-black">
                <option>Semua Kategori</option>
                <option>Rumah</option>
                <option>Ruko</option>
                <option>Tanah</option>
                <option>Apartemen</option>
              </select>
              <input
                type="text"
                placeholder="Kota / Area"
                className="touch-target rounded-lg bg-zinc-900 p-3 text-black placeholder:text-zinc-400"
              />
              <button className="touch-target rounded-lg bg-emerald-600 font-semibold text-white hover:bg-emerald-500">
                Cari
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {["Semua", "Dijual", "Disewakan", "Terjual"].map((tab) => (
            <button
              key={tab}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition-colors ${
                tab === "Semua"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Listing grid */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        {properties.length === 0 ? (
          <p className="py-12 text-center text-zinc-500">
            Properti belum tersedia. Admin belum menambahkan listing.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p: any) => (
              <Link
                key={p.id}
                href={`/property/${p.slug}`}
                className="group rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-zinc-100">
                  <Image
                    src={p.images?.[0]?.url ?? "/globe.svg"}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                    {p.type === "DIJUAL"
                      ? p.status === "SOLD"
                        ? "TERJUAL"
                        : "DIJUAL"
                      : "DISEWAKAN"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {p.city}{p.district ? ` · ${p.district}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.bedrooms != null && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium">
                        {p.bedrooms} KT
                      </span>
                    )}
                    {p.bathrooms != null && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium">
                        {p.bathrooms} KM
                      </span>
                    )}
                    {p.landArea != null && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium">
                        LT {p.landArea}m²
                      </span>
                    )}
                    {p.buildingArea != null && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium">
                        LB {p.buildingArea}m²
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xl font-bold text-emerald-700">{rupiah(p.price)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Klik untuk detail</span>
                    <span className="text-sm font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
                      WhatsApp →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-10 text-center text-sm text-zinc-500">
        <p>© 2026 Katalog Properti Enci. Hubungi <strong>+6281291300412</strong> via WhatsApp.</p>
      </footer>
    </main>
  );
}
