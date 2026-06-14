import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { FileText, Search, Filter, ArrowRightLeft } from "lucide-react";

export default async function PermohonanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: statusRaw, page: pageRaw } = await searchParams;
  const status = statusRaw ?? "";
  const page = parseInt(pageRaw ?? "1");
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("permohonan")
    .select("*", { count: "exact" })
    .order("createdat", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    MENUNGGU_KONFIRMASI_RT: "bg-yellow-100 text-yellow-700",
    DISETUJUI_RT: "bg-teal-100 text-teal-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK_RT: "bg-orange-100 text-orange-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const filters = [
    { label: "Semua", value: "" },
    { label: "Menunggu RT", value: "MENUNGGU_KONFIRMASI_RT" },
    { label: "Disetujui RT", value: "DISETUJUI_RT" },
    { label: "Ditolak RT", value: "DITOLAK_RT" },
    { label: "Diproses", value: "DIPROSES" },
    { label: "Selesai", value: "SELESAI" },
    { label: "Ditolak", value: "DITOLAK" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#dbe5f3] bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] px-6 py-5 text-white shadow-[0_20px_45px_-30px_rgba(30,64,175,0.65)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">Modul Admin</p>
        <h1 className="mt-1 text-2xl font-extrabold">Permohonan Layanan</h1>
        <p className="mt-1 text-sm text-white/90">{total} permohonan ditemukan untuk diproses.</p>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-xs font-semibold text-[#64748b]">
            <Filter size={14} />
            Filter Status
          </div>
          {filters.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/dashboard/permohonan?status=${f.value}` : "/dashboard/permohonan"}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                status === f.value
                  ? "bg-[#1e40af] text-white shadow-sm"
                  : "border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc]"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-[#1e40af]">
              <Search size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">Daftar Permohonan</p>
              <p className="text-xs text-[#64748b]">Tampilan halaman {page} dari {Math.max(totalPages, 1)}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-[#64748b]">
            <ArrowRightLeft size={12} />
            Terbaru di atas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead className="sticky top-0 z-10 bg-[#f8fafc]">
              <tr className="border-b border-[#eef2f7]">
                {["Tiket", "Nama", "RT", "Layanan", "Telepon", "Status", "Tanggal", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2f7]">
              {error || !data?.length ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#94a3b8]">
                    <FileText size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Belum ada permohonan.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="transition-colors odd:bg-white even:bg-[#fbfdff] hover:bg-[#f5f9ff]">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-semibold text-[#1e40af]">{row.tiket}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#0f172a]">{row.nama}</p>
                      {row.nik && <p className="text-xs text-[#64748b]">{row.nik}</p>}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#475569]">
                      {row.nomor_rt ? `RT ${row.nomor_rt}` : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#475569]">{row.layanan}</td>
                    <td className="px-5 py-4 text-sm text-[#475569]">{row.telepon}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#64748b]">
                      {new Date(row.createdat).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/permohonan/${row.id}`}
                        className="text-xs font-semibold text-[#1e40af] hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#eef2f7] px-5 py-4">
            <p className="text-xs text-[#64748b]">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/permohonan?status=${status}&page=${page - 1}`}
                  className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f8fafc]"
                >
                  Sebelumnya
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/permohonan?status=${status}&page=${page + 1}`}
                  className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f8fafc]"
                >
                  Selanjutnya
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
