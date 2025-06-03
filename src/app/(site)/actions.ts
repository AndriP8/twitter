"use server";

import { cookies } from "next/headers";
import { userLoginSchema } from "../database/schema";

export async function loginUser(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies();
  const body = userLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    age: formData.get("age"),
  });

  if (!body.success) {
    return {
      error: body.error.flatten().fieldErrors,
    };
  }

  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body.data),
  });

  const data = await response.json();
  cookieStore.set("token", data.token);
  return data;
}
