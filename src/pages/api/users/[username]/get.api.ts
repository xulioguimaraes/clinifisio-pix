import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username inválido" });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      bio: true,
      avatar_url: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.status(200).json(user);
}
