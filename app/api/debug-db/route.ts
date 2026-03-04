import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("key");
  if (secret !== process.env.DEBUG_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 404 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: "mimi@kopikita.com" },
      select: { id: true, email: true, name: true },
    });
    const userCount = await prisma.user.count();
    const customerCount = await prisma.customer.count();
    return NextResponse.json({
      ok: true,
      db: "connected",
      userExists: !!user,
      user: user ? { id: user.id, email: user.email, name: user.name } : null,
      userCount,
      customerCount,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({
      ok: false,
      db: "error",
      error: message,
    }, { status: 500 });
  }
}
