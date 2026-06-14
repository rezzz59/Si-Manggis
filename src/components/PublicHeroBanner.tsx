import { ReactNode } from "react";

type PublicHeroBannerProps = {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
  visual?: ReactNode;
};

export default function PublicHeroBanner({
  kicker,
  title,
  description,
  children,
  visual,
}: PublicHeroBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#d7e8de] pt-28 pb-10 sm:pt-32 sm:pb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f6b3c] via-[#14804a] to-[#0f6b3c]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_34%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_30%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="public-shell relative z-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              {kicker}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              {description}
            </p>
            {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/35 bg-white/95 p-4 shadow-[0_20px_38px_-24px_rgba(2,44,24,0.7)]">
              {visual ?? (
                <div className="rounded-xl border border-[#dcebe3] bg-[#f7fbf9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">SI-MANGGIS</p>
                  <p className="mt-1 text-lg font-extrabold text-[#0f172a]">Layanan Publik Digital</p>
                  <p className="mt-1 text-sm text-[#5f7287]">
                    Cepat, transparan, dan mudah diakses warga.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
