import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const { name, username, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password,
    },
  });

  setCookie({ res }, "@call:userId", user.id, {
    maxAge: 60 * 60 * 40 * 7, // 7 dias
    path: "/",
  });
  return res.status(201).json(user);
}
