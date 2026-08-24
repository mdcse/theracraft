/**
 * Appointment slot definitions and time helpers.
 *
 * Lives in lib/ because BOTH sides need it: the booking form uses it to grey
 * out slots, and the API route uses it to reject anything invalid. Keeping one
 * copy means the two can never disagree.
 *
 * IMPORTANT: every calculation here is in clinic-local time (IST, UTC+5:30) —
 * never the visitor's timezone and never the server's. A patient booking from
 * Dubai, or with a wrongly-set phone clock, must still see Bengaluru's clock.
 */

// Bookable slots across clinic hours (Mon–Sat 7:00 AM – 8:00 PM),
// spaced 45 minutes apart. The last starts at 7:00 PM and finishes at 7:45 PM;
// a 7:45 PM start would run past closing, so the day ends there.
// To change opening hours later, just add or remove lines here.
export const TIME_SLOTS = [
  "07:00 AM", "07:45 AM", "08:30 AM", "09:15 AM",
  "10:00 AM", "10:45 AM", "11:30 AM", "12:15 PM",
  "01:00 PM", "01:45 PM", "02:30 PM", "03:15 PM",
  "04:00 PM", "04:45 PM", "05:30 PM", "06:15 PM",
  "07:00 PM",
];

/**
 * How soon before a slot we stop accepting bookings, in minutes.
 * 0 = bookable right up until it starts. Raise it if the clinic needs
 * notice to travel for home visits (e.g. 60 for one hour's warning).
 */
export const BOOKING_LEAD_MINUTES = 0;

/**
 * Days of the week the clinic takes no online bookings.
 * 0 = Sunday, 1 = Monday … 6 = Saturday.
 *
 * Currently empty, so every day is bookable. Working hours say
 * "Sunday: By Appointment" — if Sundays should be arranged by phone
 * instead of booked online, change this to [0].
 */
export const CLOSED_WEEKDAYS = [];

/** How many months ahead patients may book. */
export const MONTHS_BOOKABLE_AHEAD = 2;

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** "Now", shifted so the UTC getters read out IST wall-clock values. */
function istNow() {
  return new Date(Date.now() + IST_OFFSET_MS);
}

/** Today's date in Bengaluru, as "YYYY-MM-DD". */
export function istToday() {
  return istNow().toISOString().split("T")[0];
}

/** Minutes since midnight in Bengaluru right now (e.g. 13:30 → 810). */
export function istMinutesNow() {
  const d = istNow();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/** Turn a slot label like "01:30 PM" into minutes since midnight (810). */
export function slotToMinutes(label) {
  const [clock, meridiem] = String(label).trim().split(" ");
  let [h, m] = clock.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * Has this date+slot already gone by in Bengaluru?
 * Dates are "YYYY-MM-DD", which compares correctly as plain text.
 */
export function isSlotPast(date, time) {
  if (!date || !time) return false;

  const today = istToday();
  if (date > today) return false; // a future day — always fine
  if (date < today) return true; // a past day — never fine

  // Today: has the slot already started (plus any required notice)?
  return slotToMinutes(time) - BOOKING_LEAD_MINUTES <= istMinutesNow();
}

/* ------------------------------------------------------------------ *
 * Calendar helpers
 * ------------------------------------------------------------------ */

/** Zero-pad to 2 digits: 7 → "07". */
const pad = (n) => String(n).padStart(2, "0");

/** Build a "YYYY-MM-DD" string from parts (month is 1-12). */
export function toDateString(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Day of week for a "YYYY-MM-DD" string. 0 = Sunday. Timezone-proof. */
export function weekdayOf(date) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Is the clinic closed to online booking on this date? */
export function isClosedDay(date) {
  return CLOSED_WEEKDAYS.includes(weekdayOf(date));
}

/**
 * The slots a patient can actually choose on a given date.
 * `bookedTimes` is the list already taken on that date.
 * This one function drives the dropdown, the calendar counts, and the
 * server's validation — so all three always agree.
 */
export function availableSlotsOn(date, bookedTimes = []) {
  if (!date || isClosedDay(date)) return [];
  return TIME_SLOTS.filter(
    (t) => !isSlotPast(date, t) && !bookedTimes.includes(t)
  );
}

/** Current month in Bengaluru, as "YYYY-MM". */
export function istCurrentMonth() {
  return istToday().slice(0, 7);
}

/** Step a "YYYY-MM" key forward or back. shiftMonth("2026-08", 1) → "2026-09". */
export function shiftMonth(monthKey, delta) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

/** The furthest month key patients may browse to. */
export function lastBookableMonth() {
  return shiftMonth(istCurrentMonth(), MONTHS_BOOKABLE_AHEAD);
}

/** How many days in a "YYYY-MM" month. */
export function daysInMonth(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Which weekday (0 = Sun) the 1st of this month falls on. */
export function firstWeekdayOfMonth(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
}

/** "2026-08" → "August 2026", for the calendar header. */
export function monthLabel(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  const name = new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  return `${name} ${y}`;
}
