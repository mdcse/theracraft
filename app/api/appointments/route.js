import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { notifyClinic, confirmToPatient } from "@/lib/whatsapp";

/**
 * POST /api/appointments
 * Saves a booking, then fires WhatsApp messages to the clinic and patient.
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // ---- Server-side validation (never trust the client alone) ----
    const { name, phone, service, visitType, date } = data;
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

    // ---- Save to MongoDB ----
    await connectDB();
    const appointment = await Appointment.create({
      name: name.trim(),
      phone: phone.trim(),
      email: (data.email || "").trim(),
      service,
      visitType,
      date,
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
    console.error("[appointments] POST error:", err);
    return NextResponse.json(
      { error: "Failed to save appointment" },
      { status: 500 }
    );
  }
}
