"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Gagal mengirim");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-display font-semibold text-roast">AI Chat</h1>
        <p className="text-kopi-600 mt-1 text-sm">
          Tanya tentang data pelanggan, interest, atau promo (berdasarkan data yang ada)
        </p>
      </div>

      <div className="flex flex-col rounded-xl border border-kopi-200 bg-white shadow-sm overflow-hidden" style={{ minHeight: "400px" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-kopi-500 text-sm text-center py-8">
              Contoh: &quot;Ada berapa pelanggan?&quot;, &quot;Interest paling banyak apa?&quot;, &quot;Siapa yang suka oat milk?&quot;
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-kopi-600 text-white"
                    : "bg-kopi-100 text-roast"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-kopi-100 px-4 py-2 text-sm text-kopi-600">
                Mengetik...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {error && (
          <div className="px-4 py-2 bg-red-50 text-sm text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="border-t border-kopi-200 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang pelanggan atau promo..."
              className="flex-1 rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-sm text-roast placeholder-kopi-400 focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-kopi-600 px-4 py-2 text-sm font-medium text-white hover:bg-kopi-700 disabled:opacity-60"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
