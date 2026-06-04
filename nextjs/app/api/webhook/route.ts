import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { exec } from "child_process";
import { join } from "path";

export async function POST(request: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "WEBHOOK_SECRET non configuré" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  const expected = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  if (!payload.ref?.includes("master") && !payload.ref?.includes("main")) {
    return NextResponse.json({ message: "Branche ignorée" });
  }

  const deployScript = join(process.cwd(), "..", "gitops", "deploy.sh");
  exec(`sh "${deployScript}"`, (err, stdout, stderr) => {
    if (err) console.error("Deploy error:", stderr);
    else console.log("Deploy output:", stdout);
  });

  return NextResponse.json({ message: "Déploiement lancé" });
}
