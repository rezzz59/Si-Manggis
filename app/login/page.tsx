"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LogIn, AlertCircle, Lock, UserCircle2 } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau kata sandi salah.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <main className="flex min-h-full flex-col">
      <section className="relative flex min-h-[calc(100vh-96px)] items-center overflow-hidden bg-[radial-gradient(circle_at_top,#eef8f1_0%,#f7fbf9_46%,#f7fbf9_100%)] py-10 sm:py-12">
        <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-[#9adfba]/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-14 -bottom-20 h-72 w-72 rounded-full bg-[#b9efd2]/30 blur-3xl" />

        <div className="mx-auto flex w-full max-w-md items-center px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-[#d6e8de] bg-white shadow-[0_28px_52px_-34px_rgba(15,23,42,0.38)]">
            <div className="border-b border-[#e7efe9] bg-gradient-to-b from-[#fbfefd] to-[#f4faf7] px-7 py-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6ef] text-[#1f7a4f]">
                <Lock size={22} />
              </div>
              <h2 className="text-lg font-bold text-[#0f172a]">Login Staff</h2>
              <p className="mt-1 text-xs text-[#64748b]">Gunakan email dan kata sandi akun petugas.</p>
            </div>

            <div className="px-7 py-6">
              {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0 text-red-500" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                    Email
                  </label>
                  <div className="relative">
                    <UserCircle2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8aa0]" />
                    <input
                      type="email"
                      inputMode="email"
                      placeholder="admin@desaguntungmanggis.id"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-[#d6e3db] bg-white py-3 pl-10 pr-4 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#1f7a4f] focus:ring-4 focus:ring-[#1f7a4f]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Kata sandi Anda"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className="w-full rounded-xl border border-[#d6e3db] bg-white px-4 py-3 pr-11 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#1f7a4f] focus:ring-4 focus:ring-[#1f7a4f]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#7b8aa0] transition hover:text-[#4b5d73]"
                      aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f7a4f] to-[#14532d] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 hover:from-[#176741] hover:to-[#114627] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

              <p className="mt-4 text-center text-[11px] leading-relaxed text-[#6b7280]">
                Akses ini dilindungi dan hanya untuk petugas berwenang.
                <br />
                Seluruh aktivitas login dapat tercatat untuk keamanan sistem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
