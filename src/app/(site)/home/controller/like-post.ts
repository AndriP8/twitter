import { toast } from "sonner";

type LikePostParams = {
  post_id: string;
  user_id: string;
};

export async function likePost({ post_id, user_id }: LikePostParams) {
  const response = await fetch(`/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      post_id,
      user_id,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    toast.error(error.error);
    return;
  }
  const data = (await response.json()) as { data: string };
  return data;
}
