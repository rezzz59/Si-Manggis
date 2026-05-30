import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("pengaduan")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json();
  const rawStatus = body.status as string | undefined;
  const statusMap: Record<string, string> = {
    proses: "DIPROSES",
    selesai: "SELESAI",
    ditolak: "DITOLAK",
    menunggu: "MENUNGGU",
  };
  const status = rawStatus
    ? (statusMap[rawStatus.toLowerCase()] ?? rawStatus.toUpperCase())
    : undefined;

  const validStatuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("pengaduan")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // WA notifikasi ke warga
  if (status && data?.telepon) {
    const statusMessages: Record<string, string> = {
      SELESAI: "Pengaduan Anda telah ditindaklanjuti dan dinyatakan selesai.",
      DITOLAK: "Mohon maaf, pengaduan Anda tidak dapat diproses lebih lanjut.",
      DIPROSES: "Pengaduan Anda sedang diproses oleh staff kelurahan.",
      MENUNGGU: "Pengaduan Anda telah diterima dan menunggu diproses.",
    };

    const msg = statusMessages[status];
    if (msg) {
      const waMsg = [
        `Halo ${data.nama},`,
        ``,
        `Update status pengaduan #${data.tiket}:`,
        ``,
        `${msg}`,
        ``,
        `Terima kasih telah melapor.`,
      ].join("\n");

      try {
        await sendFonnteWA({
          target: normalizePhone(data.telepon),
          message: waMsg,
        });
      } catch (waErr) {
        console.warn("[pengaduan PATCH] Gagal kirim WA:", waErr);
      }
    }
  }

  return NextResponse.json(data);
}