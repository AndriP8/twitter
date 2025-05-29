export async function uploadImagePost(image: File) {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: image.name,
      contentType: image.type,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to upload image");
  }
  return response.json();
}
