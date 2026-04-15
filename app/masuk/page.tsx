"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function MasukPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nik: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulasi login — belum terhubung ke backend
    await new Promise((r) => setTimeout(r, 800));

    if (!form.nik || !form.password) {
      setError("NIK dan kata sandi harus diisi.");
      setLoading(false);
      return;
    }

    // Placeholder: accept any credentials
    alert(
      `Login berhasil untuk NIK ${form.nik}. Halaman dashboard akan segera hadir!`
    );
    setLoading(false);
  };

  return (
    <main className="flex flex-col min-h-full">

      {/* Hero mini */}
      <section className="bg-[#1e3a5f] pt-28 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
            Akses Warga
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Masuk ke Portal
          </h1>
        </div>
      </section>

      {/* Form */}
      <section className="flex-1 bg-stone-50 py-14">
        <div className="mx-auto max-w-md px-6 lg:px-8">

          <div className="bg-white rounded-2xl border border-stone-200 p-7 shadow-sm">
            <div className="text-center mb-7">
              <div className="h-14 w-14 rounded-xl bg-[#1e40af] flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-white">SM</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                Masuk ke Si-Manggis
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Gunakan NIK dan kata sandi yang telah didaftarkan.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  NIK (Nomor Induk Kependudukan)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="16 digit NIK"
                  value={form.nik}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nik: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  maxLength={16}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata sandi Anda"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href="/lupa-sandi"
                  className="text-xs text-[#1e40af] hover:text-[#1e3a8a] font-medium"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1e40af] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Masuk
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-stone-400 mt-5">
            Belum punya akun?{" "}
            <Link
              href="/daftar"
              className="text-[#1e40af] font-semibold hover:underline"
            >
              Daftar di kantor desa
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
