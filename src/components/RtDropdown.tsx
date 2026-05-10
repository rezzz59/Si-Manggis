"use client";

import { useEffect, useState } from "react";

interface RT {
  nomor_rt: string;
  nama_ketua: string | null;
  no_wa_rt: string | null;
}

export default function RtDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [rtList, setRtList] = useState<RT[]>([]);

  useEffect(() => {
    fetch("/api/rt")
      .then((r) => r.json())
      .then((data: RT[]) => setRtList(data))
      .catch(() => {
        // fallback: generate 52 RT jika API gagal
        setRtList(
          Array.from({ length: 52 }, (_, i) => ({
            nomor_rt: String(i + 1).padStart(2, "0"),
            nama_ketua: null,
            no_wa_rt: null,
          }))
        );
      });
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
    >
      <option value="">-- Pilih RT --</option>
      {rtList.map((rt) => (
        <option key={rt.nomor_rt} value={rt.nomor_rt}>
          RT {rt.nomor_rt}
          {rt.nama_ketua ? ` — ${rt.nama_ketua}` : ""}
        </option>
      ))}
    </select>
  );
}