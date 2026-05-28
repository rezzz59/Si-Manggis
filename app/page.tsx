import Image from "next/image";
import Link from "next/link";
import {
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
  Send,
} from "lucide-react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";
import SearchBar from "@/src/components/SearchBar";

const PROGRAM_UNGGULAN = [
  {
    icon: ShieldCheck,
    label: "Kampung KB",
    desc: "Program nasional — mewakili Kalseltel",
    badge: "Nasional",
    bg: "bg-[#eff6ff]",
    ic: "text-[#1e40af]",
  },
  {
    icon: Droplets,
    label: "RT Mandiri",
    desc: "Budidaya ikan papuyu &ternak sapi",
    badge: null,
    bg: "bg-[#f0fdf4]",
    ic: "text-[#16a34a]",
  },
  {
    icon: Heart,
    label: "Home Care Lansia",
    desc: "Pelayanan kesehatan warga lanjut usia",
    badge: null,
    bg: "bg-[#fff7ed]",
    ic: "text-[#f97316]",
  },
  {
    icon: Sparkles,
    label: "Kelurahan Bersinar",
    desc: "Wilayah percontohan bersih dari narkoba",
    badge: "Percontohan",
    bg: "bg-[#eff6ff]",
    ic: "text-[#1e40af]",
  },
  {
    icon: Recycle,
    label: "Bank Sampah",
    desc: "8 unit beroperasi, kesadaran lingkungan tinggi",
    badge: "8 Unit",
    bg: "bg-[#f0fdf4]",
    ic: "text-[#16a34a]",
  },
  {
    icon: Briefcase,
    label: "Koperasi Merah Putih",
    desc: "Program strategis nasional — Juli 2025",
    badge: "Stranas",
    bg: "bg-[#fff7ed]",
    ic: "text-[#f97316]",
  },
];

const STATS = [
  { value: "52", label: "RT", sub: "Pemekaran Okt 2025" },
  { value: "2.500+", label: "Warga", sub: "Terdaftar" },
  { value: "8", label: "Bank Sampah", sub: "Unit aktif" },
  { value: "5", label: "Program", sub: "Inovasi Unggulan" },
];

const JENIS_LAYANAN = [
  {
    icon: FileText,
    label: "Surat Izin Tinggal",
    desc: "Izin domisili & tinggal sementara",
    href: "/layanan/surat-izin-tinggal",
  },
  {
    icon: Building2,
    label: "Surat Keterangan",
    desc: "Domisili, pengantar, usaha",
    href: "/layanan/surat-keterangan",
  },
  {
    icon: Send,
    label: "Ajukan Laporan",
    desc: "Pengaduan & permohonan surat via WA RT",
    href: "/layanan",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-full">

      {/* ============================================
          HERO — full photo, text reveal on load
          ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/img/Sekilas-Tentang-Danau-Seran.jpg"
            alt="Pemandangan Danau Seran, Kelurahan Guntung Manggis"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b]/95 via-[#1e40af]/55 to-transparent" />
        <div className="absolute inset-0 noise-texture pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl pt-24 pb-20">

              {/* Tag line */}
              <div className="hero-tag flex items-center gap-3 mb-8">
                <div className="w-[3px] h-8 bg-[#f97316]" />
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em]">
                  Portal Resmi Kelurahan Gunting Manggis
                </span>
              </div>

              {/* Main heading — staggered reveal */}
              <div className="hero-line-1 overflow-hidden mb-1">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.15] pb-1">
                  Guntung
                </h1>
              </div>
              <div className="hero-line-2 overflow-hidden">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.15] pb-1">
                  <span className="text-[#93c5fd]">Manggis</span>
                </h1>
              </div>

              {/* Subtext */}
              <p className="hero-sub text-base text-white/55 leading-relaxed mb-10 max-w-md">
                Kecamatan Landasan Ulin, Kota Banjarbaru,
                Kalimantan Selatan. Portal informasi & layanan
                digital untuk warga.
              </p>

              {/* Search bar */}
              <div className="hero-search">
                <SearchBar />
              </div>

              {/* Program tags */}
              <div className="hero-tags flex flex-wrap gap-2 mt-10">
                {[
                  "Kampung KB",
                  "RT Mandiri",
                  "Bank Sampah",
                  "Koperasi Merah Putih",
                  "Bersinar",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-white/70 bg-white/10 px-3 py-1.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 hero-scroll">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>


      {/* ============================================
          SECTION 2 — white, scroll-animated
          ============================================ */}
      <section className="bg-white pt-16 pb-20">

        {/* --- UNIT GAWAT DARURAT --- */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-16">
          <AnimateOnScroll delay={0}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="w-10 h-[3px] bg-[#f97316] mb-3" />
                <h2 className="text-3xl font-extrabold text-[#1e293b] tracking-tight leading-none">
                  Unit Gawat<br />Darurat
                </h2>
              </div>
              <Link
                href="/darurat"
                className="text-[11px] font-semibold text-[#1e40af] hover:text-[#1e3a8a] transition-colors flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <ArrowRight size={10} />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimateOnScroll delay={100}>
              <a
                href="https://maps.google.com/?q=Dinas+Pemadam+Kebakaran+Kota+Banjarbaru"
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-start gap-4 rounded-sm bg-[#eff6ff] border border-[#bfdbfe] px-6 py-5 cursor-pointer"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Flame size={24} className="text-[#dc2626]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1e293b] leading-tight">Damkar</p>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Dinas Pemadam Kebakaran Kota Banjarbaru
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#1e40af]">
                    <MapPin size={9} strokeWidth={2.5} />
                    Lihat di Google Maps
                  </div>
                </div>
              </a>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <a
                href="https://maps.google.com/?q=Poskesdes+Kelurahan+Guntung+Manggis"
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-start gap-4 rounded-sm bg-[#f0fdf4] border border-[#bbf7d0] px-6 py-5 cursor-pointer"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Siren size={24} className="text-[#16a34a]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1e293b] leading-tight">Ambulans</p>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Poskesdes Kelurahan Guntung Manggis
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#16a34a]">
                    <MapPin size={9} strokeWidth={2.5} />
                    Lihat di Google Maps
                  </div>
                </div>
              </a>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e2e8f0] mx-6 sm:mx-8 lg:mx-12 mb-16" />


        {/* --- BERITA TERKINI --- */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-16">
          <AnimateOnScroll delay={0}>
            <div className="flex items-end justify-between mb-6">
              <div className="max-w-xs">
                <div className="w-10 h-[3px] bg-[#1e40af] mb-3" />
                <h2 className="text-3xl font-extrabold text-[#1e293b] tracking-tight leading-none">
                  Berita<br />Terkini
                </h2>
                <p className="text-[11px] text-[#94a3b8] mt-2 leading-relaxed">
                  Kabar terbaru dari Kelurahan Guntung Manggis
                </p>
              </div>
              <Link
                href="/artikel"
                className="text-[11px] font-semibold text-[#1e40af] hover:text-[#1e3a8a] transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                Semua Artikel <ArrowRight size={10} />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Big card — spans 2 cols */}
            <AnimateOnScroll delay={0} className="lg:col-span-2">
              <div className="group cursor-pointer">
                <div className="relative h-[300px] rounded-sm overflow-hidden">
                  <Image
                    src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                    alt="Perbaikan Jembatan Guntung Manggis"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-[10px] font-bold text-white bg-[#f97316] px-2.5 py-1 rounded-sm mb-3 inline-block">
                      Jan 2026
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      Perbaikan Jembatan Guntung Manggis,
                      Dinas PUPR Kalseltel Gerak Cepat
                    </h3>
                    <p className="text-[11px] text-white/60 mt-2">
                      Baca selengkapnya →
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Two stacked cards */}
            <AnimateOnScroll delay={100} className="flex flex-col gap-4">
              <Link href="/artikel/pasar-murah-wengga-kuda" className="group cursor-pointer">
                <div className="relative h-[142px] rounded-sm overflow-hidden">
                  <Image
                    src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                    alt="Pasar Murah"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[9px] font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-sm mb-2 inline-block">
                      Feb 2025
                    </span>
                    <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2">
                      Pasar Murah Mandiri Komplek Wengga Kuda
                    </h3>
                  </div>
                </div>
              </Link>

              <Link href="/artikel/pemekaran-rt-52" className="group cursor-pointer">
                <div className="relative h-[142px] rounded-sm overflow-hidden">
                  <Image
                    src="/img/bg.png"
                    alt="Pemekaran RT"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[9px] font-bold text-white bg-[#1e40af] px-2 py-0.5 rounded-sm mb-2 inline-block">
                      Okt 2025
                    </span>
                    <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2">
                      Pemekaran 52 RT, Kelurahan Tumbuh Cepat
                    </h3>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e2e8f0] mx-6 sm:mx-8 lg:mx-12 mb-16" />


        {/* --- PROGRAM UNGGULAN --- */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-16">
          <AnimateOnScroll delay={0}>
            <div className="mb-6">
              <div className="w-10 h-[3px] bg-[#f97316] mb-3" />
              <h2 className="text-3xl font-extrabold text-[#1e293b] tracking-tight leading-none">
                Program Unggulan
              </h2>
              <p className="text-[11px] text-[#94a3b8] mt-2">
                Inovasi dan keunggulan Kelurahan Guntung Manggis
              </p>
            </div>
          </AnimateOnScroll>

          {/* Program cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROGRAM_UNGGULAN.map((prog, i) => (
              <AnimateOnScroll key={prog.label} delay={i * 80}>
                <div
                  className={`rounded-sm bg-white border border-[#e2e8f0] p-5 ${
                    i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
                  } card-hover`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-sm flex-shrink-0 ${prog.bg}`}
                    >
                      <prog.icon size={18} className={prog.ic} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-[#1e293b] leading-tight">
                          {prog.label}
                        </p>
                        {prog.badge && (
                          <span className="text-[9px] font-bold text-white bg-[#1e40af] px-2 py-0.5 rounded-sm uppercase tracking-wide">
                            {prog.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs text-[#64748b] mt-1 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: prog.desc }}
                      />
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e2e8f0] mx-6 sm:mx-8 lg:mx-12 mb-16" />


        {/* --- LAYANAN WARGA --- */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <AnimateOnScroll delay={0}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="w-10 h-[3px] bg-[#1e40af] mb-3" />
                <h2 className="text-3xl font-extrabold text-[#1e293b] tracking-tight leading-none">
                  Layanan<br />Warga
                </h2>
              </div>
              <Link
                href="/layanan"
                className="text-[11px] font-semibold text-[#1e40af] hover:text-[#1e3a8a] transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                Ajukan Sekarang <ArrowRight size={10} />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {JENIS_LAYANAN.map((layanan, i) => (
              <AnimateOnScroll key={layanan.label} delay={i * 100}>
                <Link
                  href={layanan.href}
                  className="card-hover flex items-center gap-4 rounded-sm bg-white border border-[#cbd5e1] px-6 py-5 cursor-pointer"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#eff6ff] flex-shrink-0">
                    <layanan.icon size={18} className="text-[#1e40af]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1e293b] leading-tight">
                      {layanan.label}
                    </p>
                    <p className="text-xs text-[#64748b] mt-0.5">{layanan.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-[#cbd5e1] ml-auto flex-shrink-0" />
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================
          STATISTIK BAR — dark navy, animated counter
          ============================================ */}
      <section className="bg-[#1e3a5f] py-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <AnimateOnScroll delay={0}>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-5 py-4"
                  style={{
                    borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                    paddingLeft: i === 0 ? "0" : "20px",
                  }}
                >
                  <span className="text-4xl lg:text-5xl font-extrabold text-white leading-none tracking-tight tabular-nums">
                    {stat.value}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white/80 leading-tight">
                      {stat.label}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>


      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-[#0f172a] pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#1e40af]">
                  <span className="text-base font-bold text-white">SM</span>
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-tight">Si-Manggis</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Portal Kelurahan Digital</p>
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
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-4">
                Navigasi
              </p>
              <ul className="space-y-2.5">
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
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-4">
                Program Unggulan
              </p>
              <ul className="space-y-2.5">
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
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-4">
                Kontak
              </p>
              <ul className="space-y-3">
                {[
                  { icon: MapPin, text: "Kode Wilayah 63.72.02.1005" },
                  { icon: Building2, text: "Kelurahan Guntung Manggis" },
                  { icon: Phone, text: "Hubungi via Portal Darurat" },
                  { icon: Newspaper, text: "Kode Pos: 70724" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-white/45">
                    <Icon size={13} className="flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <p className="text-xs text-white/30">
              &copy; 2026 Pemerintah Kelurahan Guntung Manggis
            </p>
            <p className="text-[11px] text-white/20 italic">
              Dibuat dengan semangat gotong royong
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}