import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { FileText, MessageSquare, Clock, CheckCircle, ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  const [
    { count: totalPermohonan },
    { count: totalPengaduan },
    { count: menungguPermohonan },
    { count: menungguPengaduan },
    { count: selesaiPermohonan },
    { count: selesaiPengaduan },
  ] = await Promise.all([
    supabase.from("permohonan").select("*", { count: "exact", head: true }),
    supabase.from("pengaduan").select("*", { count: "exact", head: true }),
    supabase.from("permohonan").select("*", { count: "exact", head: true }).eq("status", "MENUNGGU"),
    supabase.from("pengaduan").select("*", { count: "exact", head: true }).eq("status", "MENUNGGU"),
    supabase.from("permohonan").select("*", { count: "exact", head: true }).eq("status", "SELESAI"),
    supabase.from("pengaduan").select("*", { count: "exact", head: true }).eq("status", "SELESAI"),
  ]);

  const { data: recentPermohonan } = await supabase
    .from("permohonan")
    .select("*")
    .order("createdat", { ascending: false })
    .limit(5);

  const { data: recentPengaduan } = await supabase
    .from("pengaduan")
    .select("*")
    .order("createdat", { ascending: false })
    .limit(5);

  const statCards = [
    {
      label: "Total Permohonan",
      value: totalPermohonan ?? 0,
      icon: FileText,
      color: "bg-[#eff6ff] text-[#1e40af]",
      href: "/dashboard/permohonan",
    },
    {
      label: "Total Pengaduan",
      value: totalPengaduan ?? 0,
      icon: MessageSquare,
      color: "bg-[#f0fdf4] text-[#16a34a]",
      href: "/dashboard/pengaduan",
    },
    {
      label: "Menunggu RT",
      value: menungguPermohonan ?? 0,
      icon: Clock,
      color: "bg-[#fff7ed] text-[#f97316]",
      href: "/dashboard/permohonan?status=MENUNGGU",
    },
    {
      label: "Disetujui RT",
      value: 0,
      icon: ShieldCheck,
      color: "bg-teal-50 text-teal-600",
      href: "/dashboard/permohonan?status=DISETUJAI_RT",
    },
    {
      label: "Selesai",
      value: (selesaiPermohonan ?? 0) + (selesaiPengaduan ?? 0),
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      href: "/dashboard/permohonan?status=SELESAI",
    },
  ];

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DISETUJAI_RT: "bg-teal-100 text-teal-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK_RT: "bg-orange-100 text-orange-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">Ringkasan permohonan dan pengaduan warga.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-sm flex items-center gap-4 cursor-pointer transition-shadow"
          >
            <div className={`h-11 w-11 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{value}</p>
              <p className="text-xs text-stone-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Permohonan Terbaru</h2>
            <Link href="/dashboard/permohonan" className="text-xs text-[#1e40af] font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {!recentPermohonan?.length ? (
              <p className="text-sm text-stone-400 text-center py-8">Belum ada permohonan.</p>
            ) : (
              recentPermohonan.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/permohonan/${p.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{p.nama}</p>
                    <p className="text-xs text-stone-400">{p.layanan}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Pengaduan Terbaru</h2>
            <Link href="/dashboard/pengaduan" className="text-xs text-[#1e40af] font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {!recentPengaduan?.length ? (
              <p className="text-sm text-stone-400 text-center py-8">Belum ada pengaduan.</p>
            ) : (
              recentPengaduan.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/pengaduan/${p.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{p.nama}</p>
                    <p className="text-xs text-stone-400">{p.topik}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
