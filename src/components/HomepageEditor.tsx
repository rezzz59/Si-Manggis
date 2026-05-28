"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, RefreshCw, Star } from "lucide-react";

type Asset = {
  id: string;
  storage_url: string;
  alt_text: string;
  caption: string;
  category: string;
};

type HeroConfig = {
  asset_id: string | null;
  title: string;
  subtitle: string;
};

export default function HomepageEditor() {
  const [heroAssets, setHeroAssets] = useState<Asset[]>([]);
  const [config, setConfig] = useState<HeroConfig>({
    asset_id: null,
    title: "Gunting Manggis",
    subtitle: "Portal Resmi Kelurahan Gunting Manggis",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const [assetsRes, configRes] = await Promise.all([
        fetch("/api/assets?category=hero"),
        fetch("/api/homepage"),
      ]);
      const { data: assetsData } = await assetsRes.json();
      const { data: configData } = await configRes.json();
      setHeroAssets(assetsData ?? []);
      const heroSection = configData?.find(
        (c: { section: string }) => c.section === "hero"
      );
      if (heroSection) {
        setConfig(heroSection.config);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", config }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Gagal menyimpan konfigurasi");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-stone-100 rounded animate-pulse" />
        <div className="h-48 bg-stone-100 rounded animate-pulse" />
      </div>
    );
  }

  const selectedAsset = heroAssets.find((a) => a.id === config.asset_id);

  return (
    <div className="space-y-6">
      {/* Hero Section Editor */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="text-base font-bold text-stone-800 mb-4">Hero Section</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image Selection */}
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">
              Pilih Gambar Hero ({heroAssets.length} tersedia)
            </p>
            {heroAssets.length === 0 ? (
              <div className="border border-dashed border-stone-200 rounded-lg p-6 text-center">
                <p className="text-xs text-stone-400">
                  Belum ada gambar hero.{" "}
                  <a href="/dashboard/aset" className="text-blue-600 underline">
                    Upload dulu di halaman Aset
                  </a>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {heroAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() =>
                      setConfig((c) => ({ ...c, asset_id: asset.id }))
                    }
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      config.asset_id === asset.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Image
                      src={asset.storage_url}
                      alt={asset.alt_text}
                      fill
                      className="object-cover"
                    />
                    {config.asset_id === asset.id && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                        <Star size={20} className="text-white fill-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Preview */}
            {selectedAsset && (
              <div className="mt-3">
                <p className="text-[10px] text-stone-400 mb-1">Preview:</p>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={selectedAsset.storage_url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Text Config */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Judul Utama
              </label>
              <input
                value={config.title}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, title: e.target.value }))
                }
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Subtitle
              </label>
              <input
                value={config.subtitle}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, subtitle: e.target.value }))
                }
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-[#1e40af] text-white px-5 py-2.5 rounded-lg hover:bg-[#1e3a8a] transition disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
          {saved && (
            <span className="text-xs text-green-600 font-medium">
              Tersimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
