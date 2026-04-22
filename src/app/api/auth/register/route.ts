import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";

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

  const emailEnabled = process.env.EMAIL_ENABLED === "true";

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name: name?.trim() || null,
      password: hash,
      // Auto-verify when email is disabled — no SMTP = no verification gate
      emailVerified: emailEnabled ? null : new Date(),
    },
  });

  // Create SocialProfile immediately
  await prisma.socialProfile.create({ data: { userId: user.id } });

  if (emailEnabled) {
    // Create verification token (valid 24h) and send email
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      ok: true,
      verified: false,
      message: "Compte créé ! Vérifiez votre email pour activer votre compte.",
    });
  }

  // Email disabled — account is immediately active
  console.log(`✅ Account created and auto-verified for ${email} (EMAIL_ENABLED=false)`);
  return NextResponse.json({
    ok: true,
    verified: true,
    message: "Compte créé ! Vous pouvez vous connecter.",
  });
}
