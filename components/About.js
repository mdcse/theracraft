import "@/styles/about.css";

const credentials = [
  "B.PTh — Bachelor of Physiotherapy",
  "MIAP — Member, Indian Association of Physiotherapists",
  "Orthopedic & Neurological Rehab Specialist",
  "500+ patients successfully treated",
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-inner">
        {/* Left: image / credentials card */}
        <div className="about-visual">
          <div className="about-card">
            <div className="about-avatar">GK</div>
            <h3>Dr. Guriya Kumari (PT)</h3>
            <p className="about-role">Founder &amp; Lead Physiotherapist</p>
            <ul className="about-creds">
              {credentials.map((c) => (
                <li key={c}>
                  <span className="tick">✓</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: story */}
        <div className="about-text">
          <p className="section-eyebrow">About TheraCraft</p>
          <h2 className="section-title">
            Personalized Physiotherapy, Rooted in Care
          </h2>
          <p>
            TheraCraft Rehab &amp; Physiotherapy was founded with one simple
            belief — that quality recovery care should be accessible, personal,
            and effective. Based in Kattigenahalli, Bengaluru, we help patients
            move past pain and return to the life they love.
          </p>
          <p>
            Led by Dr. Guriya Kumari, our clinic blends modern evidence-based
            techniques with hands-on, compassionate treatment. From sports
            injuries to post-surgical rehab and neurological care, every plan is
            tailored to you — whether you visit our clinic or need physio at your
            doorstep.
          </p>

          <div className="about-mission">
            <strong>Our Mission</strong>
            <p>
              To restore movement, relieve pain, and improve quality of life for
              every patient — with honesty, expertise, and genuine care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}