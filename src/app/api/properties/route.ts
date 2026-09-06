import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = Number(searchParams.get("limit") ?? 20);
    const offset = Number(searchParams.get("offset") ?? 0);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const q = searchParams.get("q");

    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }, { city: { contains: q, mode: "insensitive" } }];

    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { images: { take: 1, orderBy: { order: "asc" } } },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ data, total });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
