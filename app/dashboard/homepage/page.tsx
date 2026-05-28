import HomepageEditor from "@/src/components/HomepageEditor";

export const metadata = {
  title: "Konfigurasi Homepage - Si-Manggis Admin",
};

export default function HomepageConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Konfigurasi Homepage</h1>
        <p className="text-sm text-stone-500 mt-1">
          Atur gambar hero, teks, dan tampilan halaman utama.
        </p>
      </div>
      <HomepageEditor />
    </div>
  );
}
