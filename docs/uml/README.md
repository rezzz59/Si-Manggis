# Si-Manggis — UML Documentation

10 diagram yang mengcover seluruh arsitektur sistem.

## Diagram List

| # | File | Jenis | Deskripsi |
|---|---|---|---|
| 01 | `01-use-case-diagram.puml` | Use Case | Semua aktor & use case dalam sistem |
| 02 | `02-activity-permohonan-flow.puml` | Activity | Alur lengkap permohonan surat/layanan |
| 03 | `03-sequence-permohonan.puml` | Sequence | Detail sequence permohonan dari submit sampai selesai |
| 04 | `04-activity-pengaduan-flow.puml` | Activity | Alur lengkap pengaduan warga |
| 05 | `05-sequence-pengaduan.puml` | Sequence | Detail sequence pengaduan + security issues |
| 06 | `06-class-database-schema.puml` | Class/ER | Schema database, relasi tabel, & gap |
| 07 | `07-state-machine-status.puml` | State Machine | Statemachine status permohonan/pengaduan |
| 08 | `08-component-architecture.puml` | Component | Arsitektur komponen & data flow |
| 09 | `09-business-process-overview.puml` | Business Process | Overview proses bisnis dari sisi aktor |
| 10 | `10-security-auth-matrix.puml` | Security | Matriks auth & security gap |

## Cara Membaca

### Install PlantUML (optional, untuk generate gambar)

```bash
# Ubuntu/Debian
sudo apt install plantuml

# Atau via SDKMAN
sdk install plantuml
```

### Generate gambar dari .puml

```bash
# Generate semua PNG
plantuml docs/uml/*.puml

# Generate satu file
plantuml docs/uml/01-use-case-diagram.puml
```

### Preview online (tanpa install)

1. Buka https://www.plantuml.com/plantuml/uml/
2. Paste isi file `.puml`
3. Klik "Submit"

## Ringkasan Alur Sistem

```
Warga ────── submit permohonan ──────────→ Sistem ──── WA ──→ RT
                                                            │
Warga ────── submit pengaduan ────────────→ Sistem           ↓
                                                         RT balas WA
                                                            │
                                       ┌────────────────────┘
                                       ↓                    ↓
                                  SETUJU               TOLAK
                                       ↓                    ↓
                              status:=DISETUJAI_RT    status:=DITOLAK_RT
                                       ↓
                              Sistem ─── WA ──→ Kelurahan
                                            ↓
                              Staff Kelurahan ──→ Dashboard ──→ proses
                                                                     ↓
                                                              status:=SELESAI
                                                                     ↓
Warga ────── cek /cek-tiket ──────────────────────────────────────────┘
```

## Role Summary

| Peran | Login? | Aktivitas |
|---|---|---|
| **Warga** | ❌ | Submit permohonan/pengaduan, cek tiket |
| **RT** | ❌ | Terima & balas WA (SETUJU/TOLAK) |
| **Staff Kelurahan** | ✅ | Proses permohonan & pengaduan via dashboard |
| **Admin Website** | ✅ | Kelola artikel, homepage, aset website |
