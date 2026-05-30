import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { supabase } from "@/src/lib/supabase";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { data, error } = await supabase
    .from("permohonan")
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
  const { status, catatan } = body;

  const validStatuses = ["MENUNGGU", "DISETUJAI_RT", "DITOLAK_RT", "DIPROSES", "SELESAI", "DITOLAK"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const updateData: Record<string, string | null> = {};
  if (status) updateData.status = status;
  if (catatan !== undefined) updateData.catatan = catatan;

  const { data, error } = await supabase
    .from("permohonan")
    .update({ ...updateData, updatedat: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status) {
    const current = await supabase
      .from("permohonan")
      .select("status")
      .eq("id", id)
      .single();
    if (current.data) {
      await supabase.from("laporan_status_log").insert({
        laporan_id: id,
        from_status: current.data.status,
        to_status: status,
        changed_by: session.user.email ?? "staff",
        changed_at: new Date().toISOString(),
        note: catatan ?? null,
      });
    }

    // WA notifikasi ke warga
    const { data: pengajuan } = await supabaseAdmin
      .from("permohonan")
      .select("nama, telepon, tiket, status")
      .eq("id", id)
      .single();

    if (pengajuan?.telepon) {
      const statusMessages: Record<string, string> = {
        SELESAI: "Surat Anda telah siap dan dapat diunduh di halaman Cek Tiket.",
        DITOLAK: "Mohon maaf, permohonan Anda telah ditolak. Hubungi kantor desa untuk informasi lebih lanjut.",
        DIPROSES: "Permohonan Anda sedang diproses oleh staff kelurahan.",
        DISETUJAI_RT: "Permohonan Anda telah disetujui RT dan diteruskan ke Kelurahan.",
      };

      const msg = statusMessages[status];
      if (msg) {
        const waMsg = [
          `Halo ${pengajuan.nama},`,
          ``,
          `Update status permohonan #${pengajuan.tiket}:`,
          ``,
          `${msg}`,
          ``,
          `Terima kasih.`,
        ].join("\n");

        try {
          await sendFonnteWA({
            target: normalizePhone(pengajuan.telepon),
            message: waMsg,
          });
        } catch (waErr) {
          console.warn("[permohonan PATCH] Gagal kirim WA:", waErr);
        }
      }
    }
  }

  return NextResponse.json(data);
}
