import "@/styles/why.css";

const reasons = [
  {
    icon: "🎓",
    title: "Expert-Led Care",
    desc: "Every session is guided by Dr. Guriya Kumari — a qualified, experienced physiotherapist.",
  },
  {
    icon: "🏠",
    title: "Home Visits Available",
    desc: "Can't travel? We bring complete physiotherapy care right to your doorstep.",
  },
  {
    icon: "📋",
    title: "Personalized Plans",
    desc: "No one-size-fits-all. Your treatment is tailored to your body and your goals.",
  },
  {
    icon: "💰",
    title: "Affordable Pricing",
    desc: "High-quality rehabilitation care that doesn't strain your budget.",
  },
  {
    icon: "🕗",
    title: "Flexible Timings",
    desc: "Open 6 days a week, 7 AM to 8 PM, with Sunday appointments on request.",
  },
  {
    icon: "❤️",
    title: "Genuine Compassion",
    desc: "We treat every patient with the patience, honesty, and care they deserve.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="why">
      <div className="why-inner">
        <p className="section-eyebrow">Why Choose Us</p>
        <h2 className="section-title">Recovery You Can Trust</h2>
        <p className="section-sub">
          Six reasons patients across Bengaluru choose TheraCraft for their care.
        </p>

        <div className="why-grid">
          {reasons.map((reason) => (
            <div key={reason.title} className="why-card">
              <div className="why-icon">{reason.icon}</div>
              <h3>{reason.title}</h3>
              <p>{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
