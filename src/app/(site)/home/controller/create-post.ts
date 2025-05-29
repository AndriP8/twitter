import { toast } from "sonner";

type CreatePost = {
  content: string;
  imageKey?: string;
};
export const createPost = async ({ content, imageKey }: CreatePost) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content,
      image_src: imageKey,
      author_id: "007d577d-c2a1-45ca-b685-8f8dfe641fca",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return toast.error(error.error);
  }

  return response.json();
};
