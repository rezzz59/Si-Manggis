"use client";

import { useState } from "react";

type Status =
  | "MENUNGGU"
  | "DISETUJAI_RT"
  | "DIPROSES"
  | "SELESAI"
  | "DITOLAK_RT"
  | "DITOLAK"
  | "ESKALASI_STAF";

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  MENUNGGU:        { label: "Menunggu Persetujuan RT",   icon: "⏳", color: "text-[#f97316]", bg: "bg-[#fff7ed]" },
  DISETUJAI_RT:    { label: "Disetujui RT",              icon: "✅", color: "text-[#16a34a]", bg: "bg-[#f0fdf4]" },
  DIPROSES:        { label: "Sedang Diproses Kelurahan", icon: "🔄", color: "text-[#1e40af]", bg: "bg-[#eff6ff]" },
  SELESAI:         { label: "Selesai",                   icon: "🎉", color: "text-[#16a34a]", bg: "bg-[#f0fdf4]" },
  DITOLAK_RT:      { label: "Ditolak RT",                icon: "❌", color: "text-[#dc2626]", bg: "bg-[#fef2f2]" },
  DITOLAK:         { label: "Ditolak Kelurahan",         icon: "❌", color: "text-[#dc2626]", bg: "bg-[#fef2f2]" },
  ESKALASI_STAF:   { label: "Dibesarkan ke Admin Desa",  icon: "⚠️", color: "text-[#eab308]", bg: "bg-[#fefce8]" },
};

const STEPS: Status[] = [
  "MENUNGGU",
  "DISETUJAI_RT",
  "DIPROSES",
  "ESKALASI_STAF",
  "SELESAI",
];

export default function StatusTracker({ status }: { status: string }) {
  const currentIdx = STEPS.indexOf(status as Status);

  return (
    <div className="space-y-3">
      {STEPS.map((step, i) => {
        const cfg = STATUS_CONFIG[step];
        const done = i < currentIdx;
        const active = i === currentIdx || status === "ESKALASI_STAF";

        return (
          <div key={step} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${done
                ? "bg-[#16a34a] text-white"
                : active
                ? "bg-[#1e40af] text-white"
                : "bg-[#e2e8f0] text-[#94a3b8]"
              }`}
            >
              {done ? "✅" : active ? cfg.icon : "○"}
            </div>
            <div className="pt-0.5">
              <p
                className={`text-sm font-semibold ${
                  done ? "text-[#16a34a]" : active ? cfg.color : "text-[#94a3b8]"
                }`}
              >
                {cfg.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}