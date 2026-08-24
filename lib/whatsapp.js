import twilio from "twilio";

/**
 * WhatsApp sender via Twilio.
 *
 * Reads credentials from environment variables. If they're not configured
 * yet, we DON'T crash the booking — we just log and skip sending, so the
 * appointment still saves to the database. This lets the site work before
 * Twilio is set up, and start messaging the moment the keys are added.
 */

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM, // e.g. "whatsapp:+14155238886"
  CLINIC_WHATSAPP_TO, // e.g. "whatsapp:+919145974904"
} = process.env;

const isConfigured =
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM;

const client = isConfigured
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

async function sendWhatsApp(to, body) {
  if (!client) {
    console.warn("[whatsapp] Twilio not configured — skipping message to", to);
    return { skipped: true };
  }
  return client.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    body,
  });
}

/** Notify the clinic that a new appointment came in. */
export async function notifyClinic(appt) {
  const to = CLINIC_WHATSAPP_TO || "whatsapp:+917204688546";
  const body = `🏥 New Appointment Request
Name: ${appt.name}
Phone: ${appt.phone}
Service: ${appt.service}
Visit Type: ${appt.visitType}
Date: ${appt.date}
Time: ${appt.time}
Message: ${appt.message || "—"}
— TheraCraft Booking System`;
  return sendWhatsApp(to, body);
}

/** Send the patient a confirmation that we received their request. */
export async function confirmToPatient(appt) {
  const to = `whatsapp:+91${appt.phone}`;
  const body = `Hi ${appt.name}! 👋
Your appointment request at TheraCraft Rehab & Physiotherapy has been received ✅
Service: ${appt.service}
Date: ${appt.date}
Time: ${appt.time}
We will confirm your slot shortly.
Questions? Call: +91 9145974904
— Dr. Guriya Kumari`;
  return sendWhatsApp(to, body);
}

/** 24-hour reminder (used by the cron job). */
export async function sendReminder(appt) {
  const to = `whatsapp:+91${appt.phone}`;
  const body = `⏰ Reminder: Your physiotherapy appointment with Dr. Guriya Kumari at TheraCraft is tomorrow (${appt.date}) at ${appt.time}.
📍 Kattigenahalli, Bengaluru
📞 +91 9145974904
See you tomorrow! 💪`;
  return sendWhatsApp(to, body);
}
