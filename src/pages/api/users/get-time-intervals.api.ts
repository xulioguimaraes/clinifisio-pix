import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "../auth/[...nextauth].api";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    return response
      .status(405)
      .json({ error: "Use POST for creating intervals." });
  }

  if (request.method !== "GET") {
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

  try {
    const intervals = await prisma.userTimeInterval.findMany({
      where: {
        user_id: session.user?.id,
      },
      select: {
        week_day: true,
        time_start_in_minutes: true,
        time_end_in_minutes: true,
      },
      orderBy: {
        week_day: "asc",
      },
    });

    return response.status(200).json(intervals);
  } catch (error) {
    console.error("Error fetching time intervals:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
}
