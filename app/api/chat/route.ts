import { NextRequest, NextResponse } from "next/server";
import { buildAnswer, retrieveKB } from "@/src/lib/chatbot-rag";

type ChatRequestBody = {
  message?: string;
};

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GroqChoice = {
  message?: {
    content?: string;
  };
};

type GroqResponse = {
  choices?: GroqChoice[];
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

async function generateWithGroq(message: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const contexts = retrieveKB(message, 4);
  if (contexts.length === 0) return null;

  const contextBlock = contexts
    .map(
      (item, idx) =>
        `[Sumber ${idx + 1}] ${item.title}\n${item.content}\nLink: ${item.link ?? "-"}`
    )
    .join("\n\n");

  const systemPrompt =
    "Anda adalah asisten website SI-MANGGIS. Jawab HANYA berdasarkan konteks yang diberikan. " +
    "Jika konteks tidak cukup, katakan tidak ditemukan di website dan arahkan ke /kontak atau /pengaduan. " +
    "Gunakan bahasa Indonesia yang ringkas, jelas, dan ramah.";

  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Pertanyaan pengguna:\n${message}\n\nKonteks website:\n${contextBlock}`,
    },
  ];

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GroqResponse;
  const content = data?.choices?.[0]?.message?.content?.trim();
  return content || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const message = body?.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const fallback = buildAnswer(message);
    const groqAnswer = await generateWithGroq(message);

    return NextResponse.json({
      answer: groqAnswer ?? fallback.answer,
      provider: groqAnswer ? "groq" : "local-rag",
      sources: fallback.sources.map((s) => ({
        id: s.id,
        title: s.title,
        link: s.link ?? null,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses chat." },
      { status: 500 }
    );
  }
}
