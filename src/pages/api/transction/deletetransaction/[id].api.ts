import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";

const prisma = new PrismaClient();

export default async function handle(
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

  const { id } = request.query;

  if (!id || typeof id !== "string") {
    return response
      .status(400)
      .json({ error: "Invalid or missing ID parameter" });
  }

  const userId = session.user.id;

  if (request.method === "DELETE") {
    try {
      const transaction = await prisma.transation.findFirst({
        where: {
          id: parseInt(id, 10),
          userId: userId,
        },
      });

      if (!transaction) {
        return response
          .status(404)
          .json({ error: "Record not found or unauthorized" });
      }

      await prisma.transation.delete({
        where: { id: transaction.id },
      });

      return response.status(200).send({ message: "Successfully deleted" });
    } catch (error) {
      console.error(error);

      return response.status(500).json({ error: "Error deleting record" });
    } finally {
      await prisma.$disconnect();
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
