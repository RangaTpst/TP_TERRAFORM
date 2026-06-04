import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3, BUCKET_HOT } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET_HOT })
  );

  const files = (result.Contents ?? []).map((obj) => ({
    name: obj.Key,
    date: obj.LastModified,
    size: obj.Size,
  }));

  return NextResponse.json(files);
}
