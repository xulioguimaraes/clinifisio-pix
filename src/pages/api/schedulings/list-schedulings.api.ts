import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "../auth/[...nextauth].api";
import dayjs from "dayjs";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method !== "GET") {
      return response.status(405).end();
    }
    const session = await getServerSession(
      request,
      response,
      buildNextAuthOption(request, response)
    );
    if (!session) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const search = String(request.query.search || ""); // Campo de busca
    const page = Number(request.query.page) || 1; // Página atual
    const perPage = Number(request.query.perPage) || 10; // Registros por página

    const user = session.user;

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    // Ajuste o filtro de busca, especificando o tipo correto para cada campo
    const filters: Prisma.SchedulingWhereInput = search
      ? {
          OR: [
            {
              name: { contains: search, mode: "insensitive" },
            },
            {
              email: { contains: search, mode: "insensitive" },
            },
            {
              phone: { contains: search, mode: "insensitive" },
            },
          ],
        }
      : {};

    const totalAgendamentos = await prisma.scheduling.count({
      where: {
        user_id: user.id,
        ...filters,
      },
    });

    const agendamentos = await prisma.scheduling.findMany({
      where: {
        user_id: user.id,
        ...filters,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        observations: true,
        date: true,
        status: true,
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            porcentagem: true,
          },
        },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return response.json({
      total: totalAgendamentos,
      page,
      perPage,
      totalPages: Math.ceil(totalAgendamentos / perPage),
      data: agendamentos.map(
        (item: {
          date: string | number | Date | dayjs.Dayjs | null | undefined;
        }) => ({
          ...item,
          date: dayjs(item.date).get("date"),
          hours: dayjs(item.date).get("hour"),
        })
      ),
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Internal server error", error });
  }
}
