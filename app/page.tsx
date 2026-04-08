import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Handshake,
  Lock,
  Zap,
  Phone,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col">

      {/* ============================================
          HERO SECTION
         ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Forest green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#1B4332] to-[#2D5016]" />
        {/* Dark image overlay */}
        <div className="absolute inset-0">
          <Image
            src="/img/Sekilas-Tentang-Danau-Seran.jpg"
            alt=""
            fill
            className="object-cover object-left opacity-40"
            priority
          />
        </div>
        {/* Noise texture */}
        <div className="absolute inset-0 noise-texture" />

        {/* Organic SVG decoration — bottom left */}
        <svg
          className="absolute left-0 bottom-0 w-72 h-72 opacity-10"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-20 300 C40 220 80 160 140 120 C200 80 260 60 300 50"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <path
            d="M-20 280 C50 200 100 140 160 100 C220 60 270 45 300 40"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>

        {/* Organic SVG decoration — top right */}
        <svg
          className="absolute right-0 top-0 w-96 h-96 opacity-8"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="350" cy="50" r="120" stroke="white" strokeWidth="0.8" strokeDasharray="4 6" />
          <circle cx="350" cy="50" r="80" stroke="white" strokeWidth="0.5" />
          <circle cx="350" cy="50" r="40" stroke="white" strokeWidth="0.3" />
        </svg>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32 w-full">
          {/* Wide column — editorial feel */}
          <div className="max-w-3xl">

            {/* Label */}
            <div className="stagger-1 inline-flex items-center gap-2.5 rounded-full border border-[#EA580C]/40 bg-[#EA580C]/10 backdrop-blur-sm px-4 py-1.5 mb-7">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#EA580C] inline-block" />
              <span className="text-xs font-semibold text-[#EA580C] uppercase tracking-normal">
                Desa Digital — Guntng Manggis
              </span>
            </div>

            {/* Eyebrow */}
            <p className="stagger-2 text-sm font-medium text-[#40916C] mb-3 uppercase tracking-normal">
              Layanan Desa Digital
            </p>

            {/* Headline — oversized, editorial */}
            <h1 className="stagger-3 text-6xl sm:text-7xl lg:text-8xl xl:text-[5.5rem] font-bold text-white leading-[1.02] tracking-tight mb-5">
              Satu Pintu
              <br />
              <span className="text-[#EA580C]">Layanan Warga</span>
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white/70">
                Guntng Manggis
              </span>
            </h1>

            {/* Description */}
            <p className="stagger-4 text-base sm:text-lg text-white/65 leading-relaxed max-w-lg mb-10">
              Ajukan surat, pantau dokumen, dan akses seluruh layanan pemerintahan
              desa — tanpa harus ke kantor. Mudah, cepat, dan transparan.
            </p>

            {/* CTAs — asimetris: primary besar, secondary kecil */}
            <div className="stagger-5 flex flex-wrap items-center gap-4">
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#EA580C] px-9 py-4 text-sm font-bold text-white shadow-lg shadow-[#EA580C]/30 transition-all hover:bg-[#C2410C] hover:gap-3"
              >
                Jelajahi Layanan
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-7 py-4 text-sm font-medium text-white transition-all hover:bg-white/15"
              >
                <Phone size={16} />
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="h-10 w-6 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ============================================
          STATS BAR
         ============================================ */}
      <section className="bg-[#1B4332] py-9">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Flex row dengan dividers */}
          <div className="flex flex-row items-center divide-x divide-[#40916C]/50">
            {[
              {
                icon: Users,
                value: "2.500+",
                label: "Warga Terdaftar",
              },
              {
                icon: FileText,
                value: "15+",
                label: "Jenis Layanan",
              },
              {
                icon: Clock,
                value: "< 24 Jam",
                label: "Rata-rata Proses",
              },
              {
                icon: CheckCircle,
                value: "100%",
                label: "Layanan Online",
              },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-8 py-2 first:pl-0 last:pr-0"
              >
                <Icon size={20} className="text-[#EA580C] flex-shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-3xl lg:text-4xl font-bold text-white leading-none">
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
          FITUR / KEUNGGULAN
         ============================================ */}
      <section className="bg-[#FEFCE8] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header — asimetris, nggak centered */}
          <div className="mb-14 max-w-sm">
            <span className="organic-line mb-4" />
            <p className="text-xs font-bold text-[#8B6914] uppercase mb-3 tracking-normal">
              Keunggulan
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917] leading-tight">
              Kenapa warga
              <br />
              memilih kami?
            </h2>
          </div>

          {/* 3 kolom — nggak identik, variasi tinggi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">

            {/* Mudah — kolom lebih pendek */}
            <div className="reveal reveal-d1 hover-lift bg-white rounded-2xl p-8 border border-stone-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF9EC] border border-[#FEF3C7] mb-5">
                <Handshake size={20} className="text-[#8B6914]" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-3">
                Mudah Digunakan
              </h3>
              <p className="text-[15px] text-[#57534E] leading-relaxed">
                Antarmuka yang bersih dan sederhana untuk semua kalangan
                — dari anak muda hingga orang tua.
              </p>
            </div>

            {/* Aman — kolom paling tinggi */}
            <div className="reveal reveal-d2 hover-lift bg-white rounded-2xl p-8 border border-stone-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF9EC] border border-[#FEF3C7] mb-5">
                <Lock size={20} className="text-[#8B6914]" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-3">
                Data Aman &amp; Terjamin
              </h3>
              <p className="text-[15px] text-[#57534E] leading-relaxed">
                Setiap data pribadi dienkripsi dengan standar keamanan tinggi.
                Privasi dan kepercayaan warga adalah prioritas utama kami.
              </p>
              <div className="mt-6 pt-5 border-t border-stone-100">
                <p className="text-xs text-[#A8A29E]">
                  Dilindungi oleh sistem keamanan modern dengan backup berkala.
                </p>
              </div>
            </div>

            {/* Cepat — kolom medium */}
            <div className="reveal reveal-d3 hover-lift bg-white rounded-2xl p-8 border border-stone-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF9EC] border border-[#FEF3C7] mb-5">
                <Zap size={20} className="text-[#8B6914]" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-3">
                Proses Cepat
              </h3>
              <p className="text-[15px] text-[#57534E] leading-relaxed">
                Tidak perlu antri berhari-hari. Layanan diproses dalam hitungan
                jam dengan alur transparan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================
          ALUR LAYANAN — Timeline horizontal
         ============================================ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header */}
          <div className="mb-16">
            <span className="block h-0.5 w-10 bg-[#EA580C] rounded mb-4" />
            <p className="text-xs font-bold text-[#8B6914] uppercase mb-3">
              Proses
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917]">
              Alur Layanan
            </h2>
            <p className="mt-3 text-sm text-[#57534E] max-w-sm">
              Tiga langkah mudah untuk mengakses layanan desa
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-9 left-[calc(16.6%)] right-[calc(16.6%)] h-px bg-stone-200" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

              {/* Step 1 */}
              <div className="reveal reveal-d1 flex flex-col items-center md:items-start text-center md:text-left">
                {/* Node — small circle dengan angka kecil */}
                <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-[#1B4332] shadow-sm mb-4">
                  <span className="text-xs font-bold text-[#1B4332]">1</span>
                </div>
                <h3 className="text-base font-semibold text-[#1C1917] mb-2">
                  Daftar &amp; Masuk
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Buat akun atau masuk dengan nomor telepon dan NIK.
                  Verifikasi data dalam hitungan menit.
                </p>
              </div>

              {/* Step 2 */}
              <div className="reveal reveal-d2 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-[#1B4332] shadow-sm mb-4">
                  <span className="text-xs font-bold text-[#1B4332]">2</span>
                </div>
                <h3 className="text-base font-semibold text-[#1C1917] mb-2">
                  Pilih &amp; Ajukan
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Pilih jenis layanan, isi formulir, dan lampirkan dokumen
                  yang diperlukan secara online.
                </p>
              </div>

              {/* Step 3 — completion, beda treatment */}
              <div className="reveal reveal-d3 flex flex-col items-center md:items-start text-center md:text-left">
                {/* Larger node untuk step akhir */}
                <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#EA580C] shadow-sm shadow-[#EA580C]/30 mb-4">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <h3 className="text-base font-semibold text-[#1C1917] mb-2">
                  Proses &amp; Terbit
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Petugas memproses permohonan. Pantau status dan unduh dokumen
                  hasil begitu telah terbit.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TENTANG KAMI
         ============================================ */}
      <section className="bg-[#FEFCE8] py-20 lg:py-28 border-t border-stone-200/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

            {/* Left — Foto dengan asymmetric frame */}
            <div className="flex-shrink-0 w-full lg:w-auto reveal reveal-d1">
              <div className="relative w-full sm:w-80 lg:w-96 mx-auto lg:mx-0">

                {/* Organic corner accent */}
                <div className="absolute -top-3 left-6 w-16 h-px bg-[#EA580C]" />
                <div className="absolute top-6 -left-3 w-px h-16 bg-[#EA580C]" />

                {/* Image container — nggak perfectly rounded */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#1B4332]/10">
                  <Image
                    src="/img/bg.png"
                    alt="Suasana Desa Guntng Manggis"
                    fill
                    className="object-cover object-left"
                  />
                  {/* Warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/30 to-transparent" />
                </div>

                {/* Caption */}
                <p className="mt-3 text-xs text-[#A8A29E] text-center lg:text-left italic">
                  Guntng Manggis — Kec. Mandahara, Tanjung Jabung Barat, Jambi
                </p>
              </div>
            </div>

            {/* Right — Teks */}
            <div className="flex-1 w-full reveal reveal-d2">

              <span className="block h-0.5 w-10 bg-[#EA580C] rounded mb-5" />
              <p className="text-xs font-bold text-[#8B6914] uppercase mb-3">
                Tentang Kami
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917] leading-tight mb-6">
                Desa Guntng Manggis
              </h2>

              {/* Deskripsi dengan drop cap */}
              <div className="space-y-4 text-[15px] text-[#57534E] leading-relaxed">
                <p className="drop-cap">
                  Terletak di Kecamatan Mandahara, Kabupaten Tanjung Jabung Barat,
                  Provinsi Jambi, Desa Guntng Manggis dikenal dengan potensi alam
                  yang subur dan masyarakat yang menjunjung tinggi semangat gotong royong.
                </p>
                <p>
                  Hadirnya <strong className="text-[#1C1917] font-semibold">
                    Si-Manggis
                  </strong> merupakan wujud nyata komitmen pemerintah desa dalam
                  memberikan layanan terbaik dan transparan bagi seluruh warga,
                  tanpa memandang jarak dan waktu.
                </p>
              </div>

              {/* Stats dengan border accent */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { value: "2.500+", label: "Warga" },
                  { value: "15+", label: "Layanan" },
                  { value: "24/7", label: "Akses" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#EA580C]/40 bg-white px-5 py-3 text-center hover-lift cursor-default"
                  >
                    <p className="text-xl font-bold text-[#1B4332]">{value}</p>
                    <p className="text-xs text-[#A8A29E] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#EA580C] transition-colors group"
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
