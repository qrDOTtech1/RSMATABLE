import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Le mot de passe doit faire au moins 6 caractères." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name: name?.trim() || null,
      password: hash,
      emailVerified: new Date(), // Immediate verification, no email confirmation needed
    },
  });

  // Create SocialProfile immediately
  await prisma.socialProfile.create({ data: { userId: user.id } });

  return NextResponse.json({
    ok: true,
    verified: true,
    message: "Compte créé ! Vous pouvez vous connecter.",
  });
}
