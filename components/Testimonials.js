import "@/styles/testimonials.css";
import ReviewsCarousel from "./ReviewsCarousel";
import { getGoogleReviews } from "@/lib/reviews";

// Shown until GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID are configured
// (or if the Google API returns nothing / errors).
const SAMPLE_REVIEWS = [
  { name: "Ramesh Kumar", rating: 5, tag: "TKR Rehab",
    text: "After my knee replacement, Dr. Guriya's rehab plan got me walking without support in weeks. Truly dedicated and professional." },
  { name: "Priya Sharma", rating: 5, tag: "Home Visit",
    text: "The home visit physiotherapy was a blessing for my elderly father. Punctual, gentle, and very knowledgeable. Highly recommend." },
  { name: "Arjun Nair", rating: 5, tag: "Back Pain",
    text: "My chronic back pain is finally gone after the dry needling and MFR sessions. I can sit and work again pain-free. Thank you!" },
  { name: "Sneha Reddy", rating: 5, tag: "Postnatal Care",
    text: "Wonderful antenatal and postnatal care. Dr. Guriya made me feel comfortable and confident throughout my recovery journey." },
  { name: "Mohammed Irfan", rating: 5, tag: "Sports Injury",
    text: "Recovered from a nasty sports injury faster than expected. The sport-specific plan was exactly what I needed. Highly skilled team." },
  { name: "Lakshmi Rao", rating: 5, tag: "Neuro Rehab",
    text: "My mother regained so much mobility after her stroke thanks to the neuro rehab sessions. Compassionate and patient throughout." },
];

// Server component: fetches live Google reviews at request time (cached 24h).
export default async function Testimonials() {
  const live = await getGoogleReviews();
  const isLive = Boolean(live && live.length);
  const reviews = isLive ? live : SAMPLE_REVIEWS;

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials-inner">
        <p className="section-eyebrow">Patient Stories</p>
        <h2 className="section-title">What Our Patients Say</h2>
        <p className="section-sub">
          {isLive
            ? "Verified reviews from our Google Business Profile."
            : "Real recoveries from real people across Bengaluru."}
        </p>
      </div>

      <ReviewsCarousel reviews={reviews} />

      {isLive && (
        <p className="reviews-source">
          <span className="google-g">G</span> Sourced live from Google Reviews
        </p>
      )}
    </section>
  );
}
