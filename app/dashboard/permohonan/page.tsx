import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { FileText } from "lucide-react";

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
    DISETUJAI_RT: "bg-teal-100 text-teal-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK_RT: "bg-orange-100 text-orange-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const filters = [
    { label: "Semua", value: "" },
    { label: "Menunggu RT", value: "MENUNGGU" },
    { label: "Disetujui RT", value: "DISETUJAI_RT" },
    { label: "Diproses", value: "DIPROSES" },
    { label: "Selesai", value: "SELESAI" },
    { label: "Ditolak", value: "DITOLAK" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Permohonan Layanan</h1>
          <p className="text-sm text-stone-500 mt-1">{total} permohonan ditemukan.</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/dashboard/permohonan?status=${f.value}` : "/dashboard/permohonan"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              status === f.value
                ? "bg-[#1e40af] text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {["Tiket", "Nama", "RT", "Layanan", "Telepon", "Status", "Tanggal", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {error || !data?.length ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-stone-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Belum ada permohonan.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-semibold text-[#1e40af]">{row.tiket}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-stone-800">{row.nama}</p>
                      {row.nik && <p className="text-xs text-stone-400">{row.nik}</p>}
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-600">
                      {row.nomor_rt ? `RT ${row.nomor_rt}` : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-600">{row.layanan}</td>
                    <td className="px-5 py-4 text-sm text-stone-600">{row.telepon}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-stone-400">
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
          <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between">
            <p className="text-xs text-stone-400">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/permohonan?status=${status}&page=${page - 1}`}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
                >
                  Sebelumnya
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/permohonan?status=${status}&page=${page + 1}`}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
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
