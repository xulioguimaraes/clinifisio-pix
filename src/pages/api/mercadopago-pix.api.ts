import type { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from "mercadopago";
console.log(process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN);

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-4760843392875035-031509-16a68302d443e1a4a5620a03af3faeb0-563920084',
  options:{

  }
});


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { title, price, payer } = req.body;
    // payer: { email, first_name, last_name, identification: { type, number } }

    const payment = await new Payment(client).create({
      body: {
        transaction_amount: Number(price),
        description: title,
        payment_method_id: "pix",
        payer,
        // Opcional: defina a data de expiração do QR Code Pix
        // date_of_expiration: "2024-07-01T23:59:59.000-03:00"
      },
    });

    // Retorne os dados necessários para o frontend exibir o QR Code e o copia e cola
    res.status(200).json({
      qr_code_base64:
        payment.point_of_interaction?.transaction_data?.qr_code_base64,
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
      ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url,
      payment_id: payment.id,
      status: payment.status,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar pagamento Pix", error: error });
  }
}
