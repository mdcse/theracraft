import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { notifyClinic, confirmToPatient } from "@/lib/whatsapp";
import { TIME_SLOTS, isSlotPast } from "@/lib/slots";

/**
 * GET /api/appointments?month=YYYY-MM
 * Returns every taken slot in that month, keyed by date:
 *   { booked: { "2026-08-27": ["07:00 AM", "09:30 AM"], ... } }
 *
 * One request powers both the calendar (which counts what's left per day)
 * and the time dropdown (which lists what's left on the chosen day).
 */
export async function GET(request) {
  try {
    const month = request.nextUrl.searchParams.get("month");
    if (!/^\d{4}-\d{2}$/.test(month || ""))
      return NextResponse.json(
        { error: "month must be YYYY-MM" },
        { status: 400 }
      );

    await connectDB();
    // Dates are stored as "YYYY-MM-DD" text, so every date in the month
    // starts with the month key — a simple prefix range does the job.
    const taken = await Appointment.find({
      date: { $gte: `${month}-01`, $lte: `${month}-31` },
    })
      .select("date time -_id")
      .lean();

    const booked = {};
    for (const a of taken) {
      if (!a.time) continue; // skip bookings made before time slots existed
      (booked[a.date] ||= []).push(a.time);
    }

    return NextResponse.json({ booked });
  } catch (err) {
    console.error("[appointments] GET error:", err);
    // Fail open: an empty map just means nothing is hidden. The unique index
    // and the POST checks still block a real double-booking on submit.
    return NextResponse.json({ booked: {} });
  }
}

/**
 * POST /api/appointments
 * Saves a booking, then fires WhatsApp messages to the clinic and patient.
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // ---- Server-side validation (never trust the client alone) ----
    const { name, phone, service, visitType, date, time } = data;
    if (!name || name.trim().length < 2)
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test((phone || "").trim()))
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    if (!service)
      return NextResponse.json({ error: "Service is required" }, { status: 400 });
    if (!["Home Visit"].includes(visitType))
      return NextResponse.json({ error: "Invalid visit type" }, { status: 400 });
    if (!date)
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    if (!time)
      return NextResponse.json({ error: "Time slot is required" }, { status: 400 });
    // Must be one of our real slots — not an arbitrary string posted by hand.
    if (!TIME_SLOTS.includes(time))
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    // And it must still be in the future, judged by the clinic's clock.
    if (isSlotPast(date, time))
      return NextResponse.json(
        { error: "That time has already passed. Please pick a later slot." },
        { status: 400 }
      );

    // ---- Save to MongoDB ----
    await connectDB();

    // Friendly early check. The unique index below is the real guarantee —
    // this just gives a clear message in the normal case.
    const clash = await Appointment.findOne({ date, time }).lean();
    if (clash)
      return NextResponse.json(
        { error: "That time slot is already booked. Please pick another." },
        { status: 409 }
      );

    const appointment = await Appointment.create({
      name: name.trim(),
      phone: phone.trim(),
      email: (data.email || "").trim(),
      service,
      visitType,
      date,
      time,
      message: (data.message || "").trim(),
    });

    // ---- Fire WhatsApp messages (don't fail the booking if these error) ----
    try {
      await Promise.allSettled([
        notifyClinic(appointment),
        confirmToPatient(appointment),
      ]);
    } catch (waErr) {
      console.error("[appointments] WhatsApp send error:", waErr);
    }

    return NextResponse.json(
      { ok: true, id: appointment._id },
      { status: 201 }
    );
  } catch (err) {
    // 11000 = MongoDB duplicate key: someone grabbed the slot a split second
    // before us, between the check above and the insert.
    if (err?.code === 11000)
      return NextResponse.json(
        { error: "That time slot was just booked. Please pick another." },
        { status: 409 }
      );

    console.error("[appointments] POST error:", err);
    return NextResponse.json(
      { error: "Failed to save appointment" },
      { status: 500 }
    );
  }
}
