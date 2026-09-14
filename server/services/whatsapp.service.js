function normalizePhone(phone) {
  let digits = String(phone).replace(/\D/g, "");

  // Si viene como 341..., agregamos Argentina.
  if (!digits.startsWith("54")) {
    digits = `54${digits}`;
  }

  return digits;
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

async function sendAppointmentConfirmation({
  customerName,
  customerPhone,
  serviceName,
  barberName,
  date,
  time,
}) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const apiVersion =
    process.env.WHATSAPP_API_VERSION || "v25.0";

  const templateName =
    process.env.WHATSAPP_TEMPLATE_NAME;

  if (!token) {
    throw new Error(
      "Falta WHATSAPP_TOKEN en las variables de entorno"
    );
  }

  if (!phoneNumberId) {
    throw new Error(
      "Falta WHATSAPP_PHONE_NUMBER_ID en las variables de entorno"
    );
  }

  if (!templateName) {
    throw new Error(
      "Falta WHATSAPP_TEMPLATE_NAME en las variables de entorno"
    );
  }

  const phone = normalizePhone(customerPhone);

  const url =
    `https://graph.facebook.com/${apiVersion}/` +
    `${phoneNumberId}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",

    template: {
      name: templateName,

      language: {
        code: "es_AR",
      },

      components: [
        {
          type: "body",

          parameters: [
            {
              type: "text",
              text: customerName,
            },

            {
              type: "text",
              text: serviceName,
            },

            {
              type: "text",
              text: barberName,
            },

            {
              type: "text",
              text: formatDate(date),
            },

            {
              type: "text",
              text: time,
            },
          ],
        },
      ],
    },
  };

  const response = await fetch(url, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "❌ Error de WhatsApp:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data?.error?.message ||
        "No se pudo enviar el WhatsApp"
    );
  }

  console.log("📲 WhatsApp enviado correctamente");
  console.log("Destino:", phone);
  console.log("Message ID:", data.messages?.[0]?.id);

  return data;
}

module.exports = {
  sendAppointmentConfirmation,
};