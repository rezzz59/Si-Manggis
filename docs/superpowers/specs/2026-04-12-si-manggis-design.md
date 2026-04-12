# Si-Manggis — Desain Sistem

**Tanggal:** 12 April 2026
**Status:** Draft
**Author:** Claude + User

---

## 1. Ringkasan

Portal layanan desa digital untuk **Desa Guntung Manggis**, Kalimantan Selatan dengan **51 RT** dan **~31.000 warga**.

### Tujuan
- Warga mendapat akses mudah ke layanan desa dan informasi darurat
- Village officer mengelola pengajuan dengan routing otomatis ke RT terkait
- RT officer menerima notifikasi via WhatsApp (bukan website —考虑到 gaptek)

### Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Lucide React icons
- Google Maps Embed untuk peta darurat
- Fonnte WhatsApp Gateway untuk notifikasi RT

---

## 2. Halaman yang Dibangun

### A. `/darurat` — Informasi Darurat (Tanpa Login)

**Tujuan:** Warga langsung lihat kontak darurat tanpa hambatan login.

**Konten per kategori:**

| Kategori | Info |
|----------|------|
| 🚒 Damkar | Nama pos, alamat, nomor telepon, jam operasional, Google Maps |
| 🚑 Ambulans | Kontak utama, nomor cadangan, lokasi berangkat, jam operasional |
| 🏥 Poskesdes | Nama, alamat, jadwal buka, nomor telepon, Google Maps |

**Desain:**
- Hero section kecil dengan latar warna kategori (oranye=darurat)
- 3 kartu besar, masing-masing kategori
- Di dalam kartu: info kontak (bisa tap untuk langsung telepon via `tel:`)
- Google Maps embed di bawah setiap kartu
- Mobile-first: semua dalam 1 scroll

**Teknis:**
- Static page (`app/darurat/page.tsx`)
- Data kontak di dalam file component (hardcoded untuk awal)
- Google Maps via `<iframe>` embed

---

### B. `/profil` — Profil Desa (Tanpa Login)

**Tujuan:** Warga ketahui identitas dan pemerintahan desa.

**Konten per section:**

1. **Identitas Desa**
   - Nama, kecamatan, kabupaten, provinsi, kode pos, luas wilayah

2. **Sejarah Singkat**
   - Text paragraphs tentang bagaimana desa terbentuk

3. **Struktur Pemerintah Desa**
   - Cards untuk: Kepala Desa, Sekretaris Desa, Kaur, Kasi
   - Nama, jabatan, foto placeholder

4. **Visi Misi**
   - Visi: 1 paragraf
   - Misi: list 3-5 poin

5. **Demografi**
   - Jumlah penduduk, mata pencaharian utama, jumlah RT/RW

**Desain:**
- Alternating sections: text kiri, data kanan
- Consistent dengan palette Emerald/Teal + Orange accent

**Teknis:**
- Static page (`app/profil/page.tsx`)
- Data di component (bisa dipisah ke `src/data/profil-desa.ts`)

---

### C. `/layanan` — Layanan Desa (Butuh Login)

**Tujuan:** Warga ajukan pengajuan surat/layanan, sistem routing ke RT terkait.

**Page Structure:**

```
/layanan              — Landing halaman layanan
/layanan/aju/[jenis] — Formulir pengajuan per jenis layanan
/masuk                — Halaman login/register
/admin                — Dashboard village officer (TODO Fase 2)
```

**Jenis Layanan (Phase 1):**

| No | Jenis | Deskripsi | RT Notify? |
|----|-------|-----------|------------|
| 1 | Surat Keterangan Domisili | Pengajuan surat domisili | ✅ |
| 2 | Surat Pengantar RT | Pengantar dari RT (keperluan khusus) | ✅ (auto) |
| 3 | Surat Keterangan Usaha | Surat usaha warga | ✅ |
| 4 | Pendaftaran Bantuan Sosial | Daftar menerima bantuan | ✅ |
| 5 | Izin Keramaian | Izin kegiatan warga | ❌ (desa only) |
| 6 | Pembayaran Retribusi | Pembayaran iuran desa | ❌ (desa only) |

**Formulir Pengajuan:**

Fields yang sama untuk semua jenis:
- Nama lengkap (text)
- NIK (text, 16 digit)
- Alamat lengkap (text)
- **RT** (dropdown: RT 01 — RT 51)
- **RW** (dropdown: RW 01 — RW 06)
- Nomor WhatsApp warga (untuk konfirmasi)
- Jenis layanan (dari page sebelumnya)
- Deskripsi / keperluan (textarea)
- Upload lampiran (optional, max 2MB)

**Alur Pengajuan:**

1. Warga login → pilih jenis layanan → isi formulir
2. Sistem identifikasi RT warga → lookup nomor WA RT
3. Sistem kirim **WA ke RT officer** via Fonnte (Phase 1: notifikasi WA, Phase 2: auto-send)
4. Village officer lihat di dashboard (Phase 2)
5. Status: `menunggu` → `diproses` → `selesai` / `ditolak`

**Desain Formulir:**
- Clean, step-by-step feel
- Progress indicator (1. Data Diri → 2. Alamat → 3. Detail → 4. Konfirmasi)
- Validasi inline per field
- Tombol "Ajukan" di akhir

**Teknis:**
- Next.js App Router
- Form handling: React Hook Form atau native
- Auth: NextAuth.js atau custom (TODO decide)
- Database: Prisma + PostgreSQL/SQLite (TODO decide)
- Fonnte API untuk WhatsApp (TODO Phase 2)

---

## 3. Data Model

### User (Village Officer)
```
id, nama, username, passwordHash, role (kepala_desa | sekretaris | kaur | kasi)
```

### RT Officer
```
id, nomorRT, nomorWA, namaOfficer, rw
```
*Data ini dikumpulin nanti, untuk Phase 1 di-seed manual atau kosong.*

### Pengajuan
```
id, wargaId, jenisLayanan, rtId, status (menunggu|diproses|selesai|ditolak),
deskripsi, lampiran, createdAt, updatedAt, catatanOfficer
```

### Warga
```
id, nama, nik, alamat, rt, rw, whatsapp
```

---

## 4. WhatsApp Integration (Fonnte)

**Kapan dikirim:**
- Pengajuan baru masuk → kirim WA ke RT officer terkait

**Template Pesan:**
```
📢 *Pengajuan Baru - Si-Manggis*

Jenis: [jenis layanan]
Nama: [nama warga]
Alamat: [alamat], RT [nomor RT]/RW [nomor RW]
NIK: [NIK]

Mohon diproses. Terima kasih.
```

**TODO Phase 1:**
- Formulir dan routing selesai
- Nomor WA RT di-seed manual (dummy)
- WhatsApp push Phase 2 (nomor WA RT aktual)

---

## 5. Halaman Todo / Pengaduan (Tanpa Login)

**TODO:**

- Halaman info kontak desa
- Form pengaduan tanpa login (text only)
- Pengaduan masuk ke village officer (dashboard)

*Scope Phase 2.*

---

## 6. Roadmap

### Phase 1 — Minggu 1 (Deadline: ~19 April 2026)

- [ ] `/darurat` — halaman informasi darurat
- [ ] `/profil` — halaman profil desa
- [ ] `/layanan` — landing + form pengajuan (tanpa WA, data RT dummy)
- [ ] `/masuk` — halaman login

### Phase 2 — Minggu 2

- [ ] Dashboard village officer
- [ ] Routing otomatis berdasarkan RT
- [ ] Fonnte WhatsApp integration
- [ ] `/kontak` + form pengaduan
- [ ] Data RT aktual (51 RT)

---

## 7. Open Questions

1. **Database:** PostgreSQL atau SQLite untuk awal?
2. **Auth:** NextAuth.js atau custom JWT?
3. **Fonnte:** Akun sudah ada atau belum?
4. **Nomor WA RT:** siapa yang kumpulkan?
5. **Hosting:** deploy где?
