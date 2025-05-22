import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
      const {
        page = 1,
        per_page = 10,
        search = "",
        startDate,
        endDate,
        type,
      } = request.query;

      const pageInt = parseInt(page as string, 10);
      const limitInt = parseInt(per_page as string, 10);

      const skip = (pageInt - 1) * limitInt;
      const whereClause: any = {
        userId: session.user.id,
      };

      // Adiciona filtro por data se fornecido
      if (startDate && endDate) {
        // Ajusta as datas para considerar o dia inteiro em UTC
        const start = dayjs(startDate as string).utc().startOf('day').toDate();
        const end = dayjs(endDate as string).utc().endOf('day').toDate();

        whereClause.createdAt = {
          gte: start,
          lte: end,
        };
      }

      // Adiciona filtro por tipo (entrada/saída) se fornecido
      if (type !== undefined) {
        whereClause.type = type === "true";
      }

      if (search) {
        whereClause.OR = [
          { description: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
        ];
      }

      const transactions = await prisma.transation.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: whereClause,
        skip: skip,
        take: limitInt,
      });

      const totalTransactions = await prisma.transation.count({
        where: whereClause,
      });

      // Calcula o resumo se houver filtro de data
      let summary = null;
      if (startDate) {
        const summaryWhere = {
          userId: session.user.id,
          createdAt: whereClause.createdAt,
        };

        const [totalIncomes, totalExpenses] = await Promise.all([
          prisma.transation.aggregate({
            where: { ...summaryWhere, type: true },
            _sum: { price: true },
          }),
          prisma.transation.aggregate({
            where: { ...summaryWhere, type: false },
            _sum: { price: true },
          }),
        ]);

        const totalIncomesValue = totalIncomes._sum.price || 0;
        const totalExpensesValue = totalExpenses._sum.price || 0;
        const totalBalance = totalIncomesValue - totalExpensesValue;

        const formatDate = (date: string) => {
          return dayjs(date).utc().format('DD/MM/YYYY');
        };

        const dateRange = endDate 
          ? `de ${formatDate(startDate as string)} até ${formatDate(endDate as string)}`
          : `do dia ${formatDate(startDate as string)}`;

        summary = {
          incomes: {
            label: `Total de entradas:`,
            value: totalIncomesValue,
          },
          expenses: {
            label: `Total de saídas:`,
            value: totalExpensesValue,
          },
          balance: {
            label: `Total em caixa:`,
            value: totalBalance,
          },
        };
      }

      return response.status(200).json({
        data: transactions,
        total_pages: Math.ceil(totalTransactions / limitInt),
        current_page: pageInt,
        total: totalTransactions,
        summary,
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
