import { ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_HOT, BUCKET_COLD } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function POST() {
  const result = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET_COLD, Prefix: "files/" })
  );

  const objects = result.Contents ?? [];

  if (objects.length === 0) {
    return NextResponse.json({ message: "Bucket froid vide, rien à restaurer." });
  }

  await Promise.all(
    objects.map((obj) =>
      s3.send(
        new CopyObjectCommand({
          Bucket: BUCKET_HOT,
          CopySource: `${BUCKET_COLD}/${obj.Key}`,
          Key: obj.Key!.replace("files/", ""),
        })
      )
    )
  );

  return NextResponse.json({ restored: objects.length });
}
