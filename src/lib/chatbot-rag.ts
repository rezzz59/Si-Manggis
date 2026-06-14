import { CHATBOT_KB, KBItem } from "@/src/data/chatbot-kb";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function scoreItem(query: string, item: KBItem): number {
  const q = normalize(query);
  if (!q) return 0;

  const tokens = q.split(" ").filter(Boolean);
  const haystack = normalize(`${item.title} ${item.content} ${item.tags.join(" ")}`);

  let score = 0;

  for (const token of tokens) {
    if (item.tags.some((tag) => normalize(tag).includes(token))) score += 4;
    if (normalize(item.title).includes(token)) score += 3;
    if (haystack.includes(token)) score += 1;
  }

  if (haystack.includes(q)) score += 6;
  return score;
}

export function retrieveKB(query: string, topK = 3): KBItem[] {
  const ranked = CHATBOT_KB.map((item) => ({ item, score: scoreItem(query, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((entry) => entry.item);

  return ranked;
}

function buildGreetingAnswer(query: string): string | null {
  const q = normalize(query);
  const greetingMap: Record<string, string> = {
    halo: "Halo 👋 Saya asisten SI-MANGGIS. Saya siap bantu informasi layanan, pengaduan, cek tiket, profil, kontak, artikel, dan darurat.",
    hai: "Hai 👋 Saya asisten SI-MANGGIS. Ada yang ingin ditanyakan soal layanan di website ini?",
    hello: "Hello 👋 Saya asisten SI-MANGGIS. Silakan tanya kebutuhan layanan warga ya.",
    hi: "Hi 👋 Saya asisten SI-MANGGIS. Saya siap bantu informasi website ini.",
    "selamat pagi":
      "Selamat pagi 👋 Saya asisten SI-MANGGIS. Semoga harinya lancar, ada yang bisa saya bantu terkait layanan kelurahan?",
    "selamat siang":
      "Selamat siang 👋 Saya asisten SI-MANGGIS. Saya siap bantu info layanan, pengaduan, dan cek tiket.",
    "selamat sore":
      "Selamat sore 👋 Saya asisten SI-MANGGIS. Silakan tanya informasi yang Anda butuhkan.",
    "selamat malam":
      "Selamat malam 👋 Saya asisten SI-MANGGIS. Tetap semangat, saya siap bantu informasi website ini.",
    pagi: "Pagi 👋 Saya asisten SI-MANGGIS. Ada yang bisa saya bantu hari ini?",
    siang: "Siang 👋 Saya asisten SI-MANGGIS. Silakan tanyakan kebutuhan Anda.",
    sore: "Sore 👋 Saya asisten SI-MANGGIS. Saya siap bantu informasi layanan warga.",
    malam: "Malam 👋 Saya asisten SI-MANGGIS. Ada yang ingin Anda cek di website ini?",
  };

  return greetingMap[q] ?? null;
}

export function buildAnswer(query: string): { answer: string; sources: KBItem[] } {
  const greetingAnswer = buildGreetingAnswer(query);
  if (greetingAnswer) {
    return {
      answer: greetingAnswer,
      sources: [],
    };
  }

  const sources = retrieveKB(query, 3);

  if (sources.length === 0) {
    return {
      answer:
        "Maaf, saya belum menemukan informasi tersebut di basis pengetahuan website ini. Silakan hubungi petugas melalui halaman /kontak atau kirim detail kebutuhan Anda di /pengaduan.",
      sources: [],
    };
  }

  const primary = sources[0];
  const normalizedLink =
    primary.link === "/" ? "Beranda" : primary.link ? primary.link : "";

  const lines = [
    `Berdasarkan informasi website, ${primary.content}`,
    normalizedLink ? `Anda bisa lanjut di: ${normalizedLink}` : "",
  ].filter(Boolean);

  return {
    answer: lines.join("\n"),
    sources,
  };
}
