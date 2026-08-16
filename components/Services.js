import "@/styles/services.css";

const services = [
  {
    icon: "🦴",
    title: "Orthopedic Rehabilitation",
    desc: "Recovery programs for fractures, joint pain and muscle injuries.",
  },
  {
    icon: "🏃",
    title: "Sports Injury Rehabilitation",
    desc: "Sport-specific recovery plans to get you back in the game safely.",
  },
  {
    icon: "🦵",
    title: "ACL / TKR Post-Operative Rehab",
    desc: "Structured recovery after knee ligament surgery or replacement.",
  },
  {
    icon: "💉",
    title: "Dry Needling Therapy",
    desc: "Targeted relief for trigger points, knots and muscle tightness.",
  },
  {
    icon: "🫧",
    title: "Dry Cupping",
    desc: "Suction cups lift the tissue to boost blood flow and ease muscle tension.",
  },
  {
    icon: "🔥",
    title: "Fire Cupping",
    desc: "Traditional heat-based suction that relieves deep tension and stiffness.",
  },
  {
    icon: "🖐️",
    title: "Taping & Myofascial Release",
    desc: "Support, stability and hands-on MFR techniques for pain relief.",
  },
  {
    icon: "🧍",
    title: "Back Pain & Neck Pain",
    desc: "Lasting relief from chronic back, neck and postural pain.",
  },
  {
    icon: "⚡",
    title: "Sciatica & Radiculopathy",
    desc: "Care for nerve pain radiating down the arms and legs.",
  },
  {
    icon: "🧠",
    title: "Paralysis & Neurological Rehab",
    desc: "Regain strength and function after stroke or nerve injury.",
  },
  {
    icon: "🤱",
    title: "Antenatal & Postnatal Care",
    desc: "Safe exercise and recovery for new and expecting mothers.",
  },
  {
    icon: "👴",
    title: "Geriatric Rehabilitation",
    desc: "Gentle therapy for strength, balance and mobility in seniors.",
  },
  {
    icon: "🏠",
    title: "Home Visit Physiotherapy",
    desc: "Complete physiotherapy care delivered at your doorstep.",
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="services-inner">
        {/* Section heading */}
        <p className="section-eyebrow">Our Services</p>
        <h2 className="section-title">Specialized Care for Every Condition</h2>
        <p className="section-sub">
          13 evidence-based treatments — at the clinic or in your home.
        </p>

        {/* Cards grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <div className="service-body">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
