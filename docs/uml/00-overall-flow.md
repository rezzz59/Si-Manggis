# Si-Manggis — Overall System Flow

## 1. Alur Lengkap Permohonan (Layanan)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  WARGA                                                                      │
│    │                                                                        │
│    └──► Buka website Si-Manggis ( http://localhost:3000/layanan )           │
│         │                                                                   │
│         ▼                                                                   │
│    Form Permohonan:                                                         │
│    ┌────────────────────────────────────────┐                               │
│    │ Nama Lengkap          : [____________] │                               │
│    │ NIK                   : [____________] │                               │
│    │ Alamat                : [____________] │                               │
│    │ Nomor HP/WA           : [____________] │                               │
│    │ Pilih RT              : [Dropdown RT 01-52] │                          │
│    │ Jenis Permohonan      : [Dropdown]     │                              │
│    │   - SKTM (Surat Keterangan Tidak Mampu)                              │  │
│    │   - Surat Domisili                                                   │  │
│    │   - Surat Pengantar KTP/KK                                           │  │
│    │   - Surat Keterangan Usaha                                           │  │
│    │   - Surat Keterangan Kelahiran                                       │  │
│    │   - Surat Keterangan Kematian                                        │  │
│    │   - Izin Keramaian                                                    │  │
│    │   - Lainnya                                                           │  │
│    │ Sub-jenis (jika Lainnya): [________] │                               │
│    │ Deskripsi/Keperluan    : [____________] │                             │
│    └────────────────────────────────────────┘                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         │ POST /api/permohonan
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  SISTEM — API SERVER                                                        │
│                                                                              │
│    1. Validasi field wajib (nama, alamat, telepon, jenis, nomor_rt)         │
│    2. Generate nomor tiket unik: #TK-XXXXXXXX (8 karakter acak)             │
│    3. Insert ke tabel `permohonan` — status awal: MENUNGGU                  │
│    4. Ambil nomor WA RT tujuan dari tabel `rt` berdasarkan nomor_rt          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ├────────────────────────────────────────┐
         │                                        │
         ▼                                        ▼
┌───────────────────────┐          ┌───────────────────────────────┐
│  cek: no_wa_rt RT ?   │          │  cek: no_wa_rt RT NULL ?     │
│  (RT PUNYA WhatsApp)  │          │  (RT TIDAK PUNYA WA)         │
└───────────┬───────────┘          └──────────────┬────────────────┘
            │                                         │
            │                                         ▼
            │               ┌──────────────────────────────────────┐
            │               │  STATUS: MENUNGGU                       │
            │               │  Langsung masuk ke dashboard staff      │
            │               │  tidak perlu tunggu konfirmasi RT      │
            │               └──────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  KIRIM WHATSAPP KE RT via Fonnte API                                       │
│                                                                              │
│  Pesan yang dikirim:                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │  🔔 LAPORAN BARU — RT [nomor_rt]                                  │      │
│  │                                                                   │      │
│  │  👤 Nama    : [nama warga]                                        │      │
│  │  🪪 NIK      : [nik warga]                                        │      │
│  │  📍 Alamat  : [alamat], RT [nomor_rt]                             │      │
│  │  📱 WA       : [telepon warga]                                    │      │
│  │  ────────────────────────────────                                   │      │
│  │  📄 Jenis    : [jenis permohonan]                                 │      │
│  │  📝 Isi       : [deskripsi]                                        │      │
│  │  ────────────────────────────────                                   │      │
│  │  ✅ Balas SETUJU untuk approve                                     │      │
│  │  ❌ Balas TOLAK [alasan] untuk tolak                               │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│  Nomor tujuan: dari kolom `no_wa_rt` tabel RT                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  DASHBOARD STAFF — http://localhost:3000/dashboard/permohonan               │
│                                                                              │
│  Staff Kelurahan melihat daftar permohonan masuk:                            │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Tiket    │ Nama      │ Jenis        │ RT  │ Status    │ Aksi    │    │  │
│  │ #TK-A12B │ Budi S.   │ SKTM         │ 05  │ MENUNGGU  │ [Lihat] │    │  │
│  │ #TK-C34D │ Sari W.   │ Surat Domisili│ 12  │ MENUNGGU  │ [Lihat] │    │  │
│  │ #TK-E56F │ Ahmad R.  │ SKTM         │ 03  │ DISETUJAI_RT│ [Lihat]│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Jika RT tanpa WA → muncul catatan: "⚠️ RT ini tidak punya WA"             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌──────────────────────────┐              ┌──────────────────────────────────┐
│  OLEH RT (via WhatsApp)   │              │  OLEH STAFF (via telepon manual) │
│                           │              │                                  │
│  RT收到 WA, baca pesan     │              │  Staff buka detail permohonan    │
│  RT balas: SETUJU          │              │  Staff TELEPON RT:              │
│  ─────────────────────     │              │  "Pak RT 05, ada permohonan dari │
│ atau                                              Budi atas nama..."          │
│  RT balas: TOLAK [alasan]  │              │                                  │
│                           │              │  RT approve / tolak via telepon  │
│  Sistem terima balasan     │              │  Staff catat hasil di sistem:   │
│  via Fonnte Webhook        │              │                                  │
│  (/api/fonnte/webhook)     │              │  ┌─────────────────────────┐   │
│                           │              │  │ Catatan: [TLpn RT, Setujui│  │
│  Sistem update status      │              │  │ std tgl 26/05 - Bud]    │   │
│  ke DISETUJAI_RT           │              │  └─────────────────────────┘   │
│  atau DITOLAK_RT           │              │                                  │
│                           │              │  Staff ubah status:              │
│                           │              │  DISETUJAI_RT / DITOLAK_RT /      │
│                           │              │  DIPROSES / SELESAI              │
│                           │              │                                  │
└───────────┬───────────────┘              └──────────────┬───────────────────┘
            │                                               │
            └──────────────────┬───────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  LOG STATUS — Tabel laporan_status_log                                       │
│                                                                              │
│  Setiap perubahan status dicatat:                                            │
│  - from_status → to_status                                                   │
│  - changed_by (staff login / RT via WA)                                     │
│  - changed_at (timestamp)                                                    │
│  - note (catatan staff / alasan RT)                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  STAFF PROSES PERMOHONAN                                                     │
│                                                                              │
│  1. Staff buka detail permohonan di dashboard                                │
│  2. Staff proses (buat surat, verifikasi data, dll)                         │
│  3. Staff update status:                                                      │
│     DIPROSES → prosesing surat                        │
│     SELESAI  → surat jadi, siap diambil Warga                             │
│     DITOLAK  → ditolak, warga perlu perbaikan                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │ Status Path:                                                            │     │
│  │                                                                       │     │
│  │  MENUNGGU ───[RT approve via WA/Telp]──► DISETUJAI_RT                │     │
│  │  MENUNGGU ───[RT tolak via WA]──────────► DITOLAK_RT                │     │
│  │  MENUNGGU ───[Staff cek 1x24 jam tnp balasan]─► DISETUJAI_RT*       │     │
│  │  DISETUJAI_RT ───[Staff proses]──────► DIPROSES                       │     │
│  │  DIPROSES ────[Surat selesai]────────► SELESAI                         │     │
│  │  DIPROSES ────[Ditolak kelurahan]──► DITOLAK                         │     │
│  │                                                                       │     │
│  │  * auto-approve setelah 24 jam jika RT tidak merespon (opsional)     │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────��───────────────────────────────────────────────────┐
│  NOTIFIKASI WHATSAPP KE WARGA via Fonnte (saat status berubah)              │
│                                                                              │
│  Contoh pesan ke warga saat SELESAI:                                        │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │  ✅ SURAT ANDA SIAP DIAMBIL                                        │      │
│  │                                                                   │      │
│  │  Tiket   : #[tiket]                                              │      │
│  │  Jenis   : [jenis permohonan]                                    │      │
│  │  Status  : SELESAI                                               │      │
│  │                                                                   │      │
│  │  Silakan ambil surat di Kantor Kelurahan Guntungan Manggis       │      │
│  │  pada jam kerja (Senin-Jumat, 08.00-16.00).                     │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Alur Lengkap Pengaduan (Keluhan Warga)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  WARGA                                                                      │
│    │                                                                        │
│    └──► Buka website Si-Manggis ( http://localhost:3000/layanan )           │
│         │                                                                   │
│         ▼                                                                   │
│    Form Pengaduan:                                                          │
│    ┌────────────────────────────────────────────┐                            │
│    │ Nama Lengkap          : [____________]  (*) WAJIB                      │
│    │ Nomor HP/WA           : [____________]                                │
│    │ Email                 : [____________]                                │
│    │ Topik Pengaduan       : [Dropdown]       (*) WAJIB                    │
│    │   - Infrastruktur (jalan, lampu, drainase)                            │
│    │   - Keamanan / Ketertiban                                             │
│    │   - Kebersihan / Lingkungan                                           │
│    │   - Pelayanan Publik                                                  │
│    │   - Penyalahgunaan Dana RT                                             │
│    │   - Lainnya                                                           │
│    │ Isi Pengaduan          : [____________________________] (*) WAJIB      │
│    └────────────────────────────────────────────┘                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         │ POST /api/pengaduan
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  SISTEM — API SERVER                                                        │
│                                                                              │
│    1. Validasi field wajib (nama, topik, pesan)                             │
│    2. Generate nomor tiket unik untuk pengaduan                             │
│    3. Insert ke tabel `pengaduan` — status default: MENUNGGU              │
│    4. TIDAK ada proses RT disyaratkan (pengaduan langsung ke Kelurahan)    │
│    5. Insert ke`laporan_status_log` — created                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  DASHBOARD STAFF — http://localhost:3000/dashboard/pengaduan                │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ #PD-A1B2 │Anang K. │ Infrstruktur       │MENUNGGU│ 26/05  │ [Lihat]  │  │
│  │ #PD-C3D4 │Dewi M. │ Keamanan           │DIPROSES│ 25/05  │ [Lihat]  │  │
│  │ #PD-E5F6 │Heri S. │ Penyalahgunaan Dana│SELESAI │ 24/05  │ [Lihat]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Staff bisa:                                                                │
│  - Klik [Lihat] → lihat detail + historique                                 │
│  - Ganti status: MENUNGGU / DIPROSES / SELESAI / DITOLAK                    │
│  - Tambah catatan                                                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PROSES SELESAI / DITOLAK                                                    │
│                                                                              │
│  Staff:                                                                     │
│  1. Tindak lanjuti pengaduan warga                                          │
│  2. Update status: DIPROSES → SELESAI (jika sudah ditindaklanjuti)          │
│                        atau DITOLAK (jika tidakvalid/outside authority)      │
│  3. Kirim notifikasi WA ke warga via Fonnte                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  WARGA CEK STATUS PENGADUAN                                                  │
│                                                                              │
│  Warga buka http://localhost:3000/cek-tiket                                  │
│  Input nomor tiket → lihat status pengaduan                                 │
│  Tidak perlu login                                                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Use Case Diagram — Actor & Fitur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Si-Manggis USE CASE DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   WARGA       │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌────────────────┐
│Submit Form   │  │Cek Status     │  │Baca Artikel   │
│Permohonan    │  │Tiket Online   │  │& Berita       │
│(tanpa login) │  │(tanpa login)  │  │(publik)       │
└──────────────┘  └──────────────┘  └────────────────┘
        │
        │
        └─────────────────────────── RT tanpa WA ───────► [ keinipun ]
                                                        (Stafftelepon RT)


                    ┌─────────────────┐
                    │  RT (ketua 1-52)│
    ┌───────────────┴────────────────┴───────────────┐
    │                                                  │
    ▼                                                  ▼
┌──────────────────────┐               ┌─────────────────────────────┐
│ Receive WA notif     │               │Approve / Tolak via WA       │
│ (RT punya WA saja)  │               │Balas "SETUJU" atau           │
└──────────────────────┘               │"TOLAK [alasan]"              │
                                       └──────────────────────────────┘


                    ┌─────────────────┐
                    │  STAFF KELURAHAN│
    ┌───────────────┴────────────────┴───────────────┐
    │                                                  │
    │     ┌──────────┐  ┌──────────────┐  ┌──────────────┐
    │     │Dashboard │  │ Update status│  │ Kirim WA     │
    │     │Permohonan│  │ permohonan   │  │ notif ke     │
    │     │& Pengaduan│  │ & pengaduan   │  │ warga        │
    │     └──────────┘  └──────────────┘  └──────────────┘
    │                                                  │
    │     ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │     │ Hubungi RT   │  │Kelola aset   │  │Kelola konten     │
    │     │ via telepon  │  │website (CMS) │  │homepage & artikel│
    │     │(RT tanpa WA)│  └──────────────┘  └──────────────────┘
    │     └──────────────┘
    │


                    ┌─────────────────┐
                    │    SISTEM       │
    ┌───────────────┴────────────────┴───────────────┐
    │                                                  │
    │  • Auto-generate nomor tiket                    │
    │  • Kirim WA ke RT (via Fonnte)                  │
    │  • Terima balasan RT via Fonnte Webhook          │
    │  • Notifikasi WA ke warga saat status berubah    │
    │  • Logging semua perubahan status                │
    │  • Autentikasi staff (Next-Auth)               │
    │  • Protect dashboard routes (middleware)       │
    │  • Serve halaman publik (artikel, cek tiket)   │
    │  • AutorespondaiWA untuk RT tanpa WA (log)    │
    │

                    ┌─────────────────┐
                    │   FOONTE API     │
                    └───────┬──────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│Kirim WA ke RT│  │Kirim WA ke   │  │ Terima inbound WA   │
│(notifikasi   │  │Warga (status │  │ balasan dari RT     │
│permohonan baru)│  │berubah)     │  │ ("SETUJU"/"TOLAK")  │
└──────────────┘  └──────────────┘  └──────────────────────┘

```

---

## 4. Sequence Diagram — End-to-End (RT Punya WA)

```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│  WARGA  │  │ SISTEM  │  │FOONTE API│  │   RT    │  │ STAFF   │  │SUPABASE │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │            │            │
     │ 1.Submit   │            │            │            │            │
     │permohonan   │            │            │            │            │
     │────────────►│            │            │            │            │
     │            │ 2.Insert   │            │            │            │
     │            │data+generate│            │            │            │
     │            │tiket        │            │            │            │
     │            │────────────────────────────────────►│            │
     │            │            │            │            │            │► INSERT
     │            │            │            │            │            │◄ OK
     │            │            │            │            │            │
     │            │ 3.Cek no_wa │            │            │            │
     │            │RT            │            │            │            │
     │            │─────────────────────────────────────►│            │
     │  kirim WA  │            │            │            │            │
     │ke RT baru   │            │            │            │            │
     │◄───────────│            │            │            │            │
     │            │ 4.Kirim.WA │            │            │            │
     │            │------------►│  WA ke RT  │            │            │
     │            │            │            │            │            │
     │            │            │            │ 5.Baca WA  │            │
     │            │            │            │  balas     │
     │            │            │            │ "SETUJU"    │
     │            │            │◄───────────│            │            │
     │            │ 6.Fonnte   │            │            │            │
     │            │Webhook POST│            │            │            │
     │            │◄───────────│            │            │            │
     │            ���            │            │            │            │
     │            │ 7.Update   │            │            │            │
     │            │status=>DISET│            │            │            │
     │            │UJAI_RT      │            │            │            │
     │            │─────────────────────────────────────►│            │
     │            │            │            │            │            │► UPDATE
     │            │            │            │            │            │◄ OK
     │            │            │            │            │            │
     │            │ 8.Log status│            │            │            │
     │            │─────────────────────────────────────►│            │
     │            │            │            │            │            │► INSERT log
     │            │            │            │            │            │◄ OK
     │            │            │            │            │            │
     │            │            │ 9.Conf WA  │            │            │
     │            │            │ke RT ok    │            │            │
     │            │            │◄───────────│            │            │
     │            │            │            │            │            │
```

---

## 5. Database Schema (Summary)

```
┌─────────────────┐       ┌──────────────────────┐
│     rt          │       │    permohonan        │
├─────────────────┤       ├──────────────────────┤
│ id (PK)         │       │ id (PK)             │
│ nomor_rt        │◄──────│ nomor_rt            │
│ nama_ketua      │       │ nama                 │
│ no_wa_rt ───────┼──┐    │ nik                  │
│ rw_id           │  │    │ alamat               │
│ created_at      │  │    │ telepon              │
│ updated_at      │  │    │ layanan              │
│ has_whatsapp    │  │    │ status ──────────────────► lihat flow status
│ whatsapp_aktif  │  │    │ catatan              │
└─────────────────┘  │    │ ...rt fields...     │
       ▲             │    └──────────────────────┘
       │             │                  │
       │             │    ┌──────────────────────┐
       │             │    │laporan_status_log   │
       │             │    ├──────────────────────┤
       │             │    │ id (PK)             │
       │             │    │ laporan_id          │◄── (FK → permohonan.id)
       │             │    │ from_status         │
       │             │    │ to_status           │
       │             │    │ changed_by          │
       │             └──► │ changed_at          │
       │                  │ note                │
       │                  └──────────────────────┘
       │
       │                  ┌──────────────────────┐
       │                  │    pengaduan         │
       │                  │ (tidak terkait RT)  │
       │                  ├──────────────────────┤
       │                  │ id (PK)             │
       │                  │ tiket               │
       │                  │ nama                 │
       │                  │ telepon             │
       │                  │ email                │
       │                  │ topik                │
       │                  │ pesan                │
       │                  │ status               │
       │                  │ created_at           │
       │                  │ updated_at           │
       │                  └──────────────────────┘
       │
       │                  ┌──────────────────────┐
       │                  │    staff              │
       │                  ├──────────────────────┤
       │                  │ id (PK)             │
       │                  │ email (unique)      │
       │                  │ nama                 │
       │                  │ password (bcrypt)    │
       │                  │ created_at           │
       │                  │ updated_at           │
       │                  └──────────────────���───┘
```

---

## 6. Perbandingan: Permohonan vs Pengaduan

| Aspek | Permohonan (Layanan) | Pengaduan |
|---|---|---|
| **Warga harus pilih RT?** | Ya — harus pilih nomor RT | Tidak — tidak ada RT |
| **RT perlu approve?** | Ya — persetujuan RT diperlukan | Tidak — langsung ke Kelurahan |
| **Proses WA RT?** | Ya — kirim notifikasi ke RT via WA | Tidak ada |
| **Proses WA warga?** | Ya — notifikasi saat selesai | Ya — notifikasi saat diproses/ditolak |
| **Bisa tanpa RT punya WA?** | Ya — staff telepon manual | N/A |
| **Di dashboard siapa?** | Staff Kelurahan + RT (via WA) | Staff Kelurahan saja |

---

## 7. Ringkasan Role & Responsibilities

| Actor | Tanggung Jawab |
|---|---|
| **Warga** | Submit permohonan/pengaduan via web. Cek status via cek-tiket |
| **RT (punya WA)** | Cek WA masuk, balas "SETUJU" atau "TOLAK [alasan]" |
| **RT (tanpa WA)** | Terima telepon dari Staff Kelurahan |
| **Staff Kelurahan** | Terima & proses permohonan di dashboard; telepon RT tanpa WA; proses pengaduan; ubah status; kirim WA ke warga |
| **Fonnte API** | Kirim & terima pesan WhatsApp (otomatisasi) |
| **Sistem Si-Manggis** | Generator tiket; router notifikasi WA; webhook handler; autentikasi staff; logging semua aktivitas |
