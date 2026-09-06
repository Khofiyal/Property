# PRD: Website Katalog & Listing Properti Personal (Mobile-First Admin)

## 1. Project Overview & Context
- **Target User (Agent)**: Enci (Independent Real Estate Agent, memasarkan rumah baru developer, rumah second, ruko, apartemen, tanah).
- **Agent Device Constraint**: 100% menggunakan Smartphone (Android/iOS), TIDAK menggunakan laptop/PC.
- **Agent Contact**: WhatsApp `+6281291300412`.
- **Target User (Buyer)**: Calon pembeli properti yang membuka web dari mobile/desktop, mencari listing, dan langsung menghubungi Enci via WhatsApp.
- **Repository Path**: `/home/miko/Documents/Projects/real-estate`

---

## 2. Tech Stack & Infrastructure
- **Framework**: Next.js 15 (App Router, TypeScript, Tailwind CSS, Lucide React).
- **Database & ORM**: MariaDB 11 (VPS 76.13.17.184) via Prisma ORM.
- **Image Storage & CDN**: Cloudinary (Cloud Name: `dlsd6e1rr`) via unsigned/signed upload preset.
- **Authentication**: Simple PIN-based session/cookie auth untuk halaman Admin (`/admin`), tidak perlu OAuth rumit agar instan di HP.
- **Deployment**: Docker container via Coolify di VPS.

---

## 3. Database Schema (Prisma)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ListingType {
  DIJUAL
  DISEWAKAN
}

enum Category {
  RUMAH
  RUKO
  TANAH
  APARTEMEN
}

enum Status {
  AVAILABLE
  SOLD
}

model Property {
  id           String      @id @default(cuid())
  title        String
  slug         String      @unique
  description  String      @db.Text
  price        BigInt      // Harga dalam Rupiah (BigInt untuk angka milyaran)
  type         ListingType @default(DIJUAL)
  category     Category    @default(RUMAH)
  status       Status      @default(AVAILABLE)

  // Spesifikasi Unit
  bedrooms     Int?        // Kamar Tidur (KT)
  bathrooms    Int?        // Kamar Mandi (KM)
  landArea     Int?        // Luas Tanah / LT (m2)
  buildingArea Int?        // Luas Bangunan / LB (m2)
  certificate  String?     // SHM, HGB, AJB, dll
  electricity  Int?        // Daya Listrik (VA)
  floors       Int?        @default(1)

  // Lokasi
  city         String      // Kota / Kabupaten (misal: Tangerang, Jakarta Barat)
  district     String?     // Kecamatan / Area (misal: BSD City, Gading Serpong)
  addressNote  String?     // Catatan patokan lokasi

  // Contact Override (default to Enci)
  agentName    String      @default("Enci")
  agentPhone   String      @default("6281291300412")

  // Media
  images       PropertyImage[]

  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@index([status, type, category])
  @@index([city])
}

model PropertyImage {
  id         String   @id @default(cuid())
  url        String
  publicId   String
  order      Int      @default(0)
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
}
```

---

## 4. Feature Requirements

### A. Public Facing (Buyer Experience)
1. **Homepage (`/`)**:
   - Hero section dengan headline profesional & search filter cepat (Tipe: Jual/Sewa, Kategori: Rumah/Ruko/Tanah/Apartemen, Range Harga, Kota).
   - Filter Tabs: Semua, Dijual, Disewakan, Terjual (Sold Out).
   - Property Card Grid: Foto thumbnail hero, Badge status (Dijual/Disewakan/TERJUAL), Harga terformat Rupiah (`Rp 1,25 Milyar` atau `Rp 850 Juta`), chips specs (KT, KM, LT, LB, Lokasi Kota), dan tombol quick chat WA.
2. **Detail Page (`/property/[slug]`)**:
   - Foto Carousel/Gallery yang swipeable di HP.
   - Price tag prominent & status badge.
   - Tabel spesifikasi lengkap (LT, LB, KT, KM, Listrik, Sertifikat, Lantai).
   - Deskripsi teks rapi dengan support baris baru.
   - Sticky Bottom Bar di mobile: Tombol hijau besar **"Hubungi Enci via WhatsApp"** yang membuka link `https://wa.me/6281291300412?text=Halo%20Enci,%20saya%20tertarik%20dengan%20properti%20ini:%20[Judul]%20[URL]`.
   - OpenGraph meta tags lengkap (image, title, description) agar saat link di-share ke WhatsApp, preview card-nya muncul gambar & harga rapi.

### B. Admin Page (`/admin`) — Mobile-First for Smartphone
1. **Security / Login**:
   - Simple PIN Input (4-6 digit, disimpan di env `ADMIN_PIN`).
   - Cookie session 30 hari agar Enci tidak perlu login berulang-ulang di HP-nya.
2. **Dashboard Overview (`/admin`)**:
   - Ringkasan total properti aktif & terjual.
   - Tombol Floating **"+ Tambah Properti Baru"**.
   - List properti dengan tombol cepat:
     - 1-tap switch status: `Tersedia` <-> `Terjual`.
     - Tombol Edit & Hapus.
     - Tombol "Copy Link Share WA".
3. **Form Tambah / Edit Properti (`/admin/new` & `/admin/edit/[id]`)**:
   - Desain form dengan input touch-target besar (minimal 48px height), font besar, tidak bikin pegal di HP.
   - Multi-image upload langsung dari Galeri HP / Kamera ke Cloudinary API. Preview thumbnail instan + tombol hapus foto sebelum submit.
   - Input harga dengan auto-format rupiah live (contoh: user ketik 1500000000 -> tampil format Rp 1.500.000.000).
   - Dropdown pilihan: Kategori (Rumah, Ruko, Tanah, Apartemen), Tipe (Dijual, Disewakan), Sertifikat (SHM, HGB, Lainnya).
   - Form field opsional dibuat expandable/accordion agar form tidak terasa terlalu panjang.
   - Feedback toast/alert instan setelah berhasil simpan.

---

## 5. API Endpoints
- `POST /api/auth/pin`: Verifikasi PIN & set cookie session.
- `GET /api/properties`: Fetch data properti publik (support query filter search, category, type, status, city).
- `POST /api/admin/properties`: Create properti baru (Admin only).
- `PUT /api/admin/properties/[id]`: Update properti & toggle status sold/available (Admin only).
- `DELETE /api/admin/properties/[id]`: Hapus properti (Admin only).
- `POST /api/upload`: Direct server upload ke Cloudinary / generate upload signature.

---

## 6. Acceptance Criteria
1. Web bisa dibuka cepat di HP maupun Desktop.
2. Admin `/admin` bisa dioperasikan sepenuhnya lewat browser smartphone tanpa hambatan UI/zoom.
3. Upload foto properti dari HP langsung masuk Cloudinary dan tersimpan di DB.
4. Klik tombol WhatsApp di halaman listing membuka chat WA dengan pesan template yang menyebutkan judul properti dan link spesifik.
5. Share link ke WhatsApp memunculkan thumbnail gambar properti (OpenGraph).
6. Build Next.js sukses tanpa error TypeScript / ESLint.
