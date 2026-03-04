import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  favoriteDrink: z.string().optional(),
  interestTags: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const tag = searchParams.get("tag")?.trim()?.toLowerCase() || "";

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  let filtered = customers;
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        (c.contact && c.contact.toLowerCase().includes(lower)) ||
        (c.favoriteDrink && c.favoriteDrink.toLowerCase().includes(lower)) ||
        c.interestTags.toLowerCase().includes(lower)
    );
  }
  if (tag) {
    const tags = tag.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    filtered = filtered.filter((c) => {
      const customerTags = c.interestTags.split(",").map((t) => t.trim().toLowerCase());
      return tags.some((t) => customerTags.includes(t));
    });
  }

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      contact: data.contact ?? null,
      favoriteDrink: data.favoriteDrink ?? null,
      interestTags: data.interestTags ?? "",
    },
  });
  return NextResponse.json(customer);
}
