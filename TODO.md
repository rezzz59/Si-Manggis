# TODO - Surat Pengantar PDF Mapping & Robustness

- [x] Audit pemetaan field input -> posisi template di `src/components/surat-pdf-template.tsx`
- [x] Perkuat normalisasi enum/input di `app/api/surat/generate/route.tsx`
- [x] Pastikan fallback aman untuk nilai kosong/variasi penulisan
- [x] Perbaiki render background blanko agar selalu muncul di PDF hasil generate
- [x] Kalibrasi ulang koordinat overlay agar align ke template blanko (kolom kiri)
- [x] Ganti template ke 1 lembar (`BLANKO_PENGANTAR_RT_kiri.pdf`) dan hapus crop
- [ ] Kalibrasi manual koordinat berdasarkan referensi titik terbaru user
- [ ] Jalankan pengujian critical-path generate surat
- [ ] Verifikasi hasil PDF final terhadap blanko

## TODO - Fix 500 `/api/permohonan`

- [x] Audit endpoint `app/api/permohonan/route.ts` dan validasi frontend payload `FormLaporan`
- [x] Audit schema migration terkait (`permohonan`, `rt`, `laporan_status_log`)
- [x] Hardening route:
  - [x] Guard `RT_APPROVAL_TIMEOUT_HOURS` agar selalu valid
  - [x] Sinkronkan payload `sub_jenis` -> kolom DB `sub_layanan`
  - [x] Fallback insert untuk mismatch kolom `pendidikan_terakhir` vs `pendidikan`
  - [x] Jadikan insert `laporan_status_log` non-fatal (jangan memicu 500)
- [ ] Uji ulang alur submit permohonan dan pastikan tidak 500

## TODO - Fix WA RT tidak terkirim saat user kirim layanan

- [ ] Audit end-to-end alur kirim WA RT (`/api/permohonan` -> `sendFonnteWA` -> webhook)
- [x] Hardening `src/lib/fonnte.ts`:
  - [x] Normalisasi target nomor WA ke format aman `62...`
  - [x] Tambah header `Content-Type: application/x-www-form-urlencoded`
  - [x] Tambah validasi target kosong/tidak valid sebelum request
  - [x] Perjelas error mapping dari respons Fonnte (HTTP/JSON/body string)
- [ ] Pastikan payload kirim dari `app/api/permohonan/route.ts` selalu kirim nomor RT yang ternormalisasi
- [ ] Verifikasi kompatibilitas respons di endpoint test `/api/fonnte/send`
