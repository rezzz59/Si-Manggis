- [x] Konfirmasi scope: seragamkan style fase 1 (halaman publik tanpa dashboard)
- [x] Audit halaman publik utama dan komponen shared yang dipakai lintas halaman

## Homepage Redesign Besar (Referensi Baru)
- [x] Konfirmasi plan redesign homepage penuh sesuai referensi user
- [ ] Refactor hero 80vh: badge, headline, deskripsi, CTA ganda, bantuan link, foto udara + overlay
- [ ] Tambahkan floating statistics card di hero (31.000, 4.250 Ha, 51 RT/6 RW, Desa Perkebunan)
- [ ] Redesign section “Layanan yang Sering Diajukan” menjadi 6 service cards premium
- [ ] Tambahkan statistics banner full-width gradient hijau
- [ ] Tambahkan running announcement bar modern (ikon speaker + teks berjalan)
- [ ] Redesign section berita: featured kiri + 3 berita kanan
- [ ] Tambahkan section “Tentang Kelurahan” 2 kolom + list keunggulan
- [ ] Tambahkan footer dark-green 4 kolom + social icons
- [ ] Pastikan search/autocomplete homepage tetap berfungsi
- [ ] Review visual hierarchy, spacing, dan konsistensi tone

## Chatbot RAG (Pengetahuan Khusus Website)
- [x] Buat knowledge base lokal (`src/data/chatbot-kb.ts`)
- [x] Buat retrieval + answer builder (`src/lib/chatbot-rag.ts`)
- [x] Tambah endpoint chat (`app/api/chat/route.ts`)
- [x] Tambah widget chat (`src/components/ChatWidget.tsx`)
- [x] Pasang widget di layout (`app/layout.tsx`)
- [ ] Testing chat flow (UI + API) end-to-end

## Perbaikan Approval RT via WhatsApp
- [ ] Audit parser balasan RT (`setuju/tolak`) dan alur webhook Fonnte
- [ ] Tambahkan logging diagnostik pada webhook untuk identifikasi mismatch nomor RT/tiket/status
- [ ] Perbaiki pesan instruksi ke RT agar wajib menyertakan tiket
- [ ] Uji skenario balasan "setuju <tiket>" dan "tolak <tiket> <alasan>"

## Full Theme “Warna Manggis” (Scope B)
- [ ] Update token warna global di `app/globals.css`
- [ ] Refactor `src/components/Navbar.tsx` ke palet manggis
- [ ] Rapikan `app/login/page.tsx` agar konsisten token manggis
- [ ] Refactor `app/dashboard/layout.tsx` ke palet manggis
- [ ] Refactor `app/dashboard/page.tsx` ke palet manggis
- [ ] Refactor `app/dashboard/permohonan/page.tsx` ke palet manggis

## Modernisasi Halaman Admin Dashboard
- [ ] Upgrade `app/dashboard/layout.tsx` (sidebar + topbar profesional, active state lebih jelas)
- [ ] Upgrade `app/dashboard/page.tsx` (header modern, KPI cards lebih premium, panel list lebih rapi)
- [ ] Upgrade `app/dashboard/permohonan/page.tsx` (toolbar profesional, quick search client-side, tabel sticky header)
- [ ] Uji visual dan interaksi utama halaman admin (dashboard + permohonan)
