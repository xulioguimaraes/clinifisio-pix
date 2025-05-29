import type { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN! 
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { title, price, quantity } = req.body;
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "item-001",
            title,
            unit_price: Number(price),
            quantity: Number(quantity),
            currency_id: "BRL"
          },
        ],
        back_urls: {
          success: "https://seusite.com/sucesso",
          failure: "https://seusite.com/erro",
          pending: "https://seusite.com/pendente",
        },
        auto_return: "approved",
      }
    });

    res.status(200).json({ init_point: preference.init_point });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
} 