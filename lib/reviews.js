/**
 * Fetches the clinic's live Google reviews via the Google Places API.
 *
 * Requires two env vars:
 *   GOOGLE_PLACES_API_KEY  — a Google Cloud API key with "Places API" enabled
 *   GOOGLE_PLACE_ID        — the clinic's Google Place ID
 *
 * Returns an array of reviews, or `null` if not configured / on error
 * (the caller then falls back to sample reviews, so the site never breaks).
 *
 * Notes:
 * - Google returns AT MOST 5 reviews per place, and picks which ones.
 * - We cache for 24h (revalidate) to stay cheap and within Google's ToS.
 */
export async function getGoogleReviews() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null; // not configured → use fallback

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews&reviews_sort=newest&language=en&key=${key}`;

    const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
    const data = await res.json();

    if (data.status !== "OK" || !Array.isArray(data.result?.reviews)) {
      console.warn("[reviews] Google API status:", data.status, data.error_message || "");
      return null;
    }

    const reviews = data.result.reviews
      // only 5★ reviews that have a real, descriptive comment (skips "Good service")
      .filter((r) => r.rating === 5 && r.text && r.text.trim().length >= 40)
      .map((r) => ({
        name: r.author_name,
        text: r.text,
        tag: r.relative_time_description || "Google Review",
        rating: r.rating,
        photo: r.profile_photo_url || null, // reviewer's Google profile photo
      }));

    return reviews.length ? reviews : null;
  } catch (err) {
    console.error("[reviews] Google fetch failed:", err);
    return null;
  }
}
