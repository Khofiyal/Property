"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Property {
  id: string;
  title: string;
  slug: string;
  price: string;
  type: string;
  category: string;
  status: string;
  city: string;
  district?: string;
  agentPhone: string;
  images: { url: string }[];
  createdAt: string;
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setProperties(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "AVAILABLE" ? "SOLD" : "AVAILABLE";
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        toast.success(`Status diubah menjadi ${newStatus === "AVAILABLE" ? "Tersedia" : "Terjual"}`);
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch {
      toast.error("Gagal menghubungi server");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        toast.success("Properti dihapus");
      } else {
        toast.error("Gagal menghapus");
      }
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  function formatRupiah(n: string) {
    const num = Number(n);
    if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(0)} Miliar`;
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)} Juta`;
    return `Rp ${num.toLocaleString("id-ID")}`;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-lg text-zinc-500">Memuat...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              Dashboard Admin
            </h1>
            <p className="text-xs text-zinc-500">
              {properties.filter((p) => p.status === "AVAILABLE").length} aktif · {properties.filter((p) => p.status === "SOLD").length} terjual
            </p>
          </div>
          <Link
            href="/admin/new"
            className="touch-target rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-[0.98]"
          >
            + Tambah
          </Link>
        </div>
      </header>

      {/* Property List */}
      <section className="mx-auto mt-6 max-w-4xl px-4">
        {properties.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-zinc-500">Belum ada properti.</p>
            <Link
              href="/admin/new"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500"
            >
              Tambah Properti Pertama
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-24 w-24 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:h-28 sm:w-28">
                    <Image
                      src={p.images?.[0]?.url ?? "/globe.svg"}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-zinc-900">{p.title}</h3>
                          <p className="text-xs text-zinc-500">
                            {p.city}
                            {p.district ? ` · ${p.district}` : ""} ·{" "}
                            {p.category} · {p.type === "DIJUAL" ? "Dijual" : "Disewakan"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                            p.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.status === "AVAILABLE" ? "Tersedia" : "TERJUAL"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-emerald-700">
                        {formatRupiah(p.price)}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(p.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleStatus(p.id, p.status)}
                    className={`touch-target flex-1 rounded-lg font-bold ${
                      p.status === "AVAILABLE"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    {p.status === "AVAILABLE" ? "→ Tandai Terjual" : "→ Kembalikan Tersedia"}
                  </button>
                  <Link
                    href={`/admin/edit/${p.id}`}
                    className="touch-target flex-1 rounded-lg border border-zinc-300 bg-white font-bold text-zinc-700 hover:bg-zinc-50"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="touch-target flex-1 rounded-lg bg-red-50 font-bold text-red-600 hover:bg-red-100"
                  >
                    🗑️ Hapus
                  </button>
                  <a
                    href={`https://wa.me/${p.agentPhone}?text=Halo%20Enci,%20saya%20tertarik%20dengan%20properti%20ini:%20${p.title}%20${process.env.NEXT_PUBLIC_BASE_URL || ""}/property/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target flex-1 rounded-lg bg-green-500 font-bold text-white hover:bg-green-600"
                  >
                    📲 WA
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
