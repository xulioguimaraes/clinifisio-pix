import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";

import formidable from "formidable";
import fs from "fs/promises";
import { supabase } from "@/services/supabase";

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão para usar formidable
  },
};

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
      // Processar o FormData
      const form = formidable({ multiples: true });
      const [fields, files] = await form.parse(request);

      // Extrair campos do formulário
      const { name, price, description, porcentagem, active } = fields;

      if (!name?.[0] || !price?.[0]) {
        return response.status(400).json({
          error: "Missing required fields: name, price",
        });
      }

      // Processar upload das imagens
      const imageUrls = await Promise.all(
        Array.isArray(files.images)
          ? files.images.map(async (image) => {
              const filePath = image.filepath;
              const fileBuffer = await fs.readFile(filePath);
              const fileName = `services/${session.user.id}-${Date.now()}-${
                image.originalFilename
              }`;

              const { error } = await supabase.storage
                .from("services")
                .upload(fileName, fileBuffer, {
                  cacheControl: "3600",
                  upsert: true,
                  contentType: image.mimetype!,
                });

              if (error) throw error;

              const { data: publicUrlData } = supabase.storage
                .from("services")
                .getPublicUrl(fileName);

              return publicUrlData.publicUrl;
            })
          : []
      );

      // Criar serviço no Prisma
      await prisma.service.create({
        data: {
          userId: session.user.id,
          name: String(name[0]),
          description: description?.[0],
          price: Number(price[0]),
          porcentagem: porcentagem?.[0] ? Number(porcentagem[0]) : 0,
          active: active?.[0] === "1" || active?.[0] === "true",
          images: imageUrls, // Array de URLs das imagens
        },
      });

      return response
        .status(201)
        .json({ message: "Service created successfully" });
    } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "Unexpected server error." });
    }
  }

  return response.status(405).json({ error: "Method not allowed. Use POST." });
}
