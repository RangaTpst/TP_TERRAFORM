import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT ?? "http://localhost:4566",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "test",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "test",
  },
});

export const BUCKET_HOT = process.env.S3_BUCKET_HOT ?? "bucket-hot";
export const BUCKET_COLD = process.env.S3_BUCKET_COLD ?? "bucket-cold";
