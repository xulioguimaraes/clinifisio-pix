import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { supabase } from "@/services/supabase";

const registerBodySchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  username: z.string().min(3, "Username must have at least 3 characters"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { name, email, password, username } = registerBodySchema.parse(
      req.body
    );

    // Check if user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 8);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }


    // Create user with only required fields
    const user = await prisma.user.create({
      data: {
        id: data.user?.id,
        name,
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,

        avatar_url: true,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });

      return res.status(500).json({
        message: "Database error",
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
