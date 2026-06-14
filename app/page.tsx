"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Megaphone,
  FileBadge2,
  FileText,
  House,
  IdCard,
  ScrollText,
  ShieldAlert,
  Search,
  Headphones,
  Smile,
  Users,
  FileCheck2,
  Building2,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Globe,
  MessageCircle,
  Mail,
  Send,
} from "lucide-react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

const LAYANAN_PENGAJUAN = [
  { icon: IdCard, title: "Surat Pengantar KTP", desc: "Pengajuan surat pengantar pembuatan atau pembaruan KTP.", href: "/layanan", tag: "Administrasi Kependudukan" },
  { icon: ScrollText, title: "Surat Pengantar Acara", desc: "Pengajuan surat pengantar kegiatan warga dan acara lingkungan.", href: "/layanan", tag: "Kegiatan Warga" },
  { icon: House, title: "Surat Domisili", desc: "Layanan keterangan domisili untuk kebutuhan sekolah, kerja, dan lainnya.", href: "/layanan", tag: "Dokumen Kelurahan" },
  { icon: FileBadge2, title: "Pengantar SKCK", desc: "Permohonan surat pengantar SKCK untuk keperluan pekerjaan dan administrasi.", href: "/layanan", tag: "Keamanan & Legal" },
  { icon: FileText, title: "Surat Keterangan Usaha", desc: "Layanan surat keterangan usaha (SKU) untuk pelaku usaha lokal.", href: "/layanan", tag: "UMKM" },
  { icon: ShieldAlert, title: "Pengaduan Masyarakat", desc: "Laporkan keluhan lingkungan, fasilitas umum, dan pelayanan.", href: "/pengaduan", tag: "Aduan Publik" },
];

const BERITA_UTAMA = {
  title: "Pelayanan Administrasi Kelurahan Kini Lebih Ringkas dan Terjadwal",
  date: "12 Jan 2026",
  category: "Layanan Publik",
  desc: "Warga kini dapat mengurus dokumen harian dengan alur antrean yang lebih cepat, transparan, dan mudah dipantau dari satu portal.",
  image: "/img/Sekilas-Tentang-Danau-Seran.jpg",
};

const BERITA_SAMPING = [
  { title: "Verifikasi Data KK Tahap I Mulai di Seluruh RT", date: "10 Jun 2025", category: "Informasi", desc: "Pemutakhiran data keluarga dilakukan bertahap untuk memastikan akurasi layanan." },
  { title: "Sosialisasi Layanan Digital SI-MANGGIS", date: "08 Jun 2025", category: "Kegiatan", desc: "Pengurus wilayah dibekali alur pengajuan online agar pendampingan warga lebih efektif." },
  { title: "Potensi Perkebunan Sawit untuk Warga", date: "06 Jun 2025", category: "Potensi", desc: "Pemetaan potensi ekonomi lokal untuk meningkatkan peluang usaha masyarakat." },
];

const KEUNGGULAN = [
  { icon: BadgeCheck, title: "Pelayanan Cepat", desc: "Proses mudah dan terukur" },
  { icon: ShieldCheck, title: "Transparan", desc: "Status layanan jelas terbuka" },
  { icon: Building2, title: "Aman & Terpercaya", desc: "Data warga terlindungi" },
  { icon: Sparkles, title: "24/7 Online", desc: "Layanan dapat diakses kapan saja" },
];

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const filteredLayanan = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return LAYANAN_PENGAJUAN;
    return LAYANAN_PENGAJUAN.filter((item) => `${item.title} ${item.desc} ${item.tag}`.toLowerCase().includes(q));
  }, [keyword]);

  const suggestions = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];
    return LAYANAN_PENGAJUAN.filter((item) => `${item.title} ${item.desc} ${item.tag}`.toLowerCase().includes(q)).slice(0, 8);
  }, [keyword]);

  useEffect(() => {
    const closeSuggestionsOnScroll = () => setKeyword((prev) => (prev ? "" : prev));
    window.addEventListener("scroll", closeSuggestionsOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeSuggestionsOnScroll);
  }, []);

  const handleSearch = () => {
    const q = keyword.trim();
    router.push(q ? `/layanan?q=${encodeURIComponent(q)}` : "/layanan");
  };

  return (
    <main className="min-h-full bg-[#f8faf8] text-[#0f172a]">
      <section className="relative isolate min-h-[100svh] overflow-hidden pt-28 pb-12 sm:pt-32">
        <Image src="/img/Sekilas-Tentang-Danau-Seran.jpg" alt="Aerial view Kelurahan Guntung Manggis" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b4f2e]/88 via-[#0f7a43]/68 to-[#0a5c33]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,30,19,0.45),rgba(6,30,19,0.1))]" />
        <div className="page-shell relative z-10 flex min-h-[calc(100svh-7rem)] items-center">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <AnimateOnScroll className="lg:col-span-7 lg:pr-6">
              <span className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">Selamat Datang di SI-MANGGIS</span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:text-6xl">Layanan Digital Kelurahan<span className="block text-[#86efac]">Guntung Manggis</span>yang Cepat dan Transparan</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">Solusi layanan administrasi publik modern yang ramah masyarakat, mudah diakses, dan transparan untuk seluruh warga.</p>
              <div className="relative mt-6 max-w-2xl">
                <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/95 px-4 py-3.5 shadow-[0_16px_42px_-26px_rgba(2,44,24,0.65)] backdrop-blur-sm">
                  <Search size={18} className="text-[#0f7a43]" />
                  <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Cari layanan, contoh: Surat Pengantar KTP" className="flex-1 bg-transparent text-sm text-[#0f172a] placeholder:text-[#64748b] outline-none" aria-label="Cari layanan" />
                  <button type="button" onClick={handleSearch} className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-[#0f7a43] px-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0c6638]" aria-label="Cari layanan">Cek Status <ArrowRight size={15} /></button>
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9500] max-h-56 overflow-y-auto rounded-2xl border border-[#dceae1] bg-white shadow-[0_24px_45px_-30px_rgba(15,23,42,0.5)]">
                    {suggestions.map((item) => (
                      <Link key={item.title} href={item.href} className="block border-b border-[#edf3ef] px-4 py-3 last:border-b-0 hover:bg-[#f6fbf8]">
                        <p className="text-sm font-semibold text-[#0f172a]">{item.title}</p>
                        <p className="mt-0.5 text-xs text-[#0f7a43]">{item.tag}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/layanan" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0f7a43] transition hover:-translate-y-0.5">Ajukan Layanan <ArrowRight size={15} /></Link>
                <Link href="/cek-tiket" className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">Cek Status Layanan</Link>
                <Link href="/kontak" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d1fae5] transition hover:text-white">Butuh bantuan? Hubungi Petugas <ArrowRight size={15} /></Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120} className="lg:col-span-5 lg:justify-self-end lg:self-center">
              <div className="w-full max-w-sm rounded-[24px] border border-white/35 bg-white/95 p-5 shadow-[0_24px_45px_-30px_rgba(2,44,24,0.8)] backdrop-blur-md">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e2efe7] bg-white p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7ee] text-[#0f7a43]"><Users size={18} /></div><div><p className="text-3xl font-extrabold leading-none text-[#0f172a]">31.000</p><p className="text-sm text-[#64748b]">Penduduk</p></div></div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e2efe7] bg-white p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7ee] text-[#0f7a43]"><Building2 size={18} /></div><div><p className="text-3xl font-extrabold leading-none text-[#0f172a]">4.250 Ha</p><p className="text-sm text-[#64748b]">Luas Wilayah</p></div></div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e2efe7] bg-white p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7ee] text-[#0f7a43]"><FileCheck2 size={18} /></div><div><p className="text-3xl font-extrabold leading-none text-[#0f172a]">51 RT / 6 RW</p><p className="text-sm text-[#64748b]">Wilayah Administratif</p></div></div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e2efe7] bg-white p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7ee] text-[#0f7a43]"><Sparkles size={18} /></div><div><p className="text-lg font-extrabold leading-none text-[#0f172a]">Desa Perkebunan</p><p className="text-sm text-[#64748b]">Potensi Unggulan</p></div></div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="page-shell">
          <AnimateOnScroll><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="section-kicker">Layanan Populer</p><h2 className="section-title mt-2">Layanan yang Sering Diajukan</h2></div><Link href="/layanan" className="inline-flex items-center gap-2 rounded-xl border border-[#d5e7dc] bg-white px-4 py-2 text-sm font-semibold text-[#0f7a43] transition hover:bg-[#f3faf6]">Lihat Semua Layanan <ArrowRight size={15} /></Link></div></AnimateOnScroll>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {filteredLayanan.slice(0, 6).map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 40}>
                <Link href={item.href} className="group flex h-full flex-col items-center justify-center rounded-[22px] border border-[#dcebe3] bg-white p-5 text-center shadow-[0_14px_38px_-28px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_42px_-24px_rgba(15,23,42,0.32)]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ecf8f1] text-[#0f7a43] transition-transform duration-300 group-hover:scale-110"><item.icon size={22} strokeWidth={2} /></div>
                  <h3 className="text-sm font-bold leading-snug text-[#0f172a]">{item.title}</h3>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8"><div className="page-shell"><AnimateOnScroll><div className="grid grid-cols-1 gap-3 rounded-[24px] bg-gradient-to-r from-[#0b6a3a] via-[#0f7a43] to-[#0e6d3d] p-5 text-white shadow-[0_20px_45px_-32px_rgba(2,44,24,0.8)] md:grid-cols-4 md:p-7"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><FileCheck2 size={20} /></div><div><p className="text-3xl font-extrabold leading-none">1.250+</p><p className="text-sm text-white/85">Surat Diproses Bulan Ini</p></div></div><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Users size={20} /></div><div><p className="text-3xl font-extrabold leading-none">3.800+</p><p className="text-sm text-white/85">Warga Terdaftar di Sistem</p></div></div><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Smile size={20} /></div><div><p className="text-3xl font-extrabold leading-none">98%</p><p className="text-sm text-white/85">Kepuasan Layanan</p></div></div><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 p-3"><div className="flex items-center gap-2"><Headphones size={18} /><div><p className="text-sm font-semibold">Butuh Bantuan?</p><p className="text-xs text-white/85">Hubungi Petugas Kami</p></div></div><Link href="/kontak" className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0f7a43]">Kontak Kami <ArrowRight size={14} /></Link></div></div></AnimateOnScroll></div></section>

      <section className="pb-8"><div className="page-shell"><AnimateOnScroll delay={60}><div className="flex flex-col gap-3 rounded-2xl border border-[#dcebe3] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f6ef] text-[#0f7a43]"><Megaphone size={18} /></div><p className="text-sm text-[#334155]"><span className="font-semibold text-[#0f7a43]">Pengumuman Terbaru:</span> Pelayanan administrasi tutup pada tanggal 17 Juni 2025. Pelayanan kembali dibuka 18 Juni 2025.</p></div><Link href="/artikel" className="text-sm font-semibold text-[#0f7a43] hover:text-[#0c6638]">Lihat Semua</Link></div></AnimateOnScroll></div></section>

      <section className="pb-12 pt-2 sm:pb-16">
        <div className="page-shell">
          <AnimateOnScroll><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="section-kicker">Berita & Kegiatan</p><h2 className="section-title mt-2">Informasi Terbaru Kelurahan</h2></div><Link href="/artikel" className="inline-flex items-center gap-2 rounded-xl border border-[#d5e7dc] bg-white px-4 py-2 text-sm font-semibold text-[#0f7a43] transition hover:bg-[#f3faf6]">Lihat Semua Berita <ArrowRight size={15} /></Link></div></AnimateOnScroll>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <AnimateOnScroll className="lg:col-span-6"><article className="group relative min-h-[300px] overflow-hidden rounded-[24px] border border-[#dce8df] bg-white"><Image src={BERITA_UTAMA.image} alt={BERITA_UTAMA.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#07150f]/90 via-[#07150f]/50 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6"><span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">{BERITA_UTAMA.category}</span><h3 className="mt-3 text-2xl font-extrabold leading-tight text-white">{BERITA_UTAMA.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/85">{BERITA_UTAMA.desc}</p><p className="mt-3 text-xs font-semibold text-white/80">{BERITA_UTAMA.date}</p></div></article></AnimateOnScroll>
            <div className="space-y-4 lg:col-span-6">
              {BERITA_SAMPING.map((item, idx) => (
                <AnimateOnScroll key={item.title} delay={idx * 60 + 40}>
                  <article className="group flex items-start gap-4 rounded-[22px] border border-[#dcebe3] bg-white p-4 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-24px_rgba(15,23,42,0.35)]">
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eef7f1]"><Image src="/img/layanan.png" alt={item.title} width={112} height={80} className="h-full w-full object-cover" /></div>
                    <div className="min-w-0"><span className="inline-flex rounded-full bg-[#e9f6ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f7a43]">{item.category}</span><h3 className="mt-2 text-lg font-bold leading-snug text-[#0f172a]">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-[#64748b]">{item.desc}</p><p className="mt-2 text-xs font-semibold text-[#0f7a43]">{item.date}</p></div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="page-shell">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 gap-5 rounded-[24px] border border-[#dcebe3] bg-white p-5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.45)] lg:grid-cols-12 lg:p-7">
              <div className="relative min-h-[260px] overflow-hidden rounded-[22px] border border-[#dcebe3] lg:col-span-7"><Image src="/img/bg.png" alt="Kantor Kelurahan Guntung Manggis" fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0c2a1b]/70 via-transparent to-transparent" /></div>
              <div className="lg:col-span-5">
                <p className="section-kicker">Tentang Kelurahan</p>
                <h2 className="mt-2 text-3xl font-extrabold leading-tight text-[#0f172a]">Kelurahan Guntung Manggis</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">Kelurahan Guntung Manggis merupakan wilayah yang berkembang dengan potensi perkebunan, pertanian, dan sumber daya alam yang melimpah. Kami berkomitmen memberikan pelayanan terbaik untuk warga secara digital, inklusif, dan berkelanjutan.</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {KEUNGGULAN.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-[#e4efe8] bg-[#fbfdfb] p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f6ef] text-[#0f7a43]"><item.icon size={16} /></div><div><p className="text-sm font-bold text-[#0f172a]">{item.title}</p><p className="text-xs text-[#64748b]">{item.desc}</p></div></div>
                  ))}
                </div>
                <Link href="/profil" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#cfe3d7] px-4 py-2.5 text-sm font-semibold text-[#0f7a43] transition hover:bg-[#f3faf6]">Selengkapnya Tentang Kami <ArrowRight size={15} /></Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-[#0a3f25] via-[#0d5b34] to-[#0a3f25] text-white">
        <div className="page-shell py-10">
          <AnimateOnScroll><div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"><div><p className="text-xl font-extrabold tracking-tight">SI-MANGGIS</p><p className="mt-2 text-sm leading-relaxed text-white/85">Layanan Kelurahan Digital modern untuk pelayanan publik yang cepat, transparan, dan ramah warga.</p><div className="mt-4 flex items-center gap-2.5">{[Globe, MessageCircle, Mail, Send].map((Icon, idx) => (<span key={idx} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10"><Icon size={15} /></span>))}</div></div><div><p className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">Navigasi</p><ul className="mt-3 space-y-2 text-sm text-white/85"><li><Link href="/">Beranda</Link></li><li><Link href="/layanan">Layanan</Link></li><li><Link href="/artikel">Pengumuman</Link></li><li><Link href="/pengaduan">Pengaduan</Link></li></ul></div><div><p className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">Kontak Kami</p><ul className="mt-3 space-y-2 text-sm text-white/85"><li>Jl. Guntung Manggis No. 01</li><li>Landasan Ulin, Kalimantan Selatan</li><li>(0512) 123 5678</li><li>kel.guntungmanggis@email.id</li></ul></div><div><p className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">Butuh Bantuan?</p><p className="mt-3 text-sm text-white/85">Hubungi petugas kami untuk informasi lebih lanjut.</p><Link href="/kontak" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0f7a43]">Hubungi Kami<ArrowRight size={14} /></Link></div></div></AnimateOnScroll>
          <div className="mt-8 border-t border-white/15 pt-4 text-xs text-white/75">© {new Date().getFullYear()} SI-MANGGIS. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
