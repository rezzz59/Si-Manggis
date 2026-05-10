import FormLaporan from "@/src/components/FormLaporan";

export default function LaporanPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="w-8 h-[3px] bg-[#f97316] mb-3" />
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
            Ajukan Laporan
          </h1>
          <p className="text-sm text-[#94a3b8] mt-2">
            Laporan akan dikirimkan ke WA RT terkait untuk persetujuan terlebih dahulu.
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-sm p-6 sm:p-8">
          <FormLaporan />
        </div>
      </div>
    </main>
  );
}