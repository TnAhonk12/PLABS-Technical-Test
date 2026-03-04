# Kopi Kita — Mini CRM

Mini CRM untuk Mimi (Kopi Kita): kelola pelanggan, generate ide promo pakai AI, dashboard, dan chatbot yang bisa jawab berdasarkan data.

## Fitur

- Login (demo: mimi@kopikita.com / demo123)
- Pelanggan: tambah / edit / hapus, cari nama, filter by interest tags
- Promo Ideas: AI generate 2–3 tema promo, segment, why now, pesan siap kirim (WA/SMS/IG)
- Dashboard: total pelanggan, top interests, kampanye minggu ini + tombol copy pesan
- AI Chat: tanya tentang data pelanggan & promo (berdasarkan data yang ada)
- Seed data untuk demo

## Tech

- Next.js 15 (App Router), TypeScript, Tailwind
- Prisma + PostgreSQL (Supabase / Neon)
- NextAuth (credentials + JWT)
- AI: OpenRouter / Groq / Google AI (lihat .env.example)

## Setup

1. Copy env: `cp .env.example .env`
2. Isi `.env`:
   - `NEXTAUTH_SECRET`: generate dengan `openssl rand -base64 32`
   - Untuk AI: salah satu `OPENROUTER_API_KEY`, `GROQ_API_KEY`, atau `GOOGLE_AI_API_KEY`; opsional `AI_PROVIDER=openrouter` (default) / `groq` / `google`
3. Database (Supabase):
   - Bikin project di supabase.com
   - Di dashboard: Project Settings → Database → Connection string
   - Pilih "URI", copy. Ganti `[YOUR-PASSWORD]` dengan password database yang lo set waktu bikin project
   - Untuk dev lokal bisa pakai "Session" (port 5432). Untuk deploy Vercel pakai "Transaction" (port 6543, pgbouncer)
   - Paste ke `.env` sebagai `DATABASE_URL`
4. Install & DB:
   - `npm install`
   - `npx prisma db push`
   - `npm run db:seed`
5. Jalankan: `npm run dev` → http://localhost:3000

## Deploy (Vercel / Netlify)

- Set env vars di dashboard (DATABASE_URL pakai Neon/Supabase kalau pakai Postgres).
- Untuk SQLite di serverless, Vercel/Netlify tidak persist file; gunakan Neon atau Supabase untuk production.

## Prompts

Semua prompt AI ada di folder `prompts/PROMPTS.md`.

