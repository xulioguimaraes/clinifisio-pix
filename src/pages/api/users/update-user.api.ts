import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { buildNextAuthOption } from "../auth/[...nextauth].api";
import { supabase } from "@/services/supabase";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";

// Configuração para desativar o bodyParser interno do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Esquema de validação do formulário
const updateProfileBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  bio: z.string().optional(),
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

  const form = new IncomingForm({
    keepExtensions: true,
    multiples: false,
  });

  form.parse(request, async (err, fields, files) => {
    if (err) {
      return response
        .status(400)
        .json({ error: "Erro ao processar formulário" });
    }

    try {
      // Validação dos campos
      const parsedData = updateProfileBodySchema.parse({
        name: fields.name?.[0] || "",
        bio: fields.bio?.[0] || "",
      });

      let avatarUrl = null;
      const avatarFile = files.avatar?.[0];

      if (avatarFile) {
        const filePath = avatarFile.filepath;
        const fileBuffer = await fs.readFile(filePath);
        const fileName = `avatars/${session.user.id}-${Date.now()}-${
          avatarFile.originalFilename
        }`;

        // Upload para o Supabase
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(fileName, fileBuffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: avatarFile.mimetype!,
          });

        if (error) {
          throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
        }

        // Obter a URL pública
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData.publicUrl;
      }

      // Atualizar usuário no banco
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: parsedData.name,
          bio: parsedData.bio,
          avatar_url: avatarUrl ?? undefined,
        },
      });

      return response.status(204).end();
    } catch (error) {
      return response.status(400).json({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  });
}
