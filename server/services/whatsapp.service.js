function normalizePhone(phone) {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.startsWith("54")) {
    return digits;
  }

  return `54${digits}`;
}

function buildAppointmentMessage({
  customerName,
  serviceName,
  barberName,
  date,
  time,
}) {
  return [
    `Hola ${customerName} 👋`,
    "",
    "Tu turno en Monkey Barber's quedó confirmado 💈",
    "",
    `✂️ Servicio: ${serviceName}`,
    `👤 Barbero: ${barberName}`,
    `📅 Fecha: ${formatDate(date)}`,
    `🕐 Hora: ${time}`,
    "📍 Mendoza 7065, Rosario",
    "",
    "¡Te esperamos!",
  ].join("\n");
}

async function sendAppointmentConfirmation(appointmentData) {
  const phone = normalizePhone(
    appointmentData.customerPhone
  );

  const message = buildAppointmentMessage(
    appointmentData
  );

  /*
    Más adelante acá vamos a llamar
    a WhatsApp Business API.

    Por ahora solamente simulamos el envío
    para comprobar que la integración esté bien armada.
  */

  console.log("📲 WhatsApp preparado");
  console.log("Destino:", phone);
  console.log(message);

  return {
    success: true,
    simulated: true,
  };
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

module.exports = {
  sendAppointmentConfirmation,
};