import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date not provided" });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvailability;

  const startHours = time_start_in_minutes / 60;
  const endHours = time_end_in_minutes / 60;

  const possibleTimes = Array.from({
    length: endHours - startHours,
  }).map((_, i) => startHours + i);

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      status: {
        not: 3,
      },
      date: {
        gte: referenceDate.set("hour", startHours).toDate(),
        lte: referenceDate.set("hour", endHours).toDate(),
      },
    },
  });

  // const availableTimes = possibleTimes.filter((time) => {
  //   const isTimeBlocked = blockedTimes.some(
  //     (blockedTime) => blockedTime.date.getHours() === time
  //   );

  //   const isTimeInPast = referenceDate.set("hour", time).isBefore(new Date());

  //   return !isTimeBlocked && !isTimeInPast;
  // });

  const availableTimes = blockedTimes.map((schedules: { date: any; }) => {
    return schedules.date;
  });

  return res.json({ possibleTimes, availableTimes });
}
