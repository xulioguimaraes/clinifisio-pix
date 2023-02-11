import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { buildNextAuthOption } from "../auth/[...nextauth].api";
const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "PUT") {
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

  const { bio } = updateProfileBodySchema.parse(request.body);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio },
  });
  //   await prisma.userTimeIntervals.createMany

  return response.status(204).end();
}
