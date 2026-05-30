import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";
import { SuratPdfDocument } from "@/src/components/surat-pdf-template";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { permohonanId } = body as { permohonanId: string };

  if (!permohonanId) {
    return NextResponse.json({ error: "permohonanId required" }, { status: 400 });
  }

  // 1. Ambil data permohonan
  const { data: permohonan, error: fetchError } = await supabaseAdmin
    .from("permohonan")
    .select("id, nama, nik, alamat, layanan, sub_layanan, tiket, createdat, nomor_rt, telepon")
    .eq("id", permohonanId)
    .single();

  if (fetchError || !permohonan) {
    return NextResponse.json({ error: "Permohonan tidak ditemukan" }, { status: 404 });
  }

  // 2. Generate PDF
  const formattedDate = new Date(permohonan.createdat).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pdfBuffer = await renderToBuffer(
    <SuratPdfDocument
      data={{
        nama: permohonan.nama,
        nik: permohonan.nik,
        alamat: permohonan.alamat ?? "",
        layanan: permohonan.layanan,
        sub_layanan: permohonan.sub_layanan ?? "",
        tiket: permohonan.tiket,
        tanggal: formattedDate,
        nomor_rt: permohonan.nomor_rt ?? "",
      }}
    />
  );

  // 3. Upload ke Supabase Storage
  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = String(now.getMonth() + 1).padStart(2, "0");
  const filename = `${permohonan.tiket}.pdf`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("surat")
    .upload(`${tahun}/${bulan}/${filename}`, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: `Upload gagal: ${uploadError.message}` }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("surat")
    .getPublicUrl(`${tahun}/${bulan}/${filename}`);

  const suratUrl = urlData.publicUrl;

  // 4. Update kolom surat_url
  await supabaseAdmin
    .from("permohonan")
    .update({ surat_url: suratUrl })
    .eq("id", permohonanId);

  // 5. Kirim WA ke Warga
  if (permohonan.telepon) {
    await sendFonnteWA({
      target: normalizePhone(permohonan.telepon),
      message: [
        `Surat Anda telah siap.`,
        ``,
        `Tiket  : #${permohonan.tiket}`,
        `Layanan: ${permohonan.layanan}`,
        ``,
        `Download: ${suratUrl}`,
      ].join("\n"),
    });
  }

  return NextResponse.json({ success: true, suratUrl });
}
