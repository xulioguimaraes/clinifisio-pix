import type { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { serviceId, quantity = 1 } = req.body;
    console.log({ serviceId, quantity });

    // Busca o serviço no banco de dados
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        price: true,
        active: true,
      },
    });

    // Validações de segurança
    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    if (!service.active) {
      return res.status(400).json({ error: "Serviço não está ativo" });
    }

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: service.id,
            title: service.name,
            unit_price: Number(service.price) / 100,
            quantity: Number(quantity),
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/pending`,
        },
        auto_return: "approved",
        external_reference: service.id, // Adiciona referência externa para rastreamento
      },
    });

    res.status(200).json({
      init_point: preference.init_point,
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
      },
    });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
}
