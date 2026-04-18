import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { tiket: string } }) {
  const tiket = params.tiket.toUpperCase().trim();

  const [permohonan, pengaduan] = await Promise.all([
    prisma.permohonan.findUnique({ where: { tiket } }),
    prisma.pengaduan.findUnique({ where: { tiket } }),
  ]);

  if (!permohonan && !pengaduan) {
    return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ tiket, permohonan, pengaduan });
}
