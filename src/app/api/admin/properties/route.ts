import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

function isAdmin(req: NextRequest) {
  return req.cookies.get("admin_pin")?.value === process.env.ADMIN_PIN;
}

function serialize(p: any) {
  const { images, ...rest } = p;
  return { ...rest, price: p.price.toString(), images: images?.map((i: any) => ({ id: i.id, url: i.url, publicId: i.publicId, order: i.order })) ?? [] };
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const where = status ? { status } : {};
    const data = await prisma.property.findMany({ where, include: { images: { orderBy: { order: "asc" } } }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: data.map(serialize) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.title || !b.price || !b.city) {
      return NextResponse.json({ error: "title, price, city wajib diisi" }, { status: 400 });
    }
    const slug = b.slug || slugify(b.title);
    const property = await prisma.property.create({
      data: {
        title: b.title,
        slug,
        description: b.description ?? "",
        price: BigInt(b.price),
        type: b.type ?? "DIJUAL",
        category: b.category ?? "RUMAH",
        status: b.status ?? "AVAILABLE",
        bedrooms: b.bedrooms ?? null,
        bathrooms: b.bathrooms ?? null,
        landArea: b.landArea ?? null,
        buildingArea: b.buildingArea ?? null,
        certificate: b.certificate ?? null,
        electricity: b.electricity ?? null,
        floors: b.floors ?? 1,
        city: b.city,
        district: b.district ?? null,
        addressNote: b.addressNote ?? null,
        agentName: b.agentName ?? "Enci",
        agentPhone: b.agentPhone ?? "6281291300412",
        images: { create: b.images?.map((img: any, i: number) => ({ url: img.url, publicId: img.publicId, order: i })) ?? [] },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ data: serialize(property) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
