import { toast } from "sonner";
import { uploadImagePost } from "./controller/upload-image-post";
import { createPost } from "./controller/create-post";

export const createPostAction = async (
  _prevState: unknown,
  data: { content: string; image: File | null },
) => {
  if (!data.content.trim()) {
    toast("Content cannot be empty");
    return;
  }
  let key = null;
  if (data.image) {
    const uploadResponse = await uploadImagePost(data.image);
    const { presignedUrl, publicUrl, imageKey } = uploadResponse;

    const putResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: data.image,
    });

    if (putResponse.ok) {
      console.log("File uploaded successfully to:", publicUrl);
      key = imageKey;
    } else {
      toast.error("Failed to upload image");
    }
  }

  const response = await createPost({ content: data.content, imageKey: key });
  toast.success("Post created successfully");
  return response;
};
