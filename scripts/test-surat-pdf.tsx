// scripts/test-surat-pdf.ts
// Render PDF surat pengantar dengan data dummy untuk verifikasi visual.
// Jalankan: npx tsx scripts/test-surat-pdf.ts

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ComponentType } from "react";
import { SuratPdfDocument } from "../src/components/surat-pdf-template";

async function main() {
  const data = {
    // Data pemohon
    nik: "6371011234560001",
    nama: "AHMAD FAUZI",
    tempat_lahir: "Banjarbaru",
    tanggal_lahir: "12-06-1990",
    jenis_kelamin: "L" as const,
    agama: "Islam" as const,
    status_kawin: "Kawin" as const,
    pendidikan: "S1" as const,
    pekerjaan: "Karyawan Swasta",
    alamat: "Jl. Manggis No. 12, Komplek Griya Asri",
    keperluan: "Pengurusan KTP Elektronik",
    // Nomor surat
    nomor_rt: "003",
    nomor_rw: "002",
    nomor_urut: "0042",
    nomor_tahun: "2026",
    // Tanggal & tempat
    tempat_surat: "Guntung Manggis",
    tanggal_surat: "2026-06-08",
    // Pejabat
    nama_pejabat: "H. BAMBANG SURYADI",
  };

  console.log("[test] Rendering PDF dengan data dummy...");
  const Component = SuratPdfDocument as unknown as React.ComponentType<{ data: typeof data }>;
  const buffer = await renderToBuffer(createElement(Component, { data }) as React.ReactElement<any, any>);

  const outDir = resolve(process.cwd(), "tmp");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "test-surat-pengantar.pdf");
  writeFileSync(outPath, buffer);

  console.log(`[test] OK - PDF tersimpan: ${outPath}`);
  console.log(`[test] Ukuran: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("[test] GAGAL:", err);
  process.exit(1);
});
