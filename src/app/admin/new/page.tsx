"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { priceToNumber } from "@/lib/utils";

interface ImagePreview {
  url: string;
  publicId: string;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    type: "DIJUAL",
    category: "RUMAH",
    status: "AVAILABLE",
    bedrooms: "",
    bathrooms: "",
    landArea: "",
    buildingArea: "",
    certificate: "",
    electricity: "",
    floors: "1",
    city: "",
    district: "",
    addressNote: "",
    agentName: "Enci",
    agentPhone: "6281291300412",
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const uploaded: ImagePreview[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url && data.publicId) uploaded.push(data);
      }
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} foto diunggah`);
    } catch {
      toast.error("Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        price: priceToNumber(form.price).toString(),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        landArea: form.landArea ? Number(form.landArea) : null,
        buildingArea: form.buildingArea ? Number(form.buildingArea) : null,
        electricity: form.electricity ? Number(form.electricity) : null,
        floors: Number(form.floors) || 1,
        images,
      };
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("Properti berhasil ditambahkan!");
        router.push("/admin");
      } else {
        const err = await res.json();
        toast.error(err.error || "Gagal menyimpan");
      }
    } catch {
      toast.error("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-8">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">
            Tambah Properti Baru
          </h1>
          <button
            onClick={() => router.back()}
            className="touch-target rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100"
          >
            ← Kembali
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-4xl px-4 space-y-6">
        {/* Image Upload Section */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Foto Properti</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Pilih dari galeri HP atau kamera (bisa multi pilih)
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="touch-target inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-6 text-zinc-500 transition-colors hover:border-emerald-500 hover:bg-emerald-50 sm:w-auto">
              📷 Pilih Foto
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {uploading && <span className="text-sm text-zinc-500">Mengunggah...</span>}
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                  <Image src={img.url} alt={`Preview ${i + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Basic Info */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Informasi Dasar</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Judul *</span>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="Contoh: Rumah Indah BSD"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="otomatis dari judul"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Deskripsi</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="Deskripsi properti..."
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Kategori *</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              >
                <option value="RUMAH">Rumah</option>
                <option value="RUKO">Ruko</option>
                <option value="TANAH">Tanah</option>
                <option value="APARTEMEN">Apartemen</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Tipe Listing *</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              >
                <option value="DIJUAL">Dijual</option>
                <option value="DISEWAKAN">Disewakan</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Harga (Rp) *</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="Contoh: 1500000000"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="SOLD">Terjual</option>
              </select>
            </label>
          </div>
        </section>

        {/* Spesifikasi (Expandable) */}
        <details className="rounded-2xl bg-white p-6 shadow-sm">
          <summary className="cursor-pointer text-lg font-bold text-zinc-900">
            Spesifikasi Detail (opsional) ▾
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Kamar Tidur (KT)</span>
              <input
                type="number"
                min={0}
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Kamar Mandi (KM)</span>
              <input
                type="number"
                min={0}
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Luas Tanah (m²)</span>
              <input
                type="number"
                min={0}
                value={form.landArea}
                onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Luas Bangunan (m²)</span>
              <input
                type="number"
                min={0}
                value={form.buildingArea}
                onChange={(e) => setForm({ ...form, buildingArea: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Sertifikat</span>
              <select
                value={form.certificate}
                onChange={(e) => setForm({ ...form, certificate: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              >
                <option value="">Pilih</option>
                <option value="SHM">SHM</option>
                <option value="HGB">HGB</option>
                <option value="AJB">AJB</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Daya Listrik (VA)</span>
              <input
                type="number"
                min={0}
                value={form.electricity}
                onChange={(e) => setForm({ ...form, electricity: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Jumlah Lantai</span>
              <input
                type="number"
                min={1}
                value={form.floors}
                onChange={(e) => setForm({ ...form, floors: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
          </div>
        </details>

        {/* Lokasi */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900">Lokasi</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Kota / Kabupaten *</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="Contoh: Tangerang"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Kecamatan / Area</span>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="Contoh: BSD City"
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-zinc-700">Catatan Patokan Lokasi</span>
              <input
                type="text"
                value={form.addressNote}
                onChange={(e) => setForm({ ...form, addressNote: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
                placeholder="Contoh: Dekat gerbang utama"
              />
            </label>
          </div>
        </section>

        {/* Contact Override */}
        <details className="rounded-2xl bg-white p-6 shadow-sm">
          <summary className="cursor-pointer text-lg font-bold text-zinc-900">
            Kontak Agent (opsional) ▾
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Nama Agent</span>
              <input
                type="text"
                value={form.agentName}
                onChange={(e) => setForm({ ...form, agentName: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">WhatsApp</span>
              <input
                type="text"
                value={form.agentPhone}
                onChange={(e) => setForm({ ...form, agentPhone: e.target.value })}
                className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-emerald-500"
              />
            </label>
          </div>
        </details>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || pending}
          className="touch-target w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
        >
          {submitting ? "Menyimpan..." : "Simpan Properti"}
        </button>
      </form>
    </main>
  );
}
