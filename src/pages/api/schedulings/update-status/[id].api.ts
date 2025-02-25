import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "../../auth/[...nextauth].api";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method !== "PATCH") {
      return response.status(405).json({ message: "Method Not Allowed" });
    }

    const session = await getServerSession(
      request,
      response,
      buildNextAuthOption(request, response)
    );

    if (!session) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const { id } = request.query; // ID vindo da URL
    const { status } = request.body; // Novo status enviado no body

    if (!id || typeof status !== "number") {
      return response.status(400).json({ message: "Invalid request data" });
    }

    const updatedScheduling = await prisma.scheduling.update({
      where: { id: String(id) },
      data: { status },
    });

    return response.json({
      message: "Status atualizado com sucesso",
      data: updatedScheduling,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Internal server error", error });
  }
}
