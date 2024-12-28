import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../services/supabase";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "./auth/[...nextauth].api";

export default async function get(
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
  if (request.method === "GET") {
    try {
      const transactions = await prisma.transation.findMany({
        orderBy: {
          createdAt: "desc", // Certifique-se de ter uma coluna `created_at` no banco de dados
        },
        where: {
          userId: session.user.id,
        },
      });

      return response.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return response
        .status(500)
        .json({ error: "Error fetching transactions" });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
