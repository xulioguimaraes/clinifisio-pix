import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(
    request,
    response,
    buildNextAuthOption(request, response)
  );

  if (!session) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (request.method === "GET") {
      // Busca o usuário e inclui as relações
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      return response.status(200).json(user);
    }

    return response.status(405).json({ error: "Method not allowed. Use GET." });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Unexpected server error." });
  }
}
