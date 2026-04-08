import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  FileText,
  Clock,
  CheckCircle,
  MapPin,
  Leaf,
  TreesIcon,
  Drumstick,
  Home as HomeIcon,
  FilePen,
  UsersRound,
  CreditCard,
  Briefcase,
  HeartHandshake,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col">

      {/* ============================================
          HERO SECTION
         ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/img/Sekilas-Tentang-Danau-Seran.jpg"
            alt="Pemandangan Danau Seran, Desa Guntung Manggis"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#1B4332]/65" />
        {/* Noise */}
        <div className="absolute inset-0 noise-texture" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-2xl">

            {/* Badge pill */}
            <div className="stagger-1 inline-flex items-center gap-2 rounded-full bg-[#EA580C]/90 backdrop-blur-sm px-5 py-2 mb-7">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white inline-block" />
              <span className="text-xs font-bold text-white uppercase tracking-normal">
                Kabar Desa Guntung Manggis
              </span>
            </div>

            {/* Headline */}
            <h1 className="stagger-2 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              Kabar Desa
              <br />
              <span className="text-[#FEFCE8]">Guntung Manggis</span>
            </h1>

            {/* Tagline */}
            <p className="stagger-3 text-base sm:text-lg text-white/75 leading-relaxed mb-10 max-w-md">
              Sistem Informasi Desa Digital Untuk Kemaslahatan Masyarakat
            </p>

            {/* CTAs */}
            <div className="stagger-4 flex flex-wrap items-center gap-3">
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 rounded-full bg-[#EA580C] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#EA580C]/30 transition-all hover:bg-[#C2410C] hover:gap-3"
              >
                Layanan
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="h-10 w-6 rounded-full border-2 border-white/25 flex items-start justify-center p-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ============================================
          KABAR DESA
         ============================================ */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <span className="accent-line mb-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">
                Kabar Desa
              </h2>
              <p className="mt-1 text-sm text-[#57534E]">
                Berita dan informasi terbaru dari Desa Guntung Manggis
              </p>
            </div>
            <Link
              href="/artikel"
              className="text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors whitespace-nowrap flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          {/* Article cards — asymmetric: left card larger */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Article 1 — Featured (larger) */}
            <div className="reveal reveal-d1 md:col-span-2 hover-lift group">
              <Link href="/artikel/1" className="block">
                <div className="relative h-52 sm:h-64 rounded-xl overflow-hidden bg-[#1B4332]/10 mb-4">
                  <Image
                    src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                    alt="Artikel 1"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-semibold text-white bg-[#EA580C] px-2.5 py-1 rounded-full">
                      08 April 2026
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1B4332] leading-snug mb-2 group-hover:text-[#EA580C] transition-colors">
                  Pembangunan Jalan Desa Segera Dimulai, Warga Antusias
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed line-clamp-2">
                  Pemerintah Desa Guntung Manggis segera melaksanakan pembangunan
                  infrastruktur jalan desa yang telah dinantikan warga selama...
                </p>
              </Link>
            </div>

            {/* Article 2 */}
            <div className="reveal reveal-d2 hover-lift group">
              <Link href="/artikel/2" className="block">
                <div className="relative h-36 rounded-xl overflow-hidden bg-[#1B4332]/10 mb-4">
                  <Image
                    src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                    alt="Artikel 2"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs font-semibold text-[#57534E]">07 April 2026</span>
                <h3 className="text-base font-bold text-[#1B4332] leading-snug mt-1 mb-2 group-hover:text-[#EA580C] transition-colors">
                  Pelatihan Keterampilan Perempuan untuk Ekonomi Desa
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                  Puluhan perempuan desa mengikuti pelatihan...
                </p>
              </Link>
            </div>

            {/* Article 3 */}
            <div className="reveal reveal-d3 hover-lift group">
              <Link href="/artikel/3" className="block">
                <div className="relative h-36 rounded-xl overflow-hidden bg-[#1B4332]/10 mb-4">
                  <Image
                    src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                    alt="Artikel 3"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs font-semibold text-[#57534E]">05 April 2026</span>
                <h3 className="text-base font-bold text-[#1B4332] leading-snug mt-1 mb-2 group-hover:text-[#EA580C] transition-colors">
                  Posyandu Desa Guntung Manggis Raih Predikat Teraktif
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                  Posyandu Melati meraih penghargaan...
                </p>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================
          STATS BAR
         ============================================ */}
      <section className="bg-[#1B4332] py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-row items-center divide-x divide-white/20">
            {[
              { icon: Users, value: "2.500+", label: "Warga Terdaftar" },
              { icon: FileText, value: "15+", label: "Jenis Layanan" },
              { icon: Clock, value: "< 24 Jam", label: "Rata-rata Proses" },
              { icon: CheckCircle, value: "100%", label: "Layanan Online" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3.5 px-8 py-2 first:pl-0 last:pr-0"
              >
                <Icon size={20} className="text-[#EA580C] flex-shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-white leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-white/55 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          LAYANAN
         ============================================ */}
      <section className="bg-[#FEFCE8] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <span className="accent-line mb-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">
                Layanan Desa
              </h2>
              <p className="mt-1 text-sm text-[#57534E]">
                Berbagai layanan pemerintahan desa yang dapat diakses online
              </p>
            </div>
            <Link
              href="/layanan"
              className="text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors whitespace-nowrap flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service grid — 2 rows × 3 cols */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                icon: FilePen,
                bg: "bg-[#FFF7ED]",
                color: "text-[#EA580C]",
                title: "Surat Keterangan",
                desc: "Surat domisili, pengantar, keterangan usaha",
              },
              {
                icon: FileText,
                bg: "bg-[#F0FDF4]",
                color: "text-[#40916C]",
                title: "Surat Permohonan",
                desc: "Pengajuan surat untuk keperluan administrasi",
              },
              {
                icon: UsersRound,
                bg: "bg-[#EFF6FF]",
                color: "text-[#1B4332]",
                title: "Data Penduduk",
                desc: "Pencatatan dan pembaruan data warga",
              },
              {
                icon: HomeIcon,
                bg: "bg-[#FFF7ED]",
                color: "text-[#92400E]",
                title: "Izin Tempat",
                desc: "Izin keramaian, usaha, dan kegiatan desa",
              },
              {
                icon: CreditCard,
                bg: "bg-[#F0FDF4]",
                color: "text-[#40916C]",
                title: "Pembayaran",
                desc: "Pembayaran retribusi dan-iuran desa",
              },
              {
                icon: HeartHandshake,
                bg: "bg-[#EFF6FF]",
                color: "text-[#1B4332]",
                title: "Bantuan Sosial",
                desc: "Pendaftaran dan informasi bantuan desa",
              },
            ].map(({ icon: Icon, bg, color, title, desc }) => (
              <Link
                key={title}
                href="/layanan"
                className="reveal hover-lift flex flex-col gap-3 bg-white rounded-xl p-5 border border-[#E7E5E4] hover:border-[#EA580C]/40 transition-colors group"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                  <Icon size={20} className={color} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1B4332] group-hover:text-[#EA580C] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-[#A8A29E] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          WILAYAH DESA
         ============================================ */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Left — Deskripsi */}
            <div className="lg:w-5/12 reveal reveal-d1">
              <span className="accent-line mb-4" />
              <p className="text-xs font-bold text-[#92400E] uppercase mb-2">Geografi</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] leading-tight mb-5">
                Wilayah Desa
              </h2>
              <p className="text-[15px] text-[#57534E] leading-relaxed">
                Desa Guntung Manggis terletak di Kecamatan bla,
                <strong className="text-[#1B4332]"> </strong>, Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi quae corporis et dolore culpa repellat, laborum aliquam nam doloribus, temporibus corrupti quas, commodi eius harum repudiandae. Totam, nisi! Perferendis, nobis?
                Incidunt ipsa provident facere eligendi, fugit tempore possimus obcaecati nostrum officiis hic cumque nemo earum asperiores explicabo illo beatae. Pariatur quas eveniet repellat fugit quaerat optio totam quia, reiciendis sit.
                Aut atque ipsa voluptatibus sit earum cupiditate, mollitia doloribus. {" "}
                <strong className="text-[#1B4332]">pertanian, perkebunan,
                dan peternakan</strong> sebagai mata pencaharian utama warga.
              </p>
              <p className="text-[15px] text-[#57534E] leading-relaxed mt-3">
                Dengan semangat <em>gotong royong</em>, warga terus membangun
                desa menuju kehidupan yang lebih sejahtera melalui pemanfaatan
                sumber daya alam dan teknologi digital.
              </p>
            </div>

            {/* Right — Data table */}
            <div className="lg:w-7/12 reveal reveal-d2">
              <div className="bg-[#FEFCE8] rounded-xl overflow-hidden border border-[#E7E5E4]">
                {/* Table header */}
                <div className="bg-[#1B4332] px-6 py-3">
                  <p className="text-sm font-bold text-white">Data Desa</p>
                </div>
                <div className="divide-y divide-[#E7E5E4]">
                  {[
                    { label: "Kecamatan", value: "bla" },
                    { label: "Kabupaten", value: "Tanrat" },
                    { label: "Provinsi", value: "Jambi" },
                    { label: "Luas Wilayah", value: "4.250 Ha" },
                    { label: "Jumlah Penduduk", value: "2.547 Jiwa" },
                    { label: "Jumlah RT", value: "18 RT" },
                    { label: "Jumlah RW", value: "6 RW" },
                    { label: "Kode Pos", value: "36553" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <span className="text-sm text-[#57534E]">{label}</span>
                      <span className="text-sm font-semibold text-[#1B4332]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================
          POTENSI DESA
         ============================================ */}
      <section className="bg-[#FAFAF9] py-16 lg:py-20 border-t border-[#E7E5E4]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <span className="accent-line mb-3" />
            <p className="text-xs font-bold text-[#92400E] uppercase mb-2">Potensi</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">
              Potensi Desa
            </h2>
            <p className="mt-1 text-sm text-[#57534E] max-w-sm">
              Sumber daya alam dan potensi yang dikembangkan warga desa
            </p>
          </div>

          {/* 3 potential cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Leaf,
                title: "Pertanian",
                desc: "Lahan pertanian padi dan palawija yang luas dengan sistem irigasi sederhana namun produktif sepanjang tahun.",
                color: "bg-[#F0FDF4]",
                iconColor: "text-[#40916C]",
              },
              {
                icon: TreesIcon,
                title: "Perkebunan",
                desc: "Kawasan perkebunan karet dan kelapa sawit menjadi sumber ekonomi utama warga desa.",
                color: "bg-[#FFF7ED]",
                iconColor: "text-[#92400E]",
              },
              {
                icon: Drumstick,
                title: "Peternakan",
                desc: "Budidaya ayam kampung dan kambing yang dikelola secara tradisional oleh kelompok warga.",
                color: "bg-[#EFF6FF]",
                iconColor: "text-[#1B4332]",
              },
            ].map(({ icon: Icon, title, desc, color, iconColor }, i) => (
              <div
                key={title}
                className={`reveal reveal-d${i + 1} hover-lift rounded-xl overflow-hidden border border-[#E7E5E4] bg-white`}
              >
                {/* Image */}
                <div className="relative h-36 sm:h-44 overflow-hidden bg-[#1B4332]/10">
                  <Image
                    src="/img/Sekilas-Tentang-Danau-Seran.jpg"
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                      <Icon size={18} className={iconColor} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-base font-bold text-[#1B4332]">{title}</h3>
                  </div>
                  <p className="text-sm text-[#57534E] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
         ============================================ */}
      <footer className="bg-[#1B4332] pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EA580C]">
                  <span className="text-lg font-bold text-white">SM</span>
                </div>
                <span className="text-xl font-bold text-white">Si-Manggis</span>
              </div>
              <p className="text-sm text-white/55 leading-relaxed">
                Sistem Informasi Desa Digital<br />
                Desa Guntung Manggis
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-xs font-bold text-white/80 uppercase mb-3 tracking-wider">
                Navigasi
              </p>
              <ul className="space-y-2">
                {["Beranda", "Profil", "Layanan", "Galeri", "Kontak"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <p className="text-xs font-bold text-white/80 uppercase mb-3 tracking-wider">
                Layanan
              </p>
              <ul className="space-y-2">
                {[
                  "Surat Keterangan",
                  "Data Penduduk",
                  "Izin Tempat",
                  "Bantuan Sosial",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="/layanan"
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <p className="text-xs font-bold text-white/80 uppercase mb-3 tracking-wider">
                Kontak
              </p>
              <ul className="space-y-2 text-sm text-white/55">
                <li>Kec. Landasan Ulin</li>
                <li>Kab. blablabla</li>
                <li>Prov. Kalimantan Selatan</li>
                <li className="pt-1">desaguntungmanggis@mail.com</li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © 2026 Pemerintah Desa Guntung Manggis
            </p>
            <p className="text-xs text-white/30">
              Dibuat dengan semangat gotong royong
            </p>
          </div>
        </div>
      </footer>
                
    </main>
  );
}
