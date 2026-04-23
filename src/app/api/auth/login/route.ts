import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }
    const result = await login(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[login] crash:", e?.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
