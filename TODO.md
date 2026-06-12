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
