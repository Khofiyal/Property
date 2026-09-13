"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PropertyGalleryProps {
  images: Array<{ id: string; url: string }>;
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  return (
    <section className="mx-auto max-w-4xl bg-[var(--bg)] pb-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg)]">
        {images.length > 0 ? (
          <>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg)]">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Image
                    src={img.url}
                    alt={`${title} - Foto ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
              <div>
                <span className="rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--bg)]">
                  Unggulan
                </span>
                <p className="mt-1 line-clamp-1 text-base font-semibold text-white">
                  {/* title will be passed from parent if needed */}
                </p>
              </div>

              {images.length > 0 && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <svg className="h-4 w-4 stroke-[2]" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-transparent to-transparent">
              <svg className="absolute inset-0 w-full h-full fill-none stroke-[var(--gold)] strokeWidth={1.8}" d="M4 4h16m-8-8h16M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 002-2v8m12 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        </div>
      </section>
  );
}