const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleProperties = [
  {
    title: "Rumah Modern Minimalis Navapark BSD City",
    slug: "rumah-modern-minimalis-navapark-bsd-city",
    description: "Rumah mewah 2 lantai siap huni di kawasan premium Navapark BSD. Keamanan 24 jam, fasilitas clubhouse bintang lima, dan akses dekat tol Serpong-Balaraja.",
    price: 4850000000n, // Rp 4,85 M
    type: "DIJUAL",
    category: "RUMAH",
    status: "AVAILABLE",
    bedrooms: 4,
    bathrooms: 3,
    landArea: 180,
    buildingArea: 220,
    certificate: "SHM",
    electricity: 4400,
    floors: 2,
    city: "Tangerang Selatan",
    district: "BSD City",
    addressNote: "Dekat Country Club Navapark",
    agentName: "Enci",
    agentPhone: "6281291300412",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_navapark_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_navapark_2",
        order: 1,
      },
    ],
  },
  {
    title: "Ruko Komersial Strategis Goldfinch Gading Serpong",
    slug: "ruko-komersial-strategis-goldfinch-gading-serpong",
    description: "Ruko 3 lantai menghadap jalan utama, sangat cocok untuk usaha kuliner, kantor, atau klinik. Area ramai dengan traffic tinggi setiap hari.",
    price: 3200000000n, // Rp 3,2 M
    type: "DIJUAL",
    category: "RUKO",
    status: "AVAILABLE",
    bedrooms: null,
    bathrooms: 3,
    landArea: 75,
    buildingArea: 200,
    certificate: "HGB",
    electricity: 5500,
    floors: 3,
    city: "Tangerang",
    district: "Gading Serpong",
    addressNote: "Boulevard Goldfinch Blok A",
    agentName: "Enci",
    agentPhone: "6281291300412",
    images: [
      {
        url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ruko_1",
        order: 0,
      },
    ],
  },
  {
    title: "Apartemen Sky House 2BR Semi Furnished BSD",
    slug: "apartemen-sky-house-2br-semi-furnished-bsd",
    description: "Unit apartemen 2 kamar tidur di jantung BSD City. Bersebelahan langsung dengan AEON Mall BSD. Cocok untuk profesional muda atau investasi sewa.",
    price: 65000000n, // Rp 65 Juta / tahun
    type: "DISEWAKAN",
    category: "APARTEMEN",
    status: "AVAILABLE",
    bedrooms: 2,
    bathrooms: 1,
    landArea: null,
    buildingArea: 48,
    certificate: "Strata Title",
    electricity: 2200,
    floors: 1,
    city: "Tangerang",
    district: "BSD City",
    addressNote: "Tower Leon Lantai 18",
    agentName: "Enci",
    agentPhone: "6281291300412",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_apt_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_apt_2",
        order: 1,
      },
    ],
  },
  {
    title: "Kavling Tanah Siap Bangun Sutera Victoria Alam Sutera",
    slug: "kavling-tanah-siap-bangun-sutera-victoria-alam-sutera",
    description: "Tanah kavling posisi badan bentuk kotak di cluster mewah Sutera Victoria Alam Sutera. Lingkungan asri, jalan lebar, bebas banjir.",
    price: 3800000000n, // Rp 3,8 M
    type: "DIJUAL",
    category: "TANAH",
    status: "AVAILABLE",
    bedrooms: null,
    bathrooms: null,
    landArea: 250,
    buildingArea: null,
    certificate: "PPJB Siap AJB",
    electricity: null,
    floors: null,
    city: "Tangerang Selatan",
    district: "Alam Sutera",
    addressNote: "Cluster Sutera Victoria",
    agentName: "Enci",
    agentPhone: "6281291300412",
    images: [
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_tanah_1",
        order: 0,
      },
    ],
  },
  {
    title: "Rumah Cantik Scandinavian Emerald Bintaro Jaya",
    slug: "rumah-cantik-scandinavian-emerald-bintaro-jaya",
    description: "Rumah 2 lantai desain skandinavia modern di Bintaro Sektor 9. Sudah renovasi, pencahayaan alami maksimal, siap huni tanpa perlu perbaikan.",
    price: 2450000000n, // Rp 2,45 M
    type: "DIJUAL",
    category: "RUMAH",
    status: "SOLD",
    bedrooms: 3,
    bathrooms: 2,
    landArea: 120,
    buildingArea: 140,
    certificate: "SHM",
    electricity: 3500,
    floors: 2,
    city: "Tangerang Selatan",
    district: "Bintaro",
    addressNote: "Dekat Bintaro Xchange Mall",
    agentName: "Enci",
    agentPhone: "6281291300412",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_bintaro_1",
        order: 0,
      },
    ],
  },
  {
    title: "Sewa Rumah Mewah Hoek Foresta BSD City",
    slug: "sewa-rumah-mewah-hoek-foresta-bsd-city",
    description: "Disewakan rumah hoek luas dengan taman samping di Cluster Foresta BSD. Kondisi terawat, lingkungan tenang, dekat sekolah IPEKA & Nanyang.",
    price: 135000000n, // Rp 135 Juta / tahun
    type: "DISEWAKAN",
    category: "RUMAH",
    status: "AVAILABLE",
    bedrooms: 4,
    bathrooms: 3,
    landArea: 240,
    buildingArea: 210,
    certificate: "SHM",
    electricity: 5500,
    floors: 2,
    city: "Tangerang",
    district: "BSD City",
    addressNote: "Foresta Cluster Naturale",
    agentName: "Enci",
    agentPhone: "6281291300412",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_foresta_1",
        order: 0,
      },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  // Hapus data lama jika ada
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  for (const item of sampleProperties) {
    const { images, ...propertyData } = item;
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: images,
        },
      },
    });
    console.log(`Created: ${property.title} (${property.category} - ${property.type})`);
  }

  console.log("Seeding complete! 6 properties created.");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
