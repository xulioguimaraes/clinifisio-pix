import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const username = String(req.query.username);
    const { startOfWeek } = req.query;

    if (!startOfWeek) {
      return res.status(400).json({ message: "Start of week not provided" });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const referenceDate = dayjs(String(startOfWeek));
    const weekDays = Array.from({ length: 7 }).map((_, i) =>
      referenceDate.startOf("week").add(i, "day")
    );

    // Array para armazenar todos os horários únicos
    const allAvailableTimes: number[] = [];

    const weekAvailability = await Promise.all(
      weekDays.map(async (day) => {
        // Busca os intervalos de horário cadastrados para o dia da semana
        const userAvailability = await prisma.userTimeInterval.findFirst({
          where: {
            user_id: user.id,
            week_day: day.get("day"),
          },
        });

        if (!userAvailability) {
          return { date: day.format("YYYY-MM-DD"), availableTimes: [] };
        }

        const { time_end_in_minutes, time_start_in_minutes } = userAvailability;
        const startHours = time_start_in_minutes / 60;
        const endHours = time_end_in_minutes / 60;

        // Retorna os horários cadastrados para o dia
        const availableTimes = Array.from({
          length: endHours - startHours,
        }).map((_, i) => {
          const hour = startHours + i;
          allAvailableTimes.push(hour); // Adiciona os horários ao array global
          return hour;
        });
        const scheduledServices = await prisma.scheduling.findMany({
          where: {
            user_id: user.id,
            date: {
              gte: day.startOf("day").toDate(),
              lte: day.endOf("day").toDate(),
            },
          },
          select: {
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
        });

        return {
          date: day.format("YYYY-MM-DD"),
          availableTimes,
          scheduledServices: scheduledServices.map((item) => ({
            ...item,
            date: dayjs(item.date).get("date"),
            hours: dayjs(item.date).get("hour"),
          })),
        };
      })
    );

    // Remover horários duplicados usando Set
    const uniqueAvailableTimes = Array.from(new Set(allAvailableTimes));

    return res.json({
      weekAvailability, // Retorna a disponibilidade por dia
      uniqueAvailableTimes: uniqueAvailableTimes, // Horários únicos para a semana
    });
  } catch (error) {
    return res.json({ message: error });
  }
}
