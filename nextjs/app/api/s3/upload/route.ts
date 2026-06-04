import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_HOT } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_HOT,
      Key: file.name,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return NextResponse.json({ name: file.name, size: file.size });
}
