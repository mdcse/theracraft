"use client";

import { useState, useRef, useEffect } from "react";
import "@/styles/contact.css";
import CalendarPicker from "./CalendarPicker";
import {
  TIME_SLOTS,
  availableSlotsOn,
  istCurrentMonth,
  isSlotPast,
} from "@/lib/slots";
import SERVICES from "@/lib/services";

// Dropdown choices: every service, plus "Other" for anything not listed.
const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), "Other"];

// Bookings land in Dr. Guriya's WhatsApp — the patient sends it from their own.
const CLINIC_WHATSAPP = "917204688546"; // same number as the site's other WhatsApp buttons

// "2026-10-05" → "Mon, 5 Oct 2026"
const prettyDate = (ymd) =>
  new Date(`${ymd}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Builds the WhatsApp link with the patient's details already typed out.
const buildWhatsAppUrl = (f) => {
  const lines = [
    "Hello Dr. Guriya, I'd like to book an appointment.",
    "",
    `*Name:* ${f.name.trim()}`,
    `*Phone:* ${f.phone.trim()}`,
    f.email.trim() ? `*Email:* ${f.email.trim()}` : null,
    `*Service:* ${f.service}`,
    `*Visit Type:* ${f.visitType}`,
    `*Date:* ${prettyDate(f.date)}`,
    `*Time:* ${f.time}`,
    f.message.trim() ? `*Message:* ${f.message.trim()}` : null,
    "",
    "— Sent from theracraftrehab.com",
  ];
  // null = optional field left empty, so leave that line out
  const text = lines.filter((l) => l !== null).join("\n");
  return `https://api.whatsapp.com/send?phone=${CLINIC_WHATSAPP}&text=${encodeURIComponent(text)}`;
};

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  service: "",
  visitType: "Home Visit", // only home visits available currently
  date: "",
  time: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  // { "2026-08-27": ["07:00 AM", ...] } for the month on screen
  const [bookedByDate, setBookedByDate] = useState({});
  const [viewMonth, setViewMonth] = useState(istCurrentMonth());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // bump to re-pull the month
  const formRef = useRef(null); // 3D tilt target (updated directly, no re-render)

  // Fetch a whole month at once. The calendar needs every day's counts anyway,
  // and the time dropdown just reads its date out of the same map — so picking
  // a date costs no extra request.
  // DISABLED for now: booked slots are no longer greyed out on the calendar.
  // Uncomment to bring it back.
  // useEffect(() => {
  //   let stale = false; // if the month changes mid-flight, drop the old reply
  //   setLoadingSlots(true);
  //
  //   fetch(`/api/appointments?month=${viewMonth}`)
  //     .then((res) => (res.ok ? res.json() : { booked: {} }))
  //     .then((data) => {
  //       // Merge rather than replace: browsing to another month must not throw
  //       // away what we know about the month the patient already picked from.
  //       if (!stale) setBookedByDate((prev) => ({ ...prev, ...(data.booked || {}) }));
  //     })
  //     .catch(() => {
  //       // Offline? Keep what we have; the server still decides on submit.
  //     })
  //     .finally(() => {
  //       if (!stale) setLoadingSlots(false);
  //     });
  //
  //   return () => {
  //     stale = true;
  //   };
  // }, [viewMonth, refreshKey]);

  // If the chosen slot stops being available — someone else booked it, or it
  // simply passed — quietly un-choose it so the form can't submit a dead slot.
  useEffect(() => {
    if (!form.time) return;
    const stillFree = availableSlotsOn(form.date, bookedByDate[form.date]);
    if (!stillFree.includes(form.time))
      setForm((prev) => ({ ...prev, time: "" }));
  }, [form.date, form.time, bookedByDate]);

  // Tilt the form toward the cursor for a subtle 3D effect (desktop only).
  // We write the transform straight to the DOM so React doesn't re-render.
  const handleTilt = (e) => {
    const el = formRef.current;
    if (!el || calendarOpen) return; // frozen while the date popover is open
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0 → 1 across
    const py = (e.clientY - r.top) / r.height; // 0 → 1 down
    const rx = (0.5 - py) * 6;
    const ry = (px - 0.5) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const resetTilt = () => {
    if (formRef.current)
      formRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear a field's error as soon as the user edits it
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---- Client-side validation (runs before we send anything) ----
  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.service) next.service = "Please select a service.";
    if (!form.date) next.date = "Please pick a preferred date.";
    if (!form.time) next.time = "Please pick a time slot.";
    else if (isSlotPast(form.date, form.time))
      next.time = "That time has already passed. Please pick a later slot.";
    if (form.message.length > 300) next.message = "Message must be under 300 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // 409 = the slot got taken while they were filling the form.
      // Mark it booked, clear their choice, and ask for another — don't
      // throw them into the generic error state.
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        // Record it as taken so both the dropdown and the calendar count update.
        setBookedByDate((prev) => {
          const forDate = prev[form.date] || [];
          if (forDate.includes(form.time)) return prev;
          return { ...prev, [form.date]: [...forDate, form.time] };
        });
        setForm((prev) => ({ ...prev, time: "" }));
        setErrors((prev) => ({
          ...prev,
          time: data.error || "That slot was just booked. Please pick another.",
        }));
        setStatus("idle");
        return;
      }

      if (!res.ok) throw new Error("Request failed");

      // DISABLED along with the calendar's booked-slot greying (see above).
      // const justBooked = { date: form.date, time: form.time };
      // setBookedByDate((prev) => {
      //   const forDate = prev[justBooked.date] || [];
      //   if (forDate.includes(justBooked.time)) return prev;
      //   return { ...prev, [justBooked.date]: [...forDate, justBooked.time] };
      // });
      // setRefreshKey((k) => k + 1);
    } catch (err) {
      // Saving failed (offline, server down…). Still hand off to WhatsApp —
      // the message reaching Dr. Guriya matters more than our database copy.
      console.error("[booking] save failed, continuing to WhatsApp:", err);
    }

    // Open WhatsApp with the message ready; the patient just taps Send.
    // Same-tab navigation, because a new tab opened after an await gets
    // blocked as a popup on most phones.
    const waUrl = buildWhatsAppUrl(form);
    setStatus("success");
    setForm(EMPTY_FORM); // clear the form for when they come back
    window.location.href = waUrl;
  };

  // Only offer what's genuinely open. Slots already booked or already gone by
  // are left out entirely rather than shown greyed out — a booking form should
  // present choices, not advertise what the patient can't have.
  const availableSlots = availableSlotsOn(form.date, bookedByDate[form.date]);

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        {/* LEFT: clinic info */}
        <div className="contact-info">
          <p className="section-eyebrow">Get In Touch</p>
          <h2 className="section-title">Book Your Appointment</h2>
          <p className="contact-lead">
            Fill in the form and we'll confirm your slot shortly. Prefer to talk?
            Reach us directly using the details below.
          </p>

          <ul className="contact-details">
            <li>
              <span className="ci-icon">📍</span>
              <div>
                <strong>Visit Us</strong>
                PR Mineral, Muneshwara Layout, Kattigenahalli,
                Bengaluru, Karnataka 560064
              </div>
            </li>
            <li>
              <span className="ci-icon">📞</span>
              <div>
                <strong>Call Us</strong>
                <a href="tel:+917204688546">+91 7204688546</a>
              </div>
            </li>
            <li>
              <span className="ci-icon">✉️</span>
              <div>
                <strong>Email Us</strong>
                <a href="mailto:theracraftrehab02@gmail.com">
                  theracraftrehab02@gmail.com
                </a>
              </div>
            </li>
            <li>
              <span className="ci-icon">🕗</span>
              <div>
                <strong>Working Hours</strong>
                Mon–Sat: 7:00 AM – 8:00 PM · Sunday: By Appointment
              </div>
            </li>
          </ul>
        </div>

        {/* RIGHT: booking form */}
        <div
          id="book"
          className="contact-form-wrap"
          ref={formRef}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
        >
          {status === "success" ? (
            <div className="form-success">
              <div className="success-check">✓</div>
              <h3>Almost done!</h3>
              <p>
                Please tap <strong>Send</strong> in WhatsApp so your request
                reaches Dr. Guriya. We&apos;ll confirm your slot shortly. For anything
                urgent, call +91 7204688546.
              </p>
              <button className="btn btn-teal" onClick={() => setStatus("idle")}>
                Book Another
              </button>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="service">Service *</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                >
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service && <span className="field-error">{errors.service}</span>}
              </div>

              <div className="field">
                <label>Preferred Date *</label>
                <CalendarPicker
                  value={form.date}
                  onChange={(date) => {
                    setForm((prev) => ({ ...prev, date }));
                    setErrors((prev) => ({ ...prev, date: "" }));
                  }}
                  month={viewMonth}
                  onMonthChange={setViewMonth}
                  bookedByDate={bookedByDate}
                  loading={loadingSlots}
                  invalid={!!errors.date}
                  onOpenChange={(isOpen) => {
                    setCalendarOpen(isOpen);
                    if (isOpen) resetTilt(); // settle the card before it opens
                  }}
                />
                {errors.date && <span className="field-error">{errors.date}</span>}
              </div>

              <div className="field">
                <label htmlFor="time">Preferred Time *</label>
                <select
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  disabled={!form.date || loadingSlots}
                >
                  <option value="">
                    {!form.date
                      ? "Pick a date above"
                      : loadingSlots
                      ? "Checking availability…"
                      : "Select a time slot"}
                  </option>
                  {/* Every slot stays visible so the day's shape is clear;
                      the unavailable ones are simply not selectable. */}
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t} disabled={!availableSlots.includes(t)}>
                      {t}
                    </option>
                  ))}
                </select>
                {form.date && !loadingSlots && !errors.time && (
                  <span className="field-hint">
                    {availableSlots.length === 0
                      ? "No slots left on this date — please choose another day."
                      : "Greyed-out times have already passed."}
                  </span>
                )}
                {errors.time && <span className="field-error">{errors.time}</span>}
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us briefly about your condition (optional)"
                  maxLength={300}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              {status === "error" && (
                <p className="form-error-msg">
                  Something went wrong. Please try again or call us directly x.
                </p>
              )}

              <button
                type="submit"
                className="btn btn-teal submit-btn"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Opening WhatsApp…" : "Book on WhatsApp"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
