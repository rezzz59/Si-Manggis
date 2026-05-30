import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSub: { fontSize: 12 },
  divider: { borderBottom: 1, marginVertical: 10 },
  title: { textAlign: "center", fontSize: 16, marginBottom: 20, textDecoration: "underline" },
  body: { fontSize: 11, lineHeight: 1.6 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 120, fontWeight: "bold" },
  value: { flex: 1 },
  footer: { marginTop: 40, flexDirection: "row", justifyContent: "flex-end" },
  signatureBox: { width: 180, textAlign: "center" },
  signatureLabel: { fontSize: 10 },
});

interface Props {
  data: {
    nama: string;
    nik: string;
    alamat: string;
    layanan: string;
    sub_layanan: string;
    tiket: string;
    tanggal: string;
    nomor_rt: string;
  };
}

export const SuratPdfDocument: React.FC<Props> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DESA DIGITAL</Text>
        <Text style={styles.headerSub}>KELURAHAN SETIABUDI</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.title}>SURAT KETERANGAN</Text>

      <View style={styles.body}>
        <Text>Yang bertanda tangan di bawah ini menyatakan bahwa:</Text>
        <View style={{ marginVertical: 10 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Nama</Text>
            <Text style={styles.value}>: {data.nama}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NIK</Text>
            <Text style={styles.value}>: {data.nik}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.value}>: RT {data.nomor_rt}, {data.alamat}</Text>
          </View>
        </View>

        <Text>Telah mengajukan permohonan layanan:</Text>
        <View style={{ marginVertical: 10 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Jenis Layanan</Text>
            <Text style={styles.value}>: {data.layanan}{data.sub_layanan ? ` - ${data.sub_layanan}` : ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nomor Tiket</Text>
            <Text style={styles.value}>: #{data.tiket}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>: {data.tanggal}</Text>
          </View>
        </View>

        <Text>Permohonan ini telah disetujui dan diproses.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>Hormat kami,</Text>
          <Text style={{ marginTop: 40, fontSize: 11 }}>Staff Kelurahan</Text>
        </View>
      </View>
    </Page>
  </Document>
);