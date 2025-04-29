// servidor.js - Back-end usando Node.js + Express

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Substitua com o seu Access Token do Mercado Pago
const ACCESS_TOKEN = "APP_USR-2800773803181431-103111-ab1f57af96cd1e845c2bc87a02a85245-1215107629";

app.use(cors());
app.use(express.json());

app.post("/gerar-pix", async (req, res) => {
  const { valor, cliente } = req.body;

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        transaction_amount: parseFloat(valor),
        description: `Pagamento de ${cliente}`,
        payment_method_id: "pix",
        payer: {
          email: "cliente@email.com", // Pode ser genérico
          first_name: cliente,
          identification: {
            type: "CPF",
            number: "12345678909",
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message });
    }

    res.json({
      copia_cola: data.point_of_interaction.transaction_data.qr_code,
      qr_code: data.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
