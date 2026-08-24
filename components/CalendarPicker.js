"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/calendar.css";
import {
  availableSlotsOn,
  daysInMonth,
  firstWeekdayOfMonth,
  isClosedDay,
  istCurrentMonth,
  istToday,
  lastBookableMonth,
  monthLabel,
  shiftMonth,
  toDateString,
} from "@/lib/slots";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2026-08-27" → "27 August 2026" for the closed field. */
function prettyDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Date field that opens a month calendar on click. Each day shows how many
 * slots are free, and days with none can't be picked at all.
 *
 * value         selected date, "YYYY-MM-DD" (or "")
 * onChange      called with the picked date
 * month         which month is on screen, "YYYY-MM"
 * onMonthChange called when the arrows are used
 * bookedByDate  { "YYYY-MM-DD": ["07:00 AM", ...] }
 * loading       true while that month's bookings are being fetched
 */
export default function CalendarPicker({
  value,
  onChange,
  month,
  onMonthChange,
  bookedByDate = {},
  loading = false,
  invalid = false,
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  // Single place that opens/closes. Tells the parent too, so it can freeze the
  // form's 3D tilt while the calendar is up — otherwise the day cells drift
  // under the cursor as you aim at one.
  const setOpenState = (next) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  // Close when clicking anywhere outside, or on Escape — the two ways people
  // instinctively dismiss a popover.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpenState(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenState(false);
        triggerRef.current?.focus(); // hand focus back where it came from
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const today = istToday();
  const minMonth = istCurrentMonth();
  const maxMonth = lastBookableMonth();

  // Don't let patients wander into months they can't book in.
  const canGoBack = month > minMonth;
  const canGoForward = month < maxMonth;

  // Blank cells so the 1st lands under its correct weekday column.
  const leadingBlanks = firstWeekdayOfMonth(month);
  const totalDays = daysInMonth(month);
  const [year, monthNum] = month.split("-").map(Number);

  const pick = (date) => {
    onChange(date);
    setOpenState(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="cal-wrap" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`cal-trigger${value ? " has-value" : ""}${
          invalid ? " is-invalid" : ""
        }`}
        onClick={() => setOpenState(!open)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? prettyDate(value) : "Select a date"}</span>
        {/* line-art calendar glyph — inherits currentColor so it follows the
            theme, unlike an emoji which would sit oddly among the inputs */}
        <svg
          className="cal-trigger-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <div className="cal" role="dialog" aria-label="Choose an appointment date">
          <div className="cal-head">
            <button
              type="button"
              className="cal-nav"
              onClick={() => onMonthChange(shiftMonth(month, -1))}
              disabled={!canGoBack}
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="cal-month" aria-live="polite">
              {monthLabel(month)}
            </span>
            <button
              type="button"
              className="cal-nav"
              onClick={() => onMonthChange(shiftMonth(month, 1))}
              disabled={!canGoForward}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="cal-grid cal-weekdays" aria-hidden="true">
            {WEEKDAYS.map((d) => (
              <span key={d} className="cal-weekday">
                {d}
              </span>
            ))}
          </div>

          <div className={`cal-grid cal-days${loading ? " is-loading" : ""}`}>
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} className="cal-blank" />
            ))}

            {Array.from({ length: totalDays }, (_, i) => {
              const day = i + 1;
              const date = toDateString(year, monthNum, day);
              const free = availableSlotsOn(date, bookedByDate[date]).length;

              const isToday = date === today;
              const isSelected = date === value;
              const closed = isClosedDay(date);
              // While a month loads, bookedByDate is empty, so counts show the
              // optimistic maximum and settle once the data lands.
              const disabled = free === 0;

              const label = disabled
                ? `${prettyDate(date)}, no slots available`
                : `${prettyDate(date)}, ${free} slot${
                    free === 1 ? "" : "s"
                  } available`;

              return (
                <button
                  key={date}
                  type="button"
                  className={
                    "cal-day" +
                    (isSelected ? " is-selected" : "") +
                    (isToday ? " is-today" : "") +
                    (disabled ? " is-disabled" : "")
                  }
                  onClick={() => pick(date)}
                  disabled={disabled}
                  aria-label={label}
                  aria-pressed={isSelected}
                  title={closed ? "Closed — please call to arrange" : label}
                >
                  <span className="cal-daynum">{day}</span>
                  {free > 0 && (
                    <span className="cal-free">
                      {free} <span className="cal-free-word">left</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="cal-legend">
            The <b>teal number</b> is how many slots are free. Greyed dates are
            full or already past.
          </p>
        </div>
      )}
    </div>
  );
}
