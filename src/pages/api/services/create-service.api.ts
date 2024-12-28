import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";

export default async function handler(
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
  if (request.method === "POST") {
    try {
      const { name, price, description, porcentagem } = request.body;

      if (!name || price == null) {
        return response.status(400).json({
          error: "Missing required fields: name, price",
        });
      }

      await prisma.service.create({
        data: {
          userId: session.user.id,
          name: String(name),
          description: description,
          price: 150.0,
          porcentagem: porcentagem,
        },
      });

      return response.status(201).json({});
    } catch (err) {
      console.log(err);
      return response.status(500).json({ error: "Unexpected server error." });
    }
  }

  return response.status(405).json({ error: "Method not allowed. Use POST." });
}
