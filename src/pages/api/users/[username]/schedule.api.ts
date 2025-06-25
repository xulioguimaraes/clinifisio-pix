import { prisma } from "@/lib/prisma";
import { api } from "@/services/api";

import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

interface CreatePixQrCodeRequest {
  value: number;
  format?: "ALL" | "BASE64" | "SVG" | "JPEG";
  expirationSeconds?: number;
  description?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .json({ message: "Método não permitido" });
  }

  try {
    const username = String(req.query.username);

    // Schema de validação
    const createSchedulingBody = z.object({
      name: z.string().min(3, "Nome muito curto"),
      email: z.string().email("Email inválido"),
      observations: z.string().optional(),
      phone: z.string().min(11, "Telefone inválido").optional(),
      date: z.string().datetime(),
      id_service: z.string().uuid("ID do serviço inválido"),
    });

    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { username },
      include: { services: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Valida os dados do corpo
    const { name, email, observations, date, phone, id_service } =
      createSchedulingBody.parse(req.body);

    // Busca o serviço para obter o preço
    const service = await prisma.service.findUnique({
      where: { id: id_service },
    });

    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    const schedulingDate = dayjs(date).startOf("hour");

    // Validações de data
    if (schedulingDate.isBefore(new Date())) {
      return res.status(400).json({ message: "Data não pode ser no passado" });
    }

    // Verifica conflito de agendamentos
    const conflictingScheduling = await prisma.scheduling.findFirst({
      where: {
        user_id: user.id,
        date: schedulingDate.toDate(),
      },
    });

    if (conflictingScheduling) {
      return res
        .status(400)
        .json({ message: "Já existe um agendamento neste horário" });
    }
    const serviceValue = Number(service.price);
    // Configuração do PIX
    const pixPayload: CreatePixQrCodeRequest = {
      value: serviceValue,
      format: "ALL",
      expirationSeconds: 86400,
      description: `Agendamento: ${service.name}`,
    };

    await prisma.scheduling.create({
      data: {
        name,
        email,
        observations: observations || "",
        date: schedulingDate.toDate(),
        user_id: user.id,
        phone: phone || "",
        id_service,
      },
    });

    // Retorna a resposta com os dados do PIX e do agendamento
    return res.status(201).json({
      success: true,
      message: "Agendamento criado com sucesso",
    });
  } catch (error: any) {
    console.error("Erro no agendamento:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro interno no servidor",
      error: error.message,
    });
  }
}
