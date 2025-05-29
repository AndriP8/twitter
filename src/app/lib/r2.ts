import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const PUBLIC_BUCKET_URL = process.env.R2_PUBLIC_URL || "";

// Generate a unique key for the image
export function generateImageKey(filename: string): string {
  const uniqueId = randomUUID();
  const extension = filename.split(".").pop();
  return `${uniqueId}.${extension}`;
}

// Get a presigned URL for uploading an image
export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    const publicUrl = `${PUBLIC_BUCKET_URL}/${key}`;

    return {
      presignedUrl,
      publicUrl,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

// Get a presigned URL for downloading an image
export async function getPresignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("Error generating presigned download URL:", error);
    throw error;
  }
}
