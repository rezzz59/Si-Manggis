import {
  MapPin,
  Users,
  Briefcase,
  Landmark,
  ShieldCheck,
  Route,
  Building2,
  LocateFixed,
  ArrowRight,
  Sprout,
  Home,
  GraduationCap,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Profil Kelurahan - Si-Manggis",
  description:
    "Profil Kelurahan Guntung Manggis - identitas wilayah, sejarah, visi-misi, dan demografi.",
};

const identitasKelurahan = [
  { label: "Nama Kelurahan", value: "Guntung Manggis", icon: Landmark },
  { label: "Kecamatan", value: "Landasan Ulin", icon: MapPin },
  { label: "Kota", value: "Kota Banjarbaru", icon: Building2 },
  { label: "Provinsi", value: "Kalimantan Selatan", icon: ShieldCheck },
  { label: "Kode Pos", value: "70724", icon: LocateFixed },
  { label: "Luas Wilayah", value: "39,74 Ha", icon: Route },
];

const batasWilayah = [
  { arah: "Utara", wilayah: "Kelurahan Guntung Payung (Kec. Landasan Ulin)" },
  { arah: "Selatan", wilayah: "Desa Pandahan (Kec. Bati-Bati)" },
  { arah: "Timur", wilayah: "Kelurahan Loktabat Selatan (Kec. Banjarbaru Selatan)" },
  { arah: "Barat", wilayah: "Kelurahan Landasan Ulin Timur (Kec. Landasan Ulin)" },
];

const potensiWilayah = [
  {
    title: "Perkebunan & Pertanian",
    desc: "Potensi lahan produktif yang mendukung ketahanan pangan dan ekonomi warga.",
    icon: Sprout,
  },
  {
    title: "Permukiman Padat Berkembang",
    desc: "Kawasan hunian aktif dengan pertumbuhan penduduk dan aktivitas sosial yang tinggi.",
    icon: Home,
  },
  {
    title: "Fasilitas Pendidikan",
    desc: "Akses pendidikan yang terus berkembang untuk menunjang kualitas SDM kelurahan.",
    icon: GraduationCap,
  },
  {
    title: "Fasilitas Kesehatan",
    desc: "Layanan kesehatan dasar tersedia dan terus ditingkatkan untuk kebutuhan warga.",
    icon: HeartPulse,
  },
];

const visiKelurahan =
  "Memberikan Pelayanan Prima serta Mewujudkan Masyarakat Guntung Manggis Yang Berpedoman Pada Keimanan dan Berbudi Pekerti Luhur";

const penjelasanVisi = [
  {
    title: "Keimanan",
    desc: "Terciptanya pelayanan kelurahan dan lingkungan masyarakat yang memiliki kedalaman spiritual, sikap ramah santun, serta partisipatif sehingga mampu mewujudkan lingkungan yang nyaman.",
  },
  {
    title: "Berbudi Pekerti Luhur",
    desc: "Membangun sikap pelayanan dan masyarakat yang menjunjung etika serta berintegritas tinggi, sehingga mampu mewujudkan pegawai dan masyarakat yang bersahaja dan bermartabat.",
  },
];

const misi = [
  "Menjadikan nilai-nilai agama dan budaya sebagai spirit dalam mengelola kegiatan pembangunan.",
  "Meningkatkan kualitas kehidupan masyarakat yang berakhlak mulia dengan peningkatan kualitas kehidupan beragama.",
  "Meningkatkan indeks sumber daya manusia dengan pembangunan pendidikan dan karakter yang berdasar iman dan taqwa.",
  "Meningkatkan profesionalisme aparat kelurahan agar terwujud hubungan yang sinergis antara pemerintah dan masyarakat.",
  "Menciptakan suasana yang kondusif bagi tumbuh dan berkembangnya inisiatif dan inovasi dengan melibatkan masyarakat dalam perencanaan dan pengawasan pembangunan.",
  "Meningkatkan kesejahteraan masyarakat melalui pembangunan perekonomian daerah yang berkelanjutan dengan kearifan lokal serta tetap menjaga kelestarian lingkungan hidup.",
];

const demografi = [
  { label: "Jumlah Penduduk", value: "33.629 Jiwa (2023)", icon: Users },
  { label: "Penduduk Laki-laki", value: "16.925 Jiwa", icon: Users },
  { label: "Penduduk Perempuan", value: "16.704 Jiwa", icon: Users },
  { label: "Jumlah KK", value: "10.693 KK", icon: Users },
  { label: "Kepadatan Penduduk", value: "1.001,38 jiwa/km²", icon: MapPin },
  { label: "Jumlah RT / RW", value: "51 RT / 6 RW", icon: Briefcase },
];

export default function ProfilPage() {
  return (
    <main className="min-h-full bg-[#f7faf8] text-[#0f172a]">
      <section className="relative overflow-hidden border-b border-[#d7e8de] pt-32 pb-14 md:pt-36 md:pb-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,107,60,0.84), rgba(19,130,74,0.68), rgba(15,107,60,0.84)), url('/img/Sekilas-Tentang-Danau-Seran.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="public-shell relative z-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center rounded-full border border-white/45 bg-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                Profil Kelurahan
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.04] text-white sm:text-5xl md:text-6xl">
                Kelurahan Guntung Manggis
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-[17px]">
                Kelurahan dengan wilayah luas dan jumlah penduduk terbesar di Banjarbaru,
                berkomitmen menghadirkan pelayanan publik yang prima, inklusif, dan berkelanjutan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#identitas"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0f7a43] shadow-[0_14px_30px_-20px_rgba(15,107,60,0.45)] transition hover:-translate-y-0.5 hover:bg-[#f3fbf7]"
                >
                  Data Dasar
                </a>
                <a
                  href="#visi-misi"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/45 bg-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
                >
                  Visi & Misi
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="public-card rounded-3xl bg-white/95 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Pimpinan Kelurahan</p>
                <p className="mt-1 text-2xl font-extrabold text-[#0f7a43]">Zikru Rakhman</p>
                <p className="text-sm text-[#334155]">Lurah Guntung Manggis</p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-xl border border-[#dcebe3] bg-white p-3">
                    <p className="text-xs font-semibold text-[#64748b]">Penduduk</p>
                    <p className="text-lg font-extrabold text-[#0f172a]">33.629 Jiwa</p>
                  </div>
                  <div className="rounded-xl border border-[#dcebe3] bg-white p-3">
                    <p className="text-xs font-semibold text-[#64748b]">Luas Wilayah</p>
                    <p className="text-lg font-extrabold text-[#0f172a]">39,74 Ha</p>
                  </div>
                  <div className="rounded-xl border border-[#dcebe3] bg-white p-3">
                    <p className="text-xs font-semibold text-[#64748b]">RT / RW</p>
                    <p className="text-lg font-extrabold text-[#0f172a]">51 RT / 6 RW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="identitas" className="public-section py-14 md:py-16">
        <div className="public-shell">
          <span className="section-kicker">Data Dasar</span>
          <h2 className="section-title mt-2">Informasi Umum Kelurahan</h2>

          <div className="mt-6 rounded-3xl border border-[#dcebe3] bg-white p-4 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.34)] sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {identitasKelurahan.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#e4efe9] bg-gradient-to-b from-white to-[#f8fcfa] p-4 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.32)]"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebf7f0] text-[#0f7a43]">
                    <item.icon size={18} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#0f172a]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-[#d9e9e1] bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.28)]">
            <div className="border-b border-[#e6efe9] bg-[#f7fcf9] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">Batas Wilayah</p>
            </div>
            <div className="divide-y divide-[#edf4ef]">
              {batasWilayah.map((item) => (
                <div
                  key={item.arah}
                  className="grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-[#f9fdfb] sm:grid-cols-[110px_1fr]"
                >
                  <p className="text-sm font-semibold text-[#0f7a43]">{item.arah}</p>
                  <p className="text-sm text-[#334155]">{item.wilayah}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-muted-bg py-14 md:py-16">
        <div className="public-shell">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="section-kicker">Potensi Wilayah</span>
              <h2 className="section-title mt-2">Keunggulan Kelurahan Guntung Manggis</h2>
              <p className="section-subtitle">
                Potensi lokal menjadi fondasi pembangunan kelurahan yang berkelanjutan, inklusif,
                dan berorientasi pada peningkatan kualitas hidup masyarakat.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {potensiWilayah.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#deece5] bg-white p-5 shadow-[0_14px_32px_-26px_rgba(15,23,42,0.35)]"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ebf7f0] text-[#0f7a43]">
                      <item.icon size={20} />
                    </div>
                    <p className="text-base font-bold text-[#0f172a]">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#475569]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visi-misi" className="public-section py-14 md:py-16">
        <div className="public-shell">
          <span className="section-kicker">Arah Pembangunan</span>
          <h2 className="section-title mt-2">Visi & Misi Kelurahan</h2>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-3xl border border-[#d8e9e0] bg-white p-6 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.36)]">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">Visi</p>
                <p className="mt-3 text-xl font-extrabold leading-tight text-[#0f172a]">“{visiKelurahan}”</p>
              </div>

              <div className="rounded-3xl border border-[#dbeae3] bg-white p-5 shadow-[0_16px_34px_-28px_rgba(15,23,42,0.3)]">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">Penjelasan Visi</p>
                <div className="mt-3 space-y-3">
                  {penjelasanVisi.map((item) => (
                    <div key={item.title} className="rounded-xl border border-[#e3eee8] bg-[#f8fcfa] p-3">
                      <p className="text-sm font-bold text-[#0f7a43]">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#334155]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#dbeae3] bg-white p-6 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.3)] lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">Misi</p>
              <ul className="mt-3 space-y-3">
                {misi.map((item, idx) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#334155]">
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#e9f6ef] text-xs font-bold text-[#0f7a43]">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section pb-16 md:pb-20 pt-14 md:pt-16">
        <div className="public-shell">
          <span className="section-kicker">Demografi</span>
          <h2 className="section-title mt-2">Gambaran Warga</h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demografi.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#deece5] bg-white p-5 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.28)]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf6ef] text-[#0f7a43]">
                  <item.icon size={18} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">{item.label}</p>
                <p className="mt-1 text-base font-extrabold text-[#0f172a]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-[#cfe3d7] bg-gradient-to-r from-[#0f6b3c] to-[#0d5b34] p-5 text-white shadow-[0_24px_50px_-34px_rgba(15,107,60,0.75)] sm:flex sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-lg font-bold">Butuh Bantuan atau Layanan?</p>
              <p className="text-sm text-white/90">Kami siap membantu kebutuhan administrasi dan informasi Anda.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
              <Link
                href="/layanan"
                className="inline-flex items-center justify-center rounded-xl border border-white/60 bg-white px-4 py-2.5 text-sm font-semibold text-[#0f7a43] shadow-sm transition hover:bg-[#f3faf6]"
              >
                Ajukan Layanan
              </Link>
              <Link href="/kontak" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0f7a43]">
                Hubungi Kami <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
