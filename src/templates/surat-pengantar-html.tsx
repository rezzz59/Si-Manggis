import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export interface SuratPengantarData {
  // Kop surat (statis)
  kopBaris1?: string;
  kopBaris2?: string;
  kopBaris3?: string;
  kopBaris4?: string;

  // Nomor surat
  nomorLayanan?: string;
  nomorRt?: string;
  nomorRw?: string;
  nomorUrut?: string;

  // Data pemohon
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // format: DD-MM-YYYY
  jenisKelamin: "Laki-laki" | "Perempuan" | "";
  agama: string;
  statusKawin: string;
  pendidikan: string;
  pekerjaan: string;
  alamat: string;
  keperluan: string;

  // Tanggal & tanda tangan
  tanggalSurat: string; // sudah diformat "8 Juni 2026"
  kotaSurat?: string;
  ketuaNama: string;
  ketuaNip?: string;
}

const AGAMA_OPTIONS = ["Islam", "Kristen", "Katholik", "Budha", "Hindu"] as const;
const KAWIN_OPTIONS = ["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati"] as const;
const PENDIDIKAN_OPTIONS = ["SD", "SLTP", "SLTA", "D1", "D2", "D3", "S1", "S2", "S3"] as const;
const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"] as const;

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "11px",
        height: "11px",
        border: "1px solid #000",
        marginRight: "4px",
        position: "relative",
        verticalAlign: "middle",
      }}
    >
      {checked && (
        <span
          style={{
            position: "absolute",
            top: "-1px",
            left: "1px",
            fontSize: "13px",
            fontWeight: "bold",
            lineHeight: "11px",
            color: "#000",
          }}
        >
          ✓
        </span>
      )}
    </span>
  );
}

function isChecked(value: string, option: string): boolean {
  if (!value) return false;
  return value.toLowerCase() === option.toLowerCase();
}

const styles = {
  page: {
    width: "210mm",
    minHeight: "297mm",
    padding: "12mm 18mm",
    boxSizing: "border-box" as const,
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "12pt",
    color: "#000",
    backgroundColor: "#fff",
    lineHeight: "1.3",
  },
  kopContainer: {
    display: "flex",
    alignItems: "center",
    borderBottom: "3px solid #000",
    paddingBottom: "6px",
    marginBottom: "4px",
  },
  logoPlaceholder: {
    width: "70px",
    height: "70px",
    border: "1px dashed #999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9pt",
    color: "#999",
    marginRight: "14px",
    flexShrink: 0,
  },
  kopText: {
    flex: 1,
    textAlign: "center" as const,
  },
  kopLine1: { fontSize: "14pt", fontWeight: "bold", margin: 0, lineHeight: "1.2" },
  kopLine2: { fontSize: "16pt", fontWeight: "bold", margin: 0, lineHeight: "1.2" },
  kopLine3: { fontSize: "16pt", fontWeight: "bold", margin: 0, lineHeight: "1.2" },
  kopLine4: { fontSize: "11pt", margin: "2px 0 0 0", fontStyle: "italic" as const },
  judul: {
    textAlign: "center" as const,
    fontSize: "13pt",
    fontWeight: "bold",
    textDecoration: "underline",
    margin: "14px 0 8px 0",
  },
  nomor: {
    textAlign: "center" as const,
    fontSize: "11pt",
    marginBottom: "12px",
  },
  intro: { marginBottom: "10px", textAlign: "justify" as const },
  fieldTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: "10px",
  },
  fieldLabel: {
    width: "32%",
    padding: "2px 0",
    verticalAlign: "top" as const,
  },
  fieldSep: {
    width: "2%",
    padding: "2px 0",
    verticalAlign: "top" as const,
  },
  fieldValue: {
    width: "66%",
    padding: "2px 0",
    verticalAlign: "top" as const,
  },
  checkboxRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0 14px",
    alignItems: "center",
  },
  checkboxItem: {
    marginRight: "10px",
    whiteSpace: "nowrap" as const,
  },
  tutup: {
    marginTop: "10px",
    textAlign: "justify" as const,
  },
  tandaTanganContainer: {
    marginTop: "22px",
    display: "flex",
    justifyContent: "flex-end",
  },
  tandaTanganBox: {
    width: "55%",
    textAlign: "center" as const,
  },
  ttdPlaceholder: {
    height: "60px",
    margin: "6px 0 2px 0",
  },
  tandaTanganNama: {
    fontWeight: "bold" as const,
    textDecoration: "underline" as const,
    marginTop: "2px",
  },
  catatanBawah: {
    marginTop: "16px",
    fontSize: "10pt",
    fontStyle: "italic" as const,
  },
  noSplit: {
    pageBreakInside: "avoid" as const,
  },
};

export function SuratPengantarHTML({ data }: { data: SuratPengantarData }) {
  const kop1 = data.kopBaris1 ?? "PEMERINTAH KOTA BANJARBARU";
  const kop2 = data.kopBaris2 ?? "KECAMATAN LANDASAN ULIN";
  const kop3 = data.kopBaris3 ?? "KELURAHAN GUNTUNG MANGGIS";
  const kop4 = data.kopBaris4 ?? "Alamat: Jl. Guntung Manggis, Banjarbaru";
  const kota = data.kotaSurat ?? "Guntung Manggis";

  return (
    <div style={styles.page}>
      {/* KOP SURAT */}
      <div style={styles.kopContainer}>
        <div style={styles.logoPlaceholder} />
        <div style={styles.kopText}>
          <p style={styles.kopLine1}>{kop1}</p>
          <p style={styles.kopLine2}>{kop2}</p>
          <p style={styles.kopLine3}>{kop3}</p>
          <p style={styles.kopLine4}>{kop4}</p>
        </div>
      </div>

      {/* JUDUL */}
      <h1 style={styles.judul}>SURAT PENGANTAR</h1>
      <div style={styles.nomor}>
        Nomor : {data.nomorLayanan ?? ""} / RT {data.nomorRt ?? "__"} / RW {data.nomorRw ?? "__"} / ________
      </div>

      {/* INTRO */}
      <p style={styles.intro}>
        Yang bertanda tangan di bawah ini Ketua RT. ______ RW. ______ dengan ini menerangkan bahwa:
      </p>

      {/* FIELD TABLE */}
      <table style={styles.fieldTable}>
        <tbody>
          <tr>
            <td style={styles.fieldLabel}>NIK</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>
              <span style={{ fontFamily: "monospace", letterSpacing: "1px" }}>
                {data.nik || "—"}
              </span>
            </td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Nama</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>{data.nama || "—"}</td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Tempat, Tgl. Lahir</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>
              {data.tempatLahir || "—"}, {data.tanggalLahir || "—"}
            </td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Jenis Kelamin*</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>
              <span style={styles.checkboxRow}>
                {JENIS_KELAMIN_OPTIONS.map((opt) => (
                  <span key={opt} style={styles.checkboxItem}>
                    <Checkbox checked={isChecked(data.jenisKelamin, opt)} />
                    {opt}
                  </span>
                ))}
              </span>
            </td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Agama</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>
              <span style={styles.checkboxRow}>
                {AGAMA_OPTIONS.map((opt) => (
                  <span key={opt} style={styles.checkboxItem}>
                    <Checkbox checked={isChecked(data.agama, opt)} />
                    {opt}
                  </span>
                ))}
              </span>
            </td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Status Perkawinan*</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>
              <span style={styles.checkboxRow}>
                {KAWIN_OPTIONS.map((opt) => (
                  <span key={opt} style={styles.checkboxItem}>
                    <Checkbox checked={isChecked(data.statusKawin, opt)} />
                    {opt}
                  </span>
                ))}
              </span>
            </td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Pendidikan Terakhir*</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>
              <span style={styles.checkboxRow}>
                {PENDIDIKAN_OPTIONS.map((opt) => (
                  <span key={opt} style={styles.checkboxItem}>
                    <Checkbox checked={isChecked(data.pendidikan, opt)} />
                    {opt}
                  </span>
                ))}
              </span>
            </td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Pekerjaan</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>{data.pekerjaan || "—"}</td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Alamat</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>{data.alamat || "—"}</td>
          </tr>
          <tr>
            <td style={styles.fieldLabel}>Keperluan</td>
            <td style={styles.fieldSep}>:</td>
            <td style={styles.fieldValue}>{data.keperluan || "—"}</td>
          </tr>
        </tbody>
      </table>

      {/* TUTUP */}
      <p style={styles.tutup}>
        Demikian surat pengantar ini disampaikan sebagai bahan proses selanjutnya.
      </p>

      {/* TANDA TANGAN */}
      <div style={styles.tandaTanganContainer}>
        <div style={styles.tandaTanganBox}>
          <div>{kota}, {data.tanggalSurat}</div>
          <div style={{ marginTop: "2px" }}>KETUA RT. ______ RW. ______</div>
          <div style={styles.ttdPlaceholder} />
          <div style={styles.tandaTanganNama}>{data.ketuaNama || "(Ketua RT)"}</div>
          {data.ketuaNip && <div style={{ fontSize: "10pt" }}>NIP. {data.ketuaNip}</div>}
        </div>
      </div>

      <div style={styles.catatanBawah}>*Tandai Salah Satu</div>
    </div>
  );
}

export function renderSuratPengantarHTML(data: SuratPengantarData): string {
  return "<!doctype html>" + renderToStaticMarkup(<SuratPengantarHTML data={data} />);
}
