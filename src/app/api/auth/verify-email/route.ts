import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", req.url));
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/login?error=expired-token", req.url));
  }

  // Mark email as verified
  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  // Delete token
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
