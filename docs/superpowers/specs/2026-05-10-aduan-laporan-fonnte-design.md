# Spec: Sistem Laporan/Aduan Warga via Fonnte WhatsApp

**Tanggal:** 2026-05-10
**Status:** Draft — menunggu review stakeholder

---

## 1. Tujuan & Ringkasan

Digitalisasi penuh alur laporan dan aduan warga — dari submit web, notifikasi WA ke RT, approve RT via balasan WA, sampai surat siap di-download. Menggunakan **1 nomor Fonnte central** yang mengirim ke semua 52 RT.

**Goal akhir:** Warga cukup isi form → RT approve via WA → dapat surat. Tanpa harus datang langsung ke kantor kelurahan.

---

## 2. Asumsi Dasar

| Asumsi | Keterangan |
|--------|------------|
| 1 nomor Fonnte central | Satu device/nomor yang kirim ke semua RT |
| RT punya nomor WA masing-masing | Sudah tersimpan di database |
| RT gaptek | Approval cukup ketik "SETUJU" — no dashboard login |
| RT reply ke nomor Fonnte | Balasan RT masuk ke sistem via webhook Fonnte |
| Warga pilih RT manual | Input di form, tanpa login/autentikasi NIK |

---

## 3. Database Schema

### Tabel `rt` — Data RT

```sql
id            uuid PRIMARY KEY
nomor_rt      varchar(3)    -- "01", "02", ..., "52"
nama_ketua    varchar(100) -- nama ketua RT
no_wa_rt      varchar(20)  -- nomor WA RT (format: 08xxxxxxxx)
rw_id         uuid         -- FK ke rw (nullable)
created_at    timestamp
```

### Tabel `laporan` — Laporan/Aduan Warga

```sql
id                  uuid PRIMARY KEY
nomor_rt            varchar(3)    -- RT pelapor
nama_pelapor        varchar(100)
nik                 varchar(16)
alamat              text
no_wa_pelapor       varchar(20)
jenis               varchar(50)   -- "surat_izin", "surat_keterangan", "aduan"
sub_jenis           varchar(100) -- "domisili", "pengantar_nikah", dll
deskripsi           text
lampiran_url        text[]        -- array URL lampiran (nullable)

status              varchar(30)   --详见 Section 4

fonnte_message_id   varchar(100) -- ID pesan WA yang dikirim ke RT
rt_approved_at      timestamp    -- kapan RT approve
rt_approved_via     varchar(20)  -- "whatsapp" / "manual"

kelurahan_approved_at timestamp
surat_url           text          -- link surat final (nullable)

created_at          timestamp
updated_at           timestamp
```

### Tabel `laporan_status_log` — Audit Trail

```sql
id            uuid PRIMARY KEY
laporan_id    uuid FK
from_status   varchar(30)
to_status     varchar(30)
changed_by    varchar(50)   -- "sistem", "RT 05", "Kelurahan"
changed_at    timestamp
note          text          -- nullable
```

---

## 4. Status Flow

```
menunggu_rt
    │
    │ RT bales "SETUJU" (via WA)
    ↓
disetujui_rt
    │
    │ Staff Kelurahan proses
    ↓
proses_kelurahan
    │
    │ Kelurahan approve / generate surat
    ↓
selesai → surat_url terisi, WA ke warga
```

**Status detail:**

| Status | Keterangan | Aksi |
|--------|------------|------|
| `menunggu_rt` | Laporan masuk, belum disetujui RT | Sistem kirim WA ke RT |
| `disetujui_rt` | RT sudah approve, menunggu proses Kelurahan | Sistem kirim WA ke Kelurahan |
| `proses_kelurahan` | Kelurahan sedang memproses | Manual oleh staff |
| `ditolak_rt` | RT menolak laporan | WA ke warga (opsional) |
| `ditolak_kelurahan` | Kelurahan menolak | WA ke warga + alasan |
| `selesai` | Surat siap diunduh | WA ke warga + link download |

---

## 5. Form Field (Halaman Submit)

```
┌──────────────────────────────────────────┐
│  Form Laporan / Pengajuan Surat           │
│                                          │
│  Nama Lengkap        [_______________]    │
│  NIK                 [_______________]    │
│  Alamat              [_______________]    │
│  RT                  [Dropdown ▼ RT 01-52]│
│  No. WA              [_______________]    │
│                                          │
│  Jenis Pengajuan     [Dropdown ▼]         │
│    - Surat Izin Tinggal                   │
│    - Surat Keterangan                     │
│    - Surat Pengantar                      │
│    - Pengaduan / Aspirasi                 │
│                                          │
│  Sub Jenis          [Dropdown ▼]         │
│                                          │
│  Deskripsi / Isi     [________________]   │
│  Laporan             [________________]   │
│                     [________________]   │
│                                          │
│  Lampiran (opsional) [Pilih File]        │
│                                          │
│  [        KIRIM LAPORAN        ]         │
└──────────────────────────────────────────┘
```

**Validasi:**
- Nama, NIK, alamat, RT, jenis, deskripsi — required
- NIK — 16 digit, numeric
- No. WA — valid format Indonesia (08x)
- RT — dropdown dari data `rt` table

---

## 6. Format Pesan WA

### 6a. WA ke RT (saat warga submit)

```
📋 Laporan Baru Masuk

━━━━━━━━━━━━━━━━━━
Dari  : [Nama Pelapor]
NIK   : [NIK]
Alamat: [Alamat], RT [XX]
WA    : [No WA Pelapor]
━━━━━━━━━━━━━━━━━━

Jenis : [Jenis] — [Sub Jenis]
Isi   :
[Deskripsi singkat...]

━━━━━━━━━━━━━━━━━━
Ketik SETUJU untuk menyetujui.
Ketik TOLAK [alasan] untuk menolak.
━━━━━━━━━━━━━━━━━━
```

### 6b. WA ke RT (konfirmasi approve)

```
✅ Laporan telah disetujui.

RT [XX] → Kelurahan
━━━━━━━━━━━━━━━━━━
Layanan : [Jenis]
Pemohon : [Nama]
━━━━━━━━━━━━━━━━━━
Kelurahan akan segera memproses.
```

### 6c. WA ke Warga (saat selesai)

```
🎉 Laporan Anda telah diproses!

━━━━━━━━━━━━━━━━━━
No. Referensi : [ID Laporan]
Jenis         : [Jenis]
Status        : SURAT SIAP
━━━━━━━━━━━━━━━━━━

Surat Anda siap diunduh:
[Link Download]

Terima kasih atas kepercayaan
Anda kepada Kelurahan Guntung Manggis.
```

---

## 7. Fonnte Integration

### Outbound (Kirim WA)

```
POST https://gateway.fonnte.com/api/send-message
Headers:
  Authorization: [TOKEN_FONNTE]

Body:
{
  "target": "08xxxxxxxx",
  "message": "...",
  "countryCode": "+62"
}
```

### Inbound (Terima Balasan RT)

Fonnte supports **webhook** untuk menerima pesan masuk. Setup:

1. Di dashboard Fonnte → set webhook URL ke:
   ```
   https://[domain]/api/webhook/fonnte
   ```
2. Setiap kali RT balas "SETUJU", Fonnte POST ke webhook kita:

```
POST /api/webhook/fonnte
Body:
{
  "from": "08xxxxxxxx",
  "message": "SETUJU",
  "device_id": "...",
  "timestamp": "..."
}
```

3. Sistem proses:
   - Lookup `no_wa_rt` di tabel `rt`
   - Cari laporan terbaru dengan status `menunggu_rt` & RT terkait
   - Update status → `disetujui_rt`
   - Log ke `laporan_status_log`
   - Kirim WA ke Kelurahan
   - Balas WA ke RT: "✅ Laporan disetujui."

---

## 8. Halaman / Dashboard Kelurahan

```
┌──────────────────────────────────────────────────────┐
│  Si-Manggis — Panel Kelurahan                        │
│                                                       │
│  [Tab: Semua] [Menunggu] [Proses] [Selesai] [Ditolak]│
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ #00123 | Ahmad | RT 05                        │  │
│  │ Surat Keterangan Domisili                     │  │
│  │ Status: ⏳ Menunggu RT                         │  │
│  │ 10 Mei 2026 14:30                             │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ #00122 | Budi | RT 12                         │  │
│  │ Pengaduan: Jalan Rusak                         │  │
│  │ Status: ✅ Disetujui RT (2 jam lalu)           │  │
│  │              [PROSES SEKARANG]                 │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Fitur Panel Kelurahan:**
- List semua laporan (filterable by status, RT, jenis)
- Tombol "PROSES SEKARANG" → ubah status + upload surat
- Tombol "TOLAK" + input alasan
- View detail lengkap termasuk lampiran
- Export laporan (CSV/PDF) per bulan

---

## 9. Halaman Pantau Status (Warga)

Warga bisa cek status menggunakan ID laporan yang diberikan saat submit.

```
/lacak?id=00123
```

```
┌──────────────────────────────────────┐
│  Lacak Pengajuan #00123              │
│                                      │
│  ✅ Submit         10 Mei 14:30      │
│  ────────────────────────────────    │
│  ⏳ Menunggu RT   10 Mei 14:31       │
│  ────────────────────────────────    │
│  ❌ Proses        -                    │
│  ────────────────────────────────    │
│  ❌ Selesai       -                    │
│                                      │
│  Surat siap? → [Download Surat]       │
└──────────────────────────────────────┘
```

---

## 10. Routing WA Berdasarkan RT

Data RT di-load dari tabel `rt`. Saat warga submit:

1. Warga pilih RT dari dropdown
2. Sistem lookup nomor WA RT terkait dari tabel `rt`
3. Kirim WA dari 1 nomor Fonnte central → ke nomor WA RT tersebut
4. RT balas → webhook detect dari nomor WA RT → update laporan terkait

**Pastikan nomor WA RT 01–52 sudah ter-entry di tabel `rt` sebelum sistem live.**

---

## 11. edge Cases & Error Handling

| Case | Handling |
|------|----------|
| RT bales pesan nggak valid ("ok", "siap", dll) | Ignore, sistem abaikan. Tidak ubah status. |
| RT bales setelah status sudah bukan `menunggu_rt` | Abaikan. Log untuk audit. |
| Warga submit tapi nomor WA RT tidak ditemukan | Error: "Sistem belum punya data WA RT ini. Hubungi kelurahan." |
| Fonnte webhook gagal (timeout/error) | Retry 3x dengan exponential backoff. Alert ke admin. |
| Kelurahan proses tapi surat belum ready | Status `proses_kelurahan`, bisaubahtidak ada bataswaktu. |
| Warga input RT yang salah (bukan domisili sebenarnya) | Kelurahan bisa abaikan / tolak. Diserahkan ke validasi RT. |

---

## 12. Yang Perlu Dipersiapkan Sebelum Implementasi

- [ ] Nomor WA dan token API Fonnte (1 device central)
- [ ] Data nomor WA seluruh 52 RT (di-entry ke tabel `rt`)
- [ ] Domain/server yang accessible publik (untuk webhook Fonnte)
- [ ] Jenis layanan yang akan dibuka (surat keterangan apa aja?)

---

## 13. Estimasi Effort

| Komponen | Complexity |
|----------|-----------|
| Database migration (tabel baru) | Rendah |
| API route Fonnte outbound | Rendah |
| API route webhook Fonnte inbound | Sedang |
| Form submit laporan | Sedang |
| Dashboard Kelurahan | Sedang |
| Halaman lacak status | Rendah |
| WA message formatting utility | Rendah |
| Full integration + testing | Sedang |

**Total estimate:** ~3–5 hari kerja (full stack)
