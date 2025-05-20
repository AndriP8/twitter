import { db } from "@/app/database/client";
import { userInsertSchema, usersTable } from "@/app/database/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as z.infer<
    typeof userInsertSchema
  >;

  if (!email || !password) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    return Response.json(
      { message: "Logged in successfully", token },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to login user", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
