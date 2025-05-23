import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";
import formidable from "formidable";
import fs from "fs/promises";
import { supabase } from "@/services/supabase";
import { PathLike } from "fs";

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão
  },
};

const parseImages = (files: any) => {
  const images = [];

  // Caso 1: Formato array direto (files.images)
  if (files.images && Array.isArray(files.images)) {
    return files.images;
  }

  // Caso 2: Formato indexado (files['images[0]'])
  const imageKeys = Object.keys(files).filter(
    (key) => key.startsWith("images[") || key === "images"
  );

  if (imageKeys.length > 0) {
    for (const key of imageKeys) {
      if (key === "images") {
        if (Array.isArray(files[key])) {
          images.push(...files[key]);
        } else {
          images.push(files[key]);
        }
      } else {
        // Extrai o índice numérico
        const match = key.match(/images\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          images[index] = files[key][0]; // Assume formidable's PersistentFile
        }
      }
    }
    // Remove possíveis índices vazios
    return images.filter((img) => img !== undefined);
  }

  return [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOption(req, res)
  );

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "PUT") {
    try {
      const form = formidable({
        multiples: true,
        keepExtensions: true,
      });

      const [fields, files] = await form.parse(req);

      // Processar campos do formulário
      const formData = {
        name: fields.name?.[0],
        description: fields.description?.[0],
        price: fields.price?.[0] ? Number(fields.price[0]) : 0,
        porcentagem: fields.porcentagem?.[0]
          ? Number(fields.porcentagem[0])
          : 0,
        active: fields.active?.[0] === "1" || fields.active?.[0] === "true",
      };

      // Processar upload das imagens

      const images = parseImages(files);

      // Agora 'images' é sempre um array
      const imageUrls = await Promise.all(
        images.map(
          async (image: {
            filepath: PathLike | fs.FileHandle;
            originalFilename: any;
            mimetype: any;
          }) => {
            const fileBuffer = await fs.readFile(image.filepath);
            const fileName = `services/${session.user.id}-${Date.now()}-${
              image.originalFilename
            }`;

            const { error } = await supabase.storage
              .from("avatars")
              .upload(fileName, fileBuffer, {
                cacheControl: "3600",
                upsert: true,
                contentType: image.mimetype || "image/jpeg",
              });

            if (error) throw error;

            const { data: publicUrl } = supabase.storage
              .from("avatars")
              .getPublicUrl(fileName);

            return publicUrl.publicUrl;
          }
        )
      );

      // Criar/Atualizar no Prisma
      const serviceData = {
        ...formData,
        userId: session.user.id,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const { id } = req.query;
      await prisma.service.update({
        where: { id: String(id) },
        data: serviceData,
      });
      return res.status(200).json({ message: "Service updated successfully" });
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
