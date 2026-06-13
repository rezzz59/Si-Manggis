/**
 * Generate nomor tiket pendek: 5 digit angka (10000 - 99999).
 * Kapasitas ±90.000 tiket unik — cukup untuk skala desa.
 *
 * Catatan: pemanggil HARUS mengecek collision ke DB sebelum insert
 * (lihat penggunaan di app/api/permohonan/route.ts & app/api/pengaduan/route.ts).
 */
export function generateTiket(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
