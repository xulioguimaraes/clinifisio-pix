import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { buildNextAuthOption } from "../auth/[...nextauth].api";
const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const session = await getServerSession(
    request,
    response,
    buildNextAuthOption(request, response)
  );

  if (!session) {
    return response.status(401).end();
  }

  const { intervals } = timeIntervalsBodySchema.parse(request.body);

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_end_in_minutes: interval.endTimeInMinutes,
          time_start_in_minutes: interval.startTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    })
  );

  //   await prisma.userTimeIntervals.createMany

  return response.status(201).end();
}
