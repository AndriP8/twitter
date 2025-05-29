"use client";

import { useActionState, useCallback, useState } from "react";
import Image from "next/image";
import sanitize from "sanitize-html";
import { createPostAction } from "../action";

export default function FeedComposer() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [, formAction, isPending] = useActionState(
    () => createPostAction("", { content, image }),
    null,
  );

  const onContentBlur = useCallback(
    (evt: React.FocusEvent<HTMLDivElement>) =>
      setContent(
        sanitize(evt.currentTarget.innerHTML, {
          allowedTags: ["b", "i", "a", "p", "br"],
          allowedAttributes: { a: ["href"] },
        }),
      ),
    [],
  );

  const onChangeImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearPost = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
      <form
        action={() => {
          formAction();
          clearPost();
        }}
        className="space-y-4"
      >
        <div>
          <div
            className="flex items-center mb-4"
            contentEditable
            onBlur={onContentBlur}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="flex items-center justify-center">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Image preview"
                width={200}
                height={200}
                objectFit="contain"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <label
            className="cursor-pointer p-1 border rounded-full"
            htmlFor="image"
          >
            <svg
              width="1rem"
              height="1rem"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                fill="#ffffff"
              />
              <path
                d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm16 0H5v7.92l3.375-2.7a1 1 0 0 1 1.25 0l4.3 3.44 1.368-1.367a1 1 0 0 1 1.414 0L19 14.586V5zM5 19h14v-1.586l-3-3-1.293 1.293a1 1 0 0 1-1.332.074L9 12.28l-4 3.2V19z"
                fill="#ffffff"
              />
            </svg>
          </label>
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={onChangeImage}
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 disabled:cursor-none disabled:opacity-50 text-white rounded-full px-4 py-2 mt-2"
          >
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
}
