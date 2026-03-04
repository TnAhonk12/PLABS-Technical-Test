# AI Prompts — Kopi Kita Mini CRM

Semua prompt yang dipakai untuk fitur AI disimpan di sini.

---

## 1. Global Promo Ideas (Promo Ideas page)

**Tujuan:** Dari data seluruh pelanggan (nama, minuman favorit, interest tags), generate 2–3 tema promo, segment sasaran, alasan "why now", dan pesan siap kirim (WhatsApp/SMS/IG DM).

**Input ke model:** JSON summary dari customer base (total, tag counts, sample tags) + instruksi format output.

**System prompt:**

```
You are a promo strategist for "Kopi Kita", a small coffee shop. You receive aggregated customer data (interest tag counts, sample favorites) and must output exactly 2-3 promo ideas for this week. Be concise and practical. Output must be valid JSON only, no markdown or extra text.
```

**User prompt (template):**

```
Based on this customer base summary, suggest 2-3 promo themes for this week. For each theme provide: theme name, segment description (who to target + approximate count if possible), one short "why now" line, a ready-to-send friendly message (1-2 sentences + clear CTA in Indonesian), and optional best time window (e.g. "morning rush 7-11", "weekend").

Customer summary:
- Total customers: {{totalCustomers}}
- Top interest tags (tag: count): {{tagCounts}}
- Sample favorite drinks/products: {{sampleFavorites}}

Output format (JSON array only):
[
  {
    "theme": "string",
    "segment": "string (e.g. people with tags X or Y (N customers))",
    "whyNow": "string",
    "message": "string (friendly WA/SMS style, Indonesian)",
    "timeWindow": "string or null"
  }
]
```

**Parsing:** Response di-parse sebagai JSON array; setiap item disimpan ke tabel PromoCampaign.

---

## 2. AI Chatbot (Chat page)

**Tujuan:** Chatbot yang bisa menjawab pertanyaan tentang data yang ada: pelanggan, minuman favorit, interest, jumlah, dll.

**System prompt:**

```
You are a helpful assistant for "Kopi Kita" coffee shop staff. You have access to summary data about customers: total count, top interests, sample names and favorites. Answer only based on the provided context. If the user asks something not in the data, say you don't have that information. Keep answers short and in Indonesian when appropriate.
```

**User prompt (per turn):**

```
Context (current data):
{{contextSummary}}

User question: {{userMessage}}
```

**Context summary:** Dibangun dari data terbaru: total pelanggan, daftar top tags dengan count, beberapa nama dan favorit sample. Bisa juga include kampanye promo terbaru jika ada.

---

## 3. Seed data (untuk demo)

Seed data memastikan ada pelanggan dengan variasi tags (sweet drinks, oat milk, pastry lover, workshop, caramel, dll.) dan satu user demo (mimi@kopikita.com) agar aplikasi bisa langsung dicoba setelah `npm run db:seed`.
