import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { sendReminder } from "@/lib/whatsapp";

/**
 * GET /api/cron/reminders
 * Runs daily (via Vercel Cron). Finds appointments happening TOMORROW that
 * haven't been reminded yet, sends a WhatsApp reminder, and marks them done.
 *
 * Protected by CRON_SECRET so only Vercel Cron can trigger it.
 */
export async function GET(request) {
  // Verify the request came from Vercel Cron
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    // Tomorrow's date in YYYY-MM-DD (matches how we store form dates)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const target = tomorrow.toISOString().split("T")[0];

    const due = await Appointment.find({
      date: target,
      reminderSent: false,
      status: { $ne: "cancelled" },
    });

    let sent = 0;
    for (const appt of due) {
      await sendReminder(appt);
      appt.reminderSent = true;
      await appt.save();
      sent++;
    }

    return NextResponse.json({ ok: true, remindersSent: sent, date: target });
  } catch (err) {
    console.error("[cron/reminders] error:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
