const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions";
const GOOGLE_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

type Message = { role: "system" | "user" | "assistant"; content: string };

export async function chat(messages: Message[], options?: { maxTokens?: number }): Promise<string> {
  const provider = process.env.AI_PROVIDER || "openrouter";
  const maxTokens = options?.maxTokens ?? 1024;

  if (provider === "groq" && process.env.GROQ_API_KEY) {
    const res = await fetch(GROQ_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        max_tokens: maxTokens,
      }),
    });
    if (!res.ok) throw new Error(`Groq: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }

  if (provider === "google" && process.env.GOOGLE_AI_API_KEY) {
    const parts = messages.map((m) => ({ text: `${m.role}: ${m.content}` }));
    const res = await fetch(`${GOOGLE_BASE}?key=${process.env.GOOGLE_AI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: parts.map((p) => p.text).join("\n\n") }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    });
    if (!res.ok) throw new Error(`Google AI: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  }

  if (process.env.OPENROUTER_API_KEY) {
    const res = await fetch(OPENROUTER_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        max_tokens: maxTokens,
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }

  throw new Error("No AI provider configured. Set OPENROUTER_API_KEY, GROQ_API_KEY, or GOOGLE_AI_API_KEY.");
}
