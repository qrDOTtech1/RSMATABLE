import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = body?.email as string | undefined;
    const password = body?.password as string | undefined;
    const name = body?.name as string | undefined;
    const email = rawEmail?.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit faire au moins 6 caractères." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    const hash = await bcrypt.hash(password, 12);

    let user;
    if (existing) {
      // User créé via MaTable-API (sans password) → on le complète au lieu de refuser
      const existingHash = (existing as any).password ?? (existing as any).passwordHash;
      if (existingHash) {
        return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
      }
      user = await prisma.user.update({
        where: { id: existing.id },
        data: { password: hash, name: existing.name ?? name?.trim() ?? null, emailVerified: new Date() },
      });
      console.log("[register] completed existing user:", email);
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: name?.trim() || null,
          password: hash,
          emailVerified: new Date(),
        },
      });
      console.log("[register] created user:", email);
    }

    await prisma.socialProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    return NextResponse.json({
      ok: true,
      verified: true,
      message: "Compte créé ! Vous pouvez vous connecter.",
    });
  } catch (e: any) {
    console.error("[register] crash:", e?.message, e);
    return NextResponse.json({ error: "Erreur serveur: " + (e?.message ?? "inconnue") }, { status: 500 });
  }
}
