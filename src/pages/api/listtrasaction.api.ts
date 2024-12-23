import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../services/supabase";
import { prisma } from "@/lib/prisma";

export default async function get(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    try {
      const transactions = await prisma.transation.findMany({
        orderBy: {
          createdAt: "desc", // Certifique-se de ter uma coluna `created_at` no banco de dados
        },
        where: {
          userId: "52b14745-c4bb-4cc9-b520-5f4f449e0705",
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
