import crypto from "node:crypto";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return res.status(500).json({
      error:
        "Admin login is not configured. Add ADMIN_EMAIL and ADMIN_PASSWORD in Vercel Settings → Environment Variables, then redeploy.",
    });
  }

  const suppliedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const wantedEmail = expectedEmail.trim().toLowerCase();
  const suppliedPassword = typeof password === "string" ? password : "";

  const emailOK = suppliedEmail === wantedEmail;
  const passwordOK =
    suppliedPassword.length === expectedPassword.length &&
    crypto.timingSafeEqual(
      Buffer.from(suppliedPassword),
      Buffer.from(expectedPassword)
    );

  if (!emailOK || !passwordOK) {
    return res.status(401).json({ error: "Email or password is incorrect." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  return res.status(200).json({
    ok: true,
    token,
    email: expectedEmail,
  });
}
