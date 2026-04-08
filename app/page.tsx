import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ThumbsUp,
  ShieldCheck,
  Zap,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Phone,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col">

      {/* ============================================
          HERO SECTION
         ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background emerald gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 pattern-overlay" />

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Decorative corner SVG */}
        <svg
          className="absolute right-0 top-0 w-96 h-96 opacity-10"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M400 0 C300 80 200 160 100 200 C150 250 200 300 250 350 C320 300 380 200 400 0Z"
            fill="white"
          />
        </svg>
        <svg
          className="absolute left-0 bottom-0 w-64 h-64 opacity-8"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="250" r="80" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="150" cy="200" r="120" stroke="white" strokeWidth="0.5" strokeDasharray="3 5" />
        </svg>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-3xl">
            {/* Label pill */}
            <div className="hero-enter hero-delay-1 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-xs font-semibold text-amber-300 tracking-widest uppercase">
                Desa Digital Gunting Manggis
              </span>
            </div>

            {/* Subtitle */}
            <p className="hero-enter hero-delay-2 text-sm sm:text-base text-emerald-200 font-medium tracking-wide uppercase mb-3">
              Layanan Desa Digital
            </p>

            {/* Headline — editorial, large */}
            <h1 className="hero-enter hero-delay-3 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
              Satu Pintu
              <br />
              <span className="text-amber-400">Layanan Warga</span>
              <br />
              Gunting Manggis
            </h1>

            {/* Description */}
            <p className="hero-enter hero-delay-3 text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-xl mb-10">
              Ajukan surat, pantau dokumen, dan akses layanan pemerintahan desa
              — semuanya dalam genggaman. Mudah, cepat, transparan.
            </p>

            {/* CTA Buttons */}
            <div className="hero-enter hero-delay-4 flex flex-wrap items-center gap-4">
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-emerald-900 shadow-lg shadow-amber-400/30 transition-all hover:bg-amber-300 hover:gap-3"
              >
                Jelajahi Layanan
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/15"
              >
                <Phone size={17} />
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="h-10 w-6 rounded-full border-2 border-white/25 flex items-start justify-center p-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* ============================================
          STATS BAR
         ============================================ */}
      <section className="bg-emerald-900 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-emerald-700">
            {[
              { icon: Users, value: "2.500+", label: "Warga Terdaftar" },
              { icon: FileText, value: "15+", label: "Jenis Layanan" },
              { icon: Clock, value: "< 24 Jam", label: "Rata-rata Proses" },
              { icon: CheckCircle2, value: "100%", label: "Layanan Online" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-3 first:pl-0 last:pr-0">
                <div className="flex-shrink-0">
                  <Icon size={22} className="text-amber-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-extrabold text-white leading-none">
                    {value}
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-300 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FITUR — Kenapa Memilih Si-Manggis?
         ============================================ */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-16 max-w-xl">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">
              Keunggulan
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight">
              Kenapa Warga
              <br />
              Memilih Si-Manggis?
            </h2>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Mudah */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                  <ThumbsUp size={22} className="text-amber-600" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Mudah Digunakan</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Antarmuka yang bersih dan sederhana, dirancang untuk warga
                dari semua kalangan — tanpa perlu keahlian teknologi.
              </p>
              <div className="mt-6 h-px w-12 bg-amber-300" />
            </div>

            {/* Aman */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                  <ShieldCheck size={22} className="text-amber-600" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Data Aman & Terjamin</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Setiap data warga dienkripsi dan disimpan dengan standar keamanan
                tinggi. Privasi Anda adalah prioritas kami.
              </p>
              <div className="mt-6 h-px w-12 bg-amber-300" />
            </div>

            {/* Cepat */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                  <Zap size={22} className="text-amber-600" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Proses Cepat</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Tidak perlu antri berhari-hari. Layanan diproses dalam hitungan
                jam dengan alur yang transparan dan dapat dipantau.
              </p>
              <div className="mt-6 h-px w-12 bg-amber-300" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ALUR LAYANAN
         ============================================ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-16">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">
              Proses
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              Alur Layanan
            </h2>
            <p className="mt-3 text-gray-500 max-w-md">
              Tiga langkah simpel untuk mendapatkan layanan desa
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-emerald-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center md:items-start">
                {/* Node */}
                <div className="relative z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-emerald-700 bg-white shadow-md">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4 L16 28 M4 16 L28 16" stroke="#064e3b" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="16" r="7" stroke="#064e3b" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="mt-6 text-center md:text-left">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Langkah 1</p>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Daftar &amp; Masuk</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Buat akun baru atau masuk dengan nomor telepon. Verifikasi
                    menggunakan Nomor Induk Kependudukan (NIK).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center md:items-start">
                <div className="relative z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-emerald-700 bg-white shadow-md">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="5" y="4" width="22" height="28" rx="2" stroke="#064e3b" strokeWidth="2"/>
                    <path d="M10 12 L22 12 M10 17 L22 17 M10 22 L16 22" stroke="#064e3b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="mt-6 text-center md:text-left">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Langkah 2</p>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Pilih &amp; Ajukan</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Pilih jenis layanan yang dibutuhkan, isi formulir secara online,
                    dan lampirkan dokumen yang diperlukan.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center md:items-start">
                <div className="relative z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-50 shadow-md">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" stroke="#064e3b" strokeWidth="2"/>
                    <path d="M10 16 L14 20 L22 12" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="mt-6 text-center md:text-left">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Langkah 3</p>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Proses &amp; Terbit</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Petugas desa memproses permohonan. Pantau status dan
                    unduh dokumen hasil begitu telah terbit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TENTANG KAMI
         ============================================ */}
      <section className="bg-stone-50 py-20 lg:py-28 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

            {/* Left — Foto */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="relative w-full sm:w-80 lg:w-96 mx-auto lg:mx-0">
                {/* Decorative frame */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                {/* Image container */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-emerald-100 shadow-lg">
                  <Image
                    src="/img/kepala-desa.jpg"
                    alt="Suasana Desa Gunting Manggis"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Caption */}
                <p className="mt-3 text-xs text-gray-400 text-center lg:text-left">
                  Suasana Desa Gunting Manggis, Tanjung Jabung Barat
                </p>
              </div>
            </div>

            {/* Right — Teks */}
            <div className="flex-1 w-full">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">
                Tentang Kami
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-5">
                Desa Gunting Manggis
              </h2>

              {/* Deskripsi */}
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed">
                <p>
                  Terletak di Kecamatan Mandahara, Kabupaten Tanjung Jabung Barat,
                  Provinsi Jambi,{" "}
                  <strong className="text-gray-700">Desa Gunting Manggis</strong>{" "}
                  dikenal dengan potensi alam yang subur dan masyarakat yang menjunjung
                  tinggi semangat gotong royong.
                </p>
                <p>
                  Hadirnya <strong className="text-gray-700">Si-Manggis</strong> merupakan
                  wujud komitmen pemerintah desa dalam memberikan layanan terbaik dan
                  transparan bagi seluruh warga, tanpa pandang jarak dan waktu.
                </p>
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-stone-200" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "2.500+", label: "Warga" },
                  { value: "15+", label: "Layanan" },
                  { value: "24/7", label: "Akses" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-4 text-center"
                  >
                    <p className="text-2xl font-extrabold text-emerald-800">{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA kecil */}
              <div className="mt-8">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group"
                >
                  Pelajari tentang desa kami
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
