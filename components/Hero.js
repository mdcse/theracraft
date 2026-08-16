import "@/styles/hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* Left side: text */}
        <div className="hero-text">
          <span className="hero-badge">
            <span className="badge-dot"></span>
            Trusted Physiotherapy in Kattigenahalli
          </span>

          <h1>
            Heal. Restore. <span className="highlight">Move Better.</span>
          </h1>

          <p className="hero-tagline">
            Your Recovery, Our Commitment. Expert physiotherapy at our clinic
            in Bengaluru — or right at your doorstep.
          </p>

          <div className="hero-buttons">
            <a href="#book" className="btn btn-teal">Book Appointment</a>
            <a
              href="https://wa.me/917204688546"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp Us
            </a>
            <a href="tel:+919145974904" className="btn btn-outline">
              Call Now
            </a>
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            <div className="stat">
              <strong>500+</strong>
              <span>Happy Patients</span>
            </div>
            <div className="stat">
              <strong>13</strong>
              <span>Specialized Services</span>
            </div>
            <div className="stat">
              <strong>6 Days</strong>
              <span>Open Every Week</span>
            </div>
          </div>
        </div>

        {/* Right side: doctor card */}
        <div className="doctor-card">
          <div
            className="doctor-photo"
            role="img"
            aria-label="Portrait of Dr. Guriya Kumari"
          ></div>
          <h3>Dr. Guriya Kumari</h3>
          <p className="doctor-role">Physiotherapist</p>
          <p className="doctor-note">
            Physio at Your Doorstep — clinic &amp; home visits across Bengaluru
          </p>
          <div className="doctor-hours">
            Mon–Sat: 7:00 AM – 8:00 PM<br />
            Sunday: By Appointment
          </div>
        </div>
      </div>
    </section>
  );
}
