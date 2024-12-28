import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";

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
      const { page = 1, per_page = 10, search = "" } = request.query;

      const pageInt = parseInt(page as string, 10);
      const limitInt = parseInt(per_page as string, 10);

      const skip = (pageInt - 1) * limitInt;
      const whereClause: any = {
        userId: session.user.id, // Filtro por ID do usuário
      };

      if (search) {
        whereClause.OR = [
          { description: { contains: search, mode: "insensitive" } }, // Exemplo de pesquisa por descrição
          { title: { contains: search, mode: "insensitive" } }, // Exemplo de pesquisa por título
        ];
      }

      const transactions = await prisma.transation.findMany({
        orderBy: {
          createdAt: "desc", // Ordena pela data de criação
        },
        where: whereClause,
        skip: skip, // Pula os registros anteriores para a página
        take: limitInt, // Limita o número de resultados por página
      });

      const totalTransactions = await prisma.transation.count({
        where: {
          userId: session.user.id,
        },
      });

      return response.status(200).json({
        data: transactions,
        total_pages: Math.ceil(totalTransactions / limitInt), // Total de páginas
        current_page: pageInt, // Página atual
        total: totalTransactions, // Total de itens
      });
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
