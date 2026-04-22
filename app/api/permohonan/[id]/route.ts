import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const data = await prisma.permohonan.findUnique({ where: { id } });
  if (!data) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();
  const { status, catatan } = body;

  const validStatuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const data = await prisma.permohonan.update({
    where: { id },
    data: { ...(status && { status }), ...(catatan !== undefined && { catatan }) },
  });

  return NextResponse.json(data);
}
