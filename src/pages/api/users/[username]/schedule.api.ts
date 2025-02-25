import { getGoogleOAuthToken } from "@/lib/google";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    phone: z.string().optional(),
    date: z.string().datetime(),
    id_service: z.string(),
  });

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const { name, email, observations, date, phone, id_service } =
    createSchedulingBody.parse(req.body);

  const schedulingDate = dayjs(date).startOf("hour");

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: "Date is in the past",
    });
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  });

  if (conflictingScheduling) {
    return res.status(400).json({
      message: "Há outro agendamento no mesmo horário",
    });
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
      phone,
      id_service,
    },
  });
  return res.status(201).json({ message: "Agendamento feito com sucesso" });

  // if (!!email) {
  //   const calendar = google.calendar({
  //     version: "v3",
  //     auth: await getGoogleOAuthToken(user.id!),
  //   });

  //   await calendar.events.insert({
  //     calendarId: "primary",
  //     conferenceDataVersion: 1,
  //     requestBody: {
  //       summary: `Call: ${name}`,
  //       description: observations,
  //       start: {
  //         dateTime: schedulingDate.format(),
  //       },
  //       end: {
  //         dateTime: schedulingDate.add(1, "hour").format(),
  //       },
  //       attendees: [
  //         {
  //           email,
  //           displayName: name,
  //         },
  //       ],
  //       conferenceData: {
  //         createRequest: {
  //           requestId: scheduling.id,
  //           conferenceSolutionKey: {
  //             type: "hangoutsMeet",
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
}
