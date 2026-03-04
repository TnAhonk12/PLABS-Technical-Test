import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePromoIdeas } from "@/lib/promo";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const campaigns = await prisma.promoCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(campaigns);
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({
    select: { name: true, favoriteDrink: true, interestTags: true },
  });

  if (customers.length === 0) {
    return NextResponse.json(
      { error: "Tambah pelanggan dulu agar bisa generate promo ideas." },
      { status: 400 }
    );
  }

  try {
    const ideas = await generatePromoIdeas(customers);
    const created = await prisma.$transaction(
      ideas.map((idea) =>
        prisma.promoCampaign.create({
          data: {
            theme: idea.theme,
            segment: idea.segment,
            whyNow: idea.whyNow,
            message: idea.message,
            timeWindow: idea.timeWindow,
            customerCount: idea.customerCount,
          },
        })
      )
    );
    return NextResponse.json(created);
  } catch (e) {
    console.error("Promo generation error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal generate promo" },
      { status: 500 }
    );
  }
}
