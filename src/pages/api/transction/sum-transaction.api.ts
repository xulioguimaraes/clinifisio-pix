import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";
import dayjs from "dayjs";

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

  if (request.method === "GET") {
    try {
      const thirtyDaysAgo = dayjs().subtract(30, "days").toDate();

      const { _sum: sumIncomes } = await prisma.transation.aggregate({
        _sum: {
          price: true,
        },
        where: {
          userId: session.user.id,
          type: true,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      const { _sum: sumExpenses } = await prisma.transation.aggregate({
        _sum: {
          price: true,
        },
        where: {
          userId: session.user.id,
          type: false,
        },
      });

      // Busca a última transação com type = true (entrada)
      const lastTransactionTrue = await prisma.transation.findFirst({
        where: {
          userId: session.user.id,
          type: true,
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Busca a última transação com type = false (saída)
      const lastTransactionFalse = await prisma.transation.findFirst({
        where: {
          userId: session.user.id,
          type: false,
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return response.status(200).json({
        total_incomes: sumIncomes.price || 0, // Soma das entradas
        date_last_incomes: lastTransactionTrue?.createdAt,
        total_expenses: sumExpenses.price || 0, // Soma das saídas
        date_last_expenses: lastTransactionFalse?.createdAt,
      });
    } catch (error) {
      console.error("Error fetching transaction sums:", error);
      return response
        .status(500)
        .json({ error: "Error fetching transaction sums" });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
