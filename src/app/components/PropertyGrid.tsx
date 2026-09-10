"use client";

import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";

interface PropertyCardPropsWithPrice {
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
}

interface PropertyGridProps {
  properties: PropertyCardPropsWithPrice[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function PropertyGrid({ properties }: { properties: PropertyCardPropsWithPrice[] }) {
  if (properties.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">
        <svg className="mx-auto h-10 w-10 text-[var(--gold)] stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">Properti tidak ditemukan</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-[var(--text-muted)]">
          Silakan sesuaikan kembali kata kunci atau opsi filter pencarian Anda.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-[var(--gold)] px-5 py-2.5 text-xs font-semibold text-[var(--bg)]"
        >
          Reset Filter
        </a>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {properties.map((p, index) => (
        <motion.div key={p.id} variants={itemVariants} style={{ transitionDelay: `${index * 80}ms` }}>
          <PropertyCard property={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}