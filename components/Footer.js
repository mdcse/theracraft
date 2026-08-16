import "@/styles/footer.css";

const services = [
  "Orthopedic Rehabilitation",
  "Sports Injury Rehab",
  "Dry Needling Therapy",
  "Back & Neck Pain",
  "Neurological Rehab",
  "Home Visit Physiotherapy",
];

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Book Appointment", href: "#book" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo">TheraCraft</span>
          <p className="footer-tag">Rehab &amp; Physiotherapy</p>
          <p className="footer-about">
            Heal • Restore • Move Better. Expert physiotherapy care in
            Kattigenahalli, Bengaluru — at our clinic or your doorstep.
          </p>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {services.map((s) => (
              <li key={s}>
                <a href="#services">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>📍 PR Mineral, Muneshwara Layout, Kattigenahalli, Bengaluru 560064</li>
            <li>
              📞 <a href="tel:+919145974904">+91 9145974904</a>
            </li>
            <li>
              ✉️ <a href="mailto:theracraftrehab02@gmail.com">theracraftrehab02@gmail.com</a>
            </li>
            <li>🕗 Mon–Sat: 7 AM – 8 PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TheraCraft Rehab &amp; Physiotherapy. All rights reserved.</p>
        <p>Dr. Guriya Kumari (B.PTh, MIAP)</p>
      </div>
    </footer>
  );
}
