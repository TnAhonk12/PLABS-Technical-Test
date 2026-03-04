import { chat } from "./ai";

export type PromoIdea = {
  theme: string;
  segment: string;
  whyNow: string;
  message: string;
  timeWindow: string | null;
  customerCount?: number;
};

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

function formatTagCounts(counts: Record<string, number>): string {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag, n]) => `${tag}: ${n}`)
    .join(", ");
}

export async function generatePromoIdeas(
  customers: { name: string; favoriteDrink: string | null; interestTags: string }[]
): Promise<PromoIdea[]> {
  const total = customers.length;
  const tagCounts = getTagCounts(customers);
  const tagCountsStr = formatTagCounts(tagCounts);
  const sampleFavorites = [...new Set(customers.map((c) => c.favoriteDrink).filter(Boolean))]
    .slice(0, 20)
    .join(", ");

  const systemPrompt = `You are a promo strategist for "Kopi Kita", a small coffee shop. You receive aggregated customer data (interest tag counts, sample favorites) and must output exactly 2-3 promo ideas for this week. Be concise and practical. Output must be valid JSON only, no markdown, no code fences, no extra text — just a single JSON array.`;

  const userPrompt = `Based on this customer base summary, suggest 2-3 promo themes for this week. For each theme provide: theme name, segment description (who to target + approximate count if possible), one short "why now" line, a ready-to-send friendly message (1-2 sentences + clear CTA in Indonesian), and optional best time window (e.g. "morning rush 7-11", "weekend").

Customer summary:
- Total customers: ${total}
- Top interest tags (tag: count): ${tagCountsStr}
- Sample favorite drinks/products: ${sampleFavorites || "none yet"}

Output format (JSON array only, no other text):
[
  {"theme": "string", "segment": "string", "whyNow": "string", "message": "string", "timeWindow": "string or null"}
]`;

  const raw = await chat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { maxTokens: 1500 }
  );

  const cleaned = raw.replace(/```json?\s*|\s*```/g, "").trim();
  let arr: unknown[];
  try {
    arr = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]") + 1;
    if (start >= 0 && end > start) {
      arr = JSON.parse(cleaned.slice(start, end));
    } else {
      throw new Error("AI did not return valid JSON");
    }
  }
  if (!Array.isArray(arr)) throw new Error("AI did not return an array");

  const segmentCounts = new Map<string, number>();
  for (const [tag] of Object.entries(tagCounts)) {
    segmentCounts.set(tag, tagCounts[tag]);
  }

  return arr.slice(0, 3).map((item: unknown) => {
    const o = item as Record<string, unknown>;
    const segment = String(o.segment ?? "");
    const theme = String(o.theme ?? "");
    const whyNow = String(o.whyNow ?? "");
    const message = String(o.message ?? "");
    let timeWindow: string | null = null;
    if (o.timeWindow != null && o.timeWindow !== "") {
      timeWindow = String(o.timeWindow);
    }
    const match = segment.match(/(\d+)\s*customers?/i);
    const customerCount = match ? parseInt(match[1], 10) : null;
    return {
      theme,
      segment,
      whyNow,
      message,
      timeWindow,
      customerCount: customerCount ?? undefined,
    };
  });
}
