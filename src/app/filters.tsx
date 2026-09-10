"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, MapPin, Building, Home, KeyRound, Sparkles, SlidersHorizontal } from "lucide-react";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  const [type, setType] = useState((params.get("type") || "all") as string);
  const [category, setCategory] = useState((params.get("category") || "all") as string);
  const [city, setCity] = useState(params.get("city") ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [statusTab, setStatusTab] = useState((params.get("statusTab") || "all") as string);

  const applyFilters = (overrides?: {
    type?: string;
    category?: string;
    city?: string;
    q?: string;
    statusTab?: string;
  }) => {
    const currentType = overrides?.type ?? type;
    const currentCat = overrides?.category ?? category;
    const currentCity = overrides?.city ?? city;
    const currentQ = overrides?.q ?? q;
    const currentTab = overrides?.statusTab ?? statusTab;

    const newParams = new URLSearchParams();

    if (currentTab === "sold") {
      newParams.set("status", "SOLD");
    } else if (currentTab === "forSale") {
      newParams.set("status", "AVAILABLE");
      newParams.set("type", "DIJUAL");
    } else if (currentTab === "forRent") {
      newParams.set("status", "AVAILABLE");
      newParams.set("type", "DISEWAKAN");
    } else {
      if (currentType !== "all") newParams.set("type", currentType);
    }

    if (currentCat !== "all") newParams.set("category", currentCat);
    if (currentCity.trim()) newParams.set("city", currentCity.trim());
    if (currentQ.trim()) newParams.set("q", currentQ.trim());
    if (currentTab !== "all") newParams.set("statusTab", currentTab);

    router.push(`/?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setType((params.get("type") || "all") as string);
    setCategory((params.get("category") || "all") as string);
    setCity(params.get("city") ?? "");
    setQ(params.get("q") ?? "");
    setStatusTab((params.get("statusTab") || "all") as string);
  }, [params]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Outer Enclosure (Double-Bezel) */}
      <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-2 shadow-lg">
        <div className="rounded-[calc(1.75rem-0.375rem)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">

          {/* Top Bar: Status Tabs & Filter Indicator */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { label: "Semua", value: "all", icon: Sparkles },
                { label: "Dijual", value: "forSale", icon: Home },
                { label: "Disewakan", value: "forRent", icon: KeyRound },
                { label: "Terjual", value: "sold", icon: Building },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = statusTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setStatusTab(tab.value);
                      applyFilters({ statusTab: tab.value });
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ease-spring ${
                      active
                        ? "bg-[var(--gold)] text-[var(--bg)] shadow-sm"
                        : "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 stroke-[1.8]" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>Filter Pencarian</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.8]" />
              <input
                type="text"
                placeholder="Cari judul..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="touch-target w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--gold)]"
              />
            </div>

            {/* City Input */}
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.8]" />
              <input
                type="text"
                placeholder="Kota / Area..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="touch-target w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--gold)]"
              />
            </div>

            {/* Category Selector */}
            <div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  applyFilters({ category: e.target.value });
                }}
                className="touch-target w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--gold)]"
              >
                <option value="all">Semua Kategori</option>
                <option value="RUMAH">Rumah</option>
                <option value="RUKO">Ruko</option>
                <option value="TANAH">Tanah</option>
                <option value="APARTEMEN">Apartemen</option>
              </select>
            </div>

            {/* Search Submit */}
            <button
              type="button"
              onClick={() => applyFilters()}
              className="touch-target group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gold)] font-semibold text-[var(--bg)] shadow-sm transition-all ease-spring hover:brightness-105 active:scale-[0.98]"
            >
              <span>Cari Properti</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg)]/10 transition-transform duration-300 group-hover:scale-110">
                <Search className="h-3.5 w-3.5 stroke-[2]" />
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
