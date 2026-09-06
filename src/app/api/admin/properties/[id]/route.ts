import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: NextRequest) {
  return req.cookies.get("admin_pin")?.value === process.env.ADMIN_PIN;
}

function serialize(p: any) {
  return { ...p, id: p.id, price: p.price.toString() };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const data: any = {};
    if ("status" in body) data.status = body.status;
    if ("title" in body) data.title = body.title;
    // ... full update handled in PUT below
    const property = await prisma.property.update({
      where: { id },
      data,
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ data: serialize(property) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const b = await req.json();
    const property = await prisma.property.update({
      where: { id },
      data: {
        title: b.title,
        slug: b.slug,
        description: b.description,
        price: BigInt(b.price),
        type: b.type,
        category: b.category,
        status: b.status,
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
        images: { deleteMany: {}, create: b.images?.map((img: any, i: number) => ({ url: img.url, publicId: img.publicId, order: i })) ?? [] },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ data: serialize(property) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
