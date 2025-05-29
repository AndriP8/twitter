import { NextRequest, NextResponse } from "next/server";
import { generateImageKey, getPresignedUploadUrl } from "@/app/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and content type are required" },
        { status: 400 },
      );
    }

    // Generate a unique key for the image
    const imageKey = generateImageKey(filename);

    // Get a presigned URL for uploading the image
    const { presignedUrl, publicUrl } = await getPresignedUploadUrl(
      imageKey,
      contentType,
    );

    return NextResponse.json(
      {
        imageKey,
        presignedUrl,
        publicUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
