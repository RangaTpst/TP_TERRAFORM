import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_HOT } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function DELETE() {
  const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET_HOT }));
  const objects = list.Contents ?? [];

  if (objects.length === 0) {
    return NextResponse.json({ message: "Bucket déjà vide" });
  }

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET_HOT,
      Delete: { Objects: objects.map((o) => ({ Key: o.Key! })) },
    })
  );

  return NextResponse.json({ deleted: objects.length });
}
