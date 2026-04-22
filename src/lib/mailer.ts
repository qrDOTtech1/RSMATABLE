import nodemailer from "nodemailer";

let cachedTransporter: any = null;
let transporterCheckDone = false;

export function getTransporter() {
  // Memoize the transporter check
  if (transporterCheckDone) {
    return cachedTransporter;
  }

  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  const port = parseInt(process.env.EMAIL_SERVER_PORT ?? "587");

  // Require ALL three: host, user, pass
  if (!host || !user || !pass) {
    transporterCheckDone = true;
    cachedTransporter = null;
    return null;
  }

  transporterCheckDone = true;
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 5000,
    socketTimeout: 5000,
  });

  return cachedTransporter;
}

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const link = `${baseUrl}/api/auth/verify-email?token=${token}`;

  const transporter = getTransporter();

  // If no SMTP configured, log a warning but don't crash
  if (!transporter) {
    console.warn(
      "⚠️  Email not sent: EMAIL_SERVER_HOST, EMAIL_SERVER_USER, or EMAIL_SERVER_PASSWORD not configured.",
      `\nVerification link for ${email}:\n${link}`
    );
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? "noreply@matable.app",
      to: email,
      subject: "Confirmez votre adresse — Ma Table RS",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:16px;">
          <h1 style="font-size:24px;font-weight:900;margin-bottom:8px;">
            MA <span style="color:#f97316">TABLE</span> RS
          </h1>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:32px;">Le Réseau Social Culinaire</p>
          <h2 style="font-size:20px;margin-bottom:16px;">Confirmez votre email</h2>
          <p style="color:#d1d5db;font-size:15px;line-height:1.6;margin-bottom:32px;">
            Cliquez sur le bouton ci-dessous pour activer votre compte.
            Ce lien est valide <strong>24 heures</strong>.
          </p>
          <a href="${link}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:900;font-size:15px;">
            Confirmer mon email →
          </a>
          <p style="color:#4b5563;font-size:12px;margin-top:32px;">
            Si vous n'avez pas créé de compte, ignorez cet email.<br/>
            Lien: ${link}
          </p>
        </div>
      `,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email send error:", error);
    // Don't throw - allow registration to proceed even if email fails
  }
}
