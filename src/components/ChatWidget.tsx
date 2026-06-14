"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

type ChatResponse = {
  answer: string;
  sources: Array<{ id: string; title: string; link: string | null }>;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Halo 👋 Saya asisten SI-MANGGIS. Saya menjawab berdasarkan informasi website ini. Silakan tanya tentang layanan, pengaduan, profil, atau kontak.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Gagal memproses chat.");
      }

      const data = (await res.json()) as ChatResponse;
      let botText = data.answer;

      const normalizedMessage = message.toLowerCase().trim();
      const isGreetingOnly = /^(halo|hai|hello|hi|pagi|siang|sore|malam|selamat pagi|selamat siang|selamat sore|selamat malam)$/.test(
        normalizedMessage
      );

      if (data.sources?.length && !isGreetingOnly) {
        const sourceText = data.sources
          .map((s) => (s.link ? `• ${s.title} (${s.link})` : `• ${s.title}`))
          .join("\n");
        botText += `\n\nSumber:\n${sourceText}`;
      }

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan.";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Maaf, terjadi kendala: ${msg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[9999] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a4f] text-white shadow-[0_16px_32px_-18px_rgba(15,107,60,0.7)] transition hover:bg-[#166b42]"
          aria-label="Buka chatbot"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[9999] w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-[#d7e8de] bg-white shadow-[0_30px_60px_-35px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1f7a4f] to-[#166b42] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Asisten SI-MANGGIS</p>
              <p className="text-[11px] text-white/85">Berbasis pengetahuan website</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25"
              aria-label="Tutup chatbot"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto bg-[#f6fbf8] px-3 py-3">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "ml-auto bg-[#1f7a4f] text-white"
                    : "bg-white text-[#0f172a] border border-[#e2eee7]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl border border-[#e2eee7] bg-white px-3 py-2 text-sm text-[#64748b]">
                Mengetik jawaban...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#e5efe9] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan..."
              className="flex-1 rounded-xl border border-[#d2e2d8] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f7a4f] text-white disabled:opacity-50"
              aria-label="Kirim pertanyaan"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
