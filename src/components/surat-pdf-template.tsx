import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { readFileSync } from "fs";
import { join } from "path";

const BLANKO_FILE = join(process.cwd(), "public", "template", "surat-pengantar-blanko.png");
const BLANKO_BASE64 = `data:image/png;base64,${readFileSync(BLANKO_FILE).toString("base64")}`;

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    position: "relative",
  },
  // Lapisan teks di atas background blanko
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Text biasa
  text: { fontSize: 8, color: "#000" },
  // Text untuk isian (sedikit lebih besar)
  field: { fontSize: 9, color: "#000" },
  // Baris isian horizontal
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Checkbox sederhana
  check: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  checkEmpty: { fontSize: 11, color: "#666" },
});

// Karakter kotak kosong (lebih mirip blanko)
const BOX = "□";
const CHECK = "■";

interface Props {
  data: {
    // Data pemohon (8 field blanko)
    nik: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string; // format: "DD-MM-YYYY"
    jenis_kelamin: "L" | "P" | null; // Laki-laki / Perempuan
    agama: "Islam" | "Kristen" | "Katholik" | "Budha" | "Hindu" | null;
    status_kawin: "Kawin" | "Belum Kawin" | "Cerai Hidup" | "Cerai Mati" | null;
    pendidikan: "SD" | "SLTP" | "SLTA" | "D1" | "D2" | "D3" | "S1" | "S2" | "S3" | null;
    pekerjaan: string;
    alamat: string;
    keperluan: string;
    // Nomor surat
    nomor_rt: string;     // 3 digit
    nomor_rw: string;     // 2 digit
    nomor_urut: string;   // 4 digit
    nomor_tahun: string;  // 4 digit (auto: tahun ini)
    // Tanggal & tempat surat
    tempat_surat: string;  // default: "Guntung Manggis"
    tanggal_surat: string; // format: "DD-MM-YYYY"
    // Pejabat penandatangan (dari tabel rt)
    nama_pejabat: string;  // nama Ketua RT
  };
}

export const SuratPdfDocument: React.FC<Props> = ({ data }) => {
  // Format tanggal Indonesia "12 Juni 2026"
  const formatTanggalID = (iso: string) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parseInt(parts[0], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[2]}`;
  };

  const tanggalSuratFormatted = formatTanggalID(data.tanggal_surat);

  // Fallback untuk field kosong: tampilkan em-dash daripada string kosong
  // agar posisi teks di PDF tetap konsisten
  const DASH = "—";
  const v = (val: string | null | undefined) => (val && val.trim() ? val : DASH);

  return (
    <Document>
      {/*
        Halaman 1: Template dengan isian
        A4 = 595.28 x 841.89 pt
      */}
      <Page size="A4" wrap={false} style={styles.page}>
        {/* Background: blanko asli */}
        <Image
          fixed
          src={BLANKO_BASE64}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 595.28,
            height: 841.89,
            objectFit: "fill",
          }}
        />

        {/* Overlay teks */}
        <View style={styles.overlay}>
          {/* === NOMOR SURAT (baris di bawah "SURAT PENGANTAR") === */}
          {/* Posisi: di kotak-kotak kecil "RT ___  RW ___  - ___ - ___" */}
          <View style={{ position: "absolute", top: 108, left: 42, width: 190 }}>
            <Text style={[styles.field, { fontSize: 7 }]}>
              {v(data.nomor_urut)}   RT {v(data.nomor_rt)}   RW {v(data.nomor_rw)}   {v(data.nomor_tahun)}
            </Text>
          </View>

          {/* === DATA PEMOHON === */}

          {/* NIK - 16 digit di baris pertama */}
          <View style={{ position: "absolute", top: 152, left: 86, width: 145 }}>
            <Text style={styles.field}>{v(data.nik)}</Text>
          </View>

          {/* Nama */}
          <View style={{ position: "absolute", top: 183, left: 86, width: 210 }}>
            <Text style={styles.field}>{v(data.nama)}</Text>
          </View>

          {/* Tempat, Tgl. Lahir: tempat di kiri, tanggal di kanan */}
          <View style={{ position: "absolute", top: 214, left: 86, width: 125 }}>
            <Text style={styles.field}>{v(data.tempat_lahir)}</Text>
          </View>
          <View style={{ position: "absolute", top: 214, left: 202, width: 92 }}>
            <Text style={[styles.field, { textAlign: "left" }]}>
              {v(data.tanggal_lahir)}
            </Text>
          </View>

          {/* Jenis Kelamin: 2 checkbox (Laki-laki / Perempuan) */}
          <View style={{ position: "absolute", top: 246, left: 86, width: 210, flexDirection: "row" }}>
            <Text style={styles.check}>
              {data.jenis_kelamin === "L" ? CHECK : BOX}
            </Text>
            <Text style={[styles.field, { marginLeft: 4, marginRight: 25 }]}>Laki - Laki</Text>
            <Text style={styles.check}>
              {data.jenis_kelamin === "P" ? CHECK : BOX}
            </Text>
            <Text style={[styles.field, { marginLeft: 4 }]}>Perempuan</Text>
          </View>

          {/* Agama: 5 checkbox horizontal */}
          <View style={{ position: "absolute", top: 276, left: 86, width: 230, flexDirection: "row" }}>
            {(["Islam", "Kristen", "Katholik", "Budha", "Hindu"] as const).map((a) => (
              <View key={a} style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                <Text style={styles.check}>{data.agama === a ? CHECK : BOX}</Text>
                <Text style={[styles.field, { marginLeft: 3, fontSize: 8 }]}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Status Perkawinan: 4 checkbox horizontal */}
          <View style={{ position: "absolute", top: 307, left: 86, width: 250, flexDirection: "row" }}>
            {(["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati"] as const).map((s) => (
              <View key={s} style={{ flexDirection: "row", marginRight: 8, alignItems: "center" }}>
                <Text style={styles.check}>{data.status_kawin === s ? CHECK : BOX}</Text>
                <Text style={[styles.field, { marginLeft: 3 }]}>{s}</Text>
              </View>
            ))}
          </View>

          {/* Pendidikan Terakhir: 9 checkbox horizontal */}
          <View style={{ position: "absolute", top: 338, left: 86, width: 250, flexDirection: "row" }}>
            {(["SD", "SLTP", "SLTA", "D1", "D2", "D3", "S1", "S2", "S3"] as const).map((p) => (
              <View key={p} style={{ flexDirection: "row", marginRight: 5, alignItems: "center" }}>
                <Text style={styles.check}>{data.pendidikan === p ? CHECK : BOX}</Text>
                <Text style={[styles.field, { marginLeft: 2, fontSize: 8 }]}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Pekerjaan */}
          <View style={{ position: "absolute", top: 369, left: 86, width: 210 }}>
            <Text style={styles.field}>{v(data.pekerjaan)}</Text>
          </View>

          {/* Alamat */}
          <View style={{ position: "absolute", top: 400, left: 86, width: 210 }}>
            <Text style={styles.field}>{v(data.alamat)}</Text>
          </View>

          {/* Keperluan */}
          <View style={{ position: "absolute", top: 462, left: 86, width: 210 }}>
            <Text style={styles.field}>{v(data.keperluan)}</Text>
          </View>

          {/* === TANGGAL & PEJABAT (kanan bawah) === */}

          {/* "Guntung Manggis, [tanggal] [bulan] [tahun]" */}
          <View style={{ position: "absolute", top: 531, left: 132, flexDirection: "row" }}>
            <Text style={styles.field}>
              {v(data.tempat_surat)}, {tanggalSuratFormatted}
            </Text>
          </View>

          {/* "KETUA RT.  RW." (label) - sudah ada di background */}
          {/* Nama pejabat + ( ) untuk ttd */}
          <View style={{ position: "absolute", top: 648, left: 145, alignItems: "center", width: 110 }}>
            <Text style={[styles.field, { fontWeight: "bold" }]}>
              ({v(data.nama_pejabat)})
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
