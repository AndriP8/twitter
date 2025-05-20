import { db } from "@/app/database/client";
import { usersTable, userInsertSchema } from "@/app/database/schema";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const { name, email, password } = (await req.json()) as z.infer<
    typeof userInsertSchema
  >;

  if (!name || !email || !password) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: "User registered successfully", data: "OK" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to register user", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
