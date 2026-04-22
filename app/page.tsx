import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  FileText,
  MapPin,
  Phone,
  Building2,
  Newspaper,
  Flame,
  Siren,
  ShieldCheck,
  Droplets,
  Heart,
  Sparkles,
  Recycle,
  Briefcase,
} from "lucide-react";

const PROGRAM_UNGGULAN = [
  {
    icon: ShieldCheck,
    label: "Kampung KB",
    desc: "Program nasional — mewakili Kalseltel",
    badge: "Nasional",
    color: "bg-[#eff6ff]",
    iconColor: "text-[#1e40af]",
  },
  {
    icon: Droplets,
    label: "RT Mandiri",
    desc: "Budidaya ikan papuyu &amp; ternak sapi",
    badge: null,
    color: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
  },
  {
    icon: Heart,
    label: "Home Care Lansia",
    desc: "Pelayanan kesehatan warga lanjut usia",
    badge: null,
    color: "bg-[#fff7ed]",
    iconColor: "text-[#f97316]",
  },
  {
    icon: Sparkles,
    label: "Kelurahan Bersinar",
    desc: "Wilayah percontohan bersih dari narkoba",
    badge: "Percontohan",
    color: "bg-[#eff6ff]",
    iconColor: "text-[#1e40af]",
  },
  {
    icon: Recycle,
    label: "Bank Sampah",
    desc: "8 unit beroperasi, kesadaran lingkungan tinggi",
    badge: "8 Unit",
    color: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
  },
  {
    icon: Briefcase,
    label: "Koperasi Merah Putih",
    desc: "Program strategis nasional — Juli 2025",
    badge: "Stranas",
    color: "bg-[#fff7ed]",
    iconColor: "text-[#f97316]",
  },
];

const STATS = [
  { value: "52", label: "RT", sub: "Pemekaran Okt 2025" },
  { value: "2.500+", label: "Warga", sub: "Terdaftar" },
  { value: "8", label: "Bank Sampah", sub: "Unit aktif" },
  { value: "5", label: "Program", sub: "Inovasi Unggulan" },
];

const JENIS_SURAT = [
  {
    icon: FileText,
    label: "Surat Izin Tinggal",
    desc: "Izin domisili & tinggal sementara",
    href: "/layanan/surat-izin-tinggal",
    color: "bg-white/10",
    iconColor: "text-[#93c5fd]",
  },
  {
    icon: Building2,
    label: "Surat Keterangan",
    desc: "Domisili, pengantar, usaha",
    href: "/layanan/surat-keterangan",
    color: "bg-white/10",
    iconColor: "text-[#93c5fd]",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-full">

      {/* ============================================
          HERO — full photo
          Mobile: gradient top | Desktop: gradient right
         ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full-bleed foto */}
        <div className="absolute inset-0">
          <Image
            src="/img/Sekilas-Tentang-Danau-Seran.jpg"
            alt="Pemandangan Kelurahan Guntung Manggis, Danau Seran"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient overlay */}
        {/* Mobile: biru dari atas; Desktop: biru dari kanan */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#1e40af] via-[#1e40af]/70 to-transparent" />
        <div className="absolute inset-0 noise-texture pointer-events-none" />

        {/* Teks overlay */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg">
            <div className="inline-block rounded-sm bg-white/10 border border-white/20 px-3 py-1 mb-6">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Portal Resmi Pemerintah
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Selamat Datang di
              <br />
              <span className="text-[#93c5fd]">Kelurahan Guntung Manggis</span>
            </h1>

            <p className="text-base text-white/65 mb-8 leading-relaxed max-w-sm">
              Kecamatan Landasan Ulin, Kota Banjarbaru, Kalimantan Selatan.
              Portal informasi dan layanan digital untuk warga.
            </p>

            {/* Search bar */}
            <div className="relative max-w-sm">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search size={16} className="text-[#64748b]" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Cari layanan, dokumen, berita..."
                className="w-full rounded-sm bg-white pl-10 pr-20 py-3 text-sm text-[#1e293b] placeholder-[#94a3b8] border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-shadow duration-150"
              />
              <button
                type="button"
                className="absolute inset-y-1 right-1 my-0.5 px-4 rounded-sm bg-[#1e40af] text-white text-xs font-semibold hover:bg-[#1e3a8a] transition-colors duration-150 cursor-pointer"
              >
                Cari
              </button>
            </div>

            {/* Program badges */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Kampung KB", "RT Mandiri", "Bank Sampah", "Koperasi Merah Putih"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-white/70 bg-white/10 border border-white/15 px-2.5 py-1 rounded-sm"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          SECTION 2 — FULL WHITE
          Unit Gawat Darurat | Berita | Alur Layanan | Layanan
         ============================================ */}
      <section className="bg-white pt-12 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* --- BLOK 1: UNIT GAWAT DARURAT --- */}
          <div className="mb-12">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1e293b] tracking-tight">
                Unit Gawat Darurat
              </h2>
              <Link
                href="/darurat"
                className="text-xs font-semibold text-[#1e40af] hover:text-[#1e3a8a] transition-colors duration-150 flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <ArrowRight size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Damkar */}
              <a
                href="https://maps.google.com/?q=Dinas+Pemadam+Kebakaran+Kota+Banjarbaru"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-lift flex items-start gap-4 rounded-sm bg-[#eff6ff] border border-[#bfdbfe] px-5 py-4 cursor-pointer block"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Flame size={22} className="text-[#dc2626]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1e293b] leading-tight">Damkar</p>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-snug">
                    Dinas Pemadam Kebakaran Kota Banjarbaru
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#1e40af]">
                    <MapPin size={9} strokeWidth={2} />
                    Lihat di Google Maps
                  </div>
                </div>
              </a>

              {/* Ambulans */}
              <a
                href="https://maps.google.com/?q=Poskesdes+Kelurahan+Guntung+Manggis"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-lift flex items-start gap-4 rounded-sm bg-[#eff6ff] border border-[#bfdbfe] px-5 py-4 cursor-pointer block"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Siren size={22} className="text-[#16a34a]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1e293b] leading-tight">Ambulans</p>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-snug">
                    Poskesdes Kelurahan Guntung Manggis
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#1e40af]">
                    <MapPin size={9} strokeWidth={2} />
                    Lihat di Google Maps
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e2e8f0] mb-12" />

          {/* --- BLOK 2: BERITA TERKINI --- */}
          <div className="mb-12">
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="accent-line mb-2 block" />
                <h2 className="text-lg font-bold text-[#1e293b] tracking-tight">
                  Berita Terkini
                </h2>
              </div>
              <Link
                href="/artikel"
                className="text-xs font-semibold text-[#1e40af] hover:text-[#1e3a8a] transition-colors duration-150 flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                Lihat Lebih Banyak <ArrowRight size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  tanggal: "Jan 2026",
                  judul: "Perbaikan Jembatan Guntung Manggis, Dinas PUPR Kalseltel Gerak Cepat",
                  href: "/artikel/jembatan-guntung-manggis",
                },
                {
                  tanggal: "Feb 2025",
                  judul: "Pasar Murah Mandiri Komplek Wengga Kuda: Pengendalian Inflasi",
                  href: "/artikel/pasar-murah-wengga-kuda",
                },
                {
                  tanggal: "Okt 2025",
                  judul: "Pemekaran 52 RT, Kelurahan Tumbuh Cepat di Landasan Ulin",
                  href: "/artikel/pemekaran-rt-52",
                },
              ].map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="hover-lift block bg-white rounded-sm overflow-hidden border border-[#cbd5e1] card-shadow cursor-pointer"
                >
                  <div className="relative h-28 overflow-hidden bg-[#e2e8f0]">
                    <Image
                      src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                      alt={b.judul}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold text-white bg-[#f97316] px-2 py-0.5 rounded-sm">
                        {b.tanggal}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-[#1e293b] leading-snug line-clamp-2">
                      {b.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e2e8f0] mb-12" />

          {/* --- BLOK 3: PROGRAM UNGGULAN --- */}
          <div className="mb-12">
            <div className="mb-5">
              <span className="accent-line mb-2 block" />
              <h2 className="text-lg font-bold text-[#1e293b] tracking-tight">
                Program Unggulan
              </h2>
              <p className="text-xs text-[#64748b] mt-1">
                Inovasi dan keunggulan Kelurahan Guntung Manggis
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROGRAM_UNGGULAN.map((prog) => (
                <div
                  key={prog.label}
                  className="hover-lift bg-white rounded-sm border border-[#cbd5e1] card-shadow p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-sm flex-shrink-0 ${prog.color}`}
                    >
                      <prog.icon size={18} className={prog.iconColor} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-[#1e293b] leading-tight">
                          {prog.label}
                        </p>
                        {prog.badge && (
                          <span className="text-[9px] font-bold text-white bg-[#1e40af] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            {prog.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs text-[#64748b] mt-0.5 leading-snug"
                        dangerouslySetInnerHTML={{ __html: prog.desc }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e2e8f0] mb-12" />

          {/* --- BLOK 4: LAYANAN WARGA --- */}
          <div>
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1e293b] tracking-tight">
                Layanan Warga
              </h2>
              <Link
                href="/layanan"
                className="text-xs font-semibold text-[#1e40af] hover:text-[#1e3a8a] transition-colors duration-150 flex items-center gap-1 cursor-pointer"
              >
                Ajukan Sekarang <ArrowRight size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {JENIS_SURAT.map((surat) => (
                <Link
                  key={surat.label}
                  href={surat.href}
                  className="hover-lift flex items-center gap-4 rounded-sm bg-white border border-[#cbd5e1] px-5 py-4 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#eff6ff] flex-shrink-0">
                    <surat.icon size={18} className="text-[#1e40af]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1e293b] leading-tight">
                      {surat.label}
                    </p>
                    <p className="text-xs text-[#64748b] mt-0.5">{surat.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-[#cbd5e1] ml-auto flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          STATISTIK BAR — biru gelap
         ============================================ */}
      <section className="bg-[#1e3a5f] py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-6 py-2">
                <span className="text-2xl lg:text-3xl font-bold text-white leading-none">
                  {stat.value}
                </span>
                <div>
                  <p className="text-xs font-semibold text-white/90 leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================
          FOOTER — gelap
         ============================================ */}
      <footer className="bg-[#0f172a] pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1e40af]">
                  <span className="text-base font-bold text-white">SM</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-tight">Si-Manggis</p>
                  <p className="text-[10px] text-white/40">Portal Kelurahan Digital</p>
                </div>
              </div>
              <p className="text-sm text-white/45 leading-relaxed">
                Kelurahan Guntung Manggis
                <br />
                Kec. Landasan Ulin, Kota Banjarbaru
                <br />
                Kalimantan Selatan 70724
              </p>
            </div>

            {/* Navigasi */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
                Navigasi
              </p>
              <ul className="space-y-2">
                {[
                  { label: "Beranda", href: "/" },
                  { label: "Profil", href: "/profil" },
                  { label: "Layanan", href: "/layanan" },
                  { label: "Kabar", href: "/artikel" },
                  { label: "Darurat", href: "/darurat" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/45 hover:text-white transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Program */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
                Program Unggulan
              </p>
              <ul className="space-y-2">
                {[
                  "Kampung KB (Nasional)",
                  "RT Mandiri",
                  "Home Care Lansia",
                  "Kelurahan Bersinar",
                  "Bank Sampah (8 Unit)",
                  "Koperasi Merah Putih",
                ].map((item) => (
                  <li key={item} className="text-sm text-white/45">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
                Kontak
              </p>
              <ul className="space-y-2.5">
                {[
                  { icon: MapPin, text: "Kode Wilayah 63.72.02.1005" },
                  { icon: Building2, text: "Kelurahan Guntung Manggis" },
                  { icon: Phone, text: "Hubungi via Portal Darurat" },
                  { icon: Newspaper, text: "Kode Pos: 70724" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-white/45">
                    <Icon size={14} className="flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/30">
              &copy; 2026 Pemerintah Kelurahan Guntung Manggis
            </p>
            <p className="text-xs text-white/20">
              Dibuat dengan semangat gotong royong
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
