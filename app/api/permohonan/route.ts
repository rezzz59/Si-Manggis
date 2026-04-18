import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { generateTiket } from "@/src/lib/tiket";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [data, total] = await Promise.all([
    prisma.permohonan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.permohonan.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nama, nik, alamat, layanan, keperluan, telepon } = body;

  if (!nama || !alamat || !layanan || !keperluan || !telepon) {
    return NextResponse.json({ error: "Field wajib kosong" }, { status: 400 });
  }

  let tiket: string;
  do {
    tiket = generateTiket();
  } while (await prisma.permohonan.findUnique({ where: { tiket } }));

  const data = await prisma.permohonan.create({
    data: { tiket, nama, nik: nik || null, alamat, layanan, keperluan, telepon },
  });

  return NextResponse.json(data, { status: 201 });
}
