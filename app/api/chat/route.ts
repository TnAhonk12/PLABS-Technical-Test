import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chat } from "@/lib/ai";

function getTagCounts(customers: { interestTags: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of customers) {
    const tags = c.interestTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    for (const t of tags) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return counts;
}

function buildContext(customers: { name: string; favoriteDrink: string | null; interestTags: string }[], campaigns: { theme: string; segment: string; message: string }[]): string {
  const total = customers.length;
  const tagCounts = getTagCounts(customers);
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([t, n]) => `${t}: ${n}`)
    .join(", ");
  const sampleNames = customers.slice(0, 10).map((c) => c.name).join(", ");
  const sampleFavorites = [...new Set(customers.map((c) => c.favoriteDrink).filter(Boolean))]
    .slice(0, 15)
    .join(", ");
  const campaignSummary = campaigns
    .slice(0, 5)
    .map((c) => `Theme: ${c.theme}. Segment: ${c.segment}. Message: ${c.message}`)
    .join("\n");

  return [
    `Total pelanggan: ${total}.`,
    `Top interest tags (tag: count): ${topTags || "belum ada"}.`,
    `Sample nama: ${sampleNames || "belum ada"}.`,
    `Sample minuman/produk favorit: ${sampleFavorites || "belum ada"}.`,
    campaignSummary ? `Kampanye promo terbaru:\n${campaignSummary}` : "Belum ada kampanye promo.",
  ].join("\n");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const userMessage = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!userMessage) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const [customers, campaigns] = await Promise.all([
    prisma.customer.findMany({
      select: { name: true, favoriteDrink: true, interestTags: true },
    }),
    prisma.promoCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { theme: true, segment: true, message: true },
    }),
  ]);

  const contextSummary = buildContext(customers, campaigns);

  const systemPrompt = `You are a helpful assistant for "Kopi Kita" coffee shop staff. You have access to summary data about customers: total count, top interests, sample names and favorites, and recent promo campaigns. Answer only based on the provided context. If the user asks something not in the data, say you don't have that information. Keep answers short and in Indonesian when appropriate.`;

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Context (current data):\n${contextSummary}\n\nUser question: ${userMessage}`,
    },
  ];

  if (history.length > 0) {
    const historyMessages = history.slice(-6).map((h: { role: string; content: string }) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    }));
    messages.splice(1, 0, ...historyMessages);
  }

  try {
    const reply = await chat(messages, { maxTokens: 512 });
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal memproses chat" },
      { status: 500 }
    );
  }
}
