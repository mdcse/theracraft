import "@/styles/cta.css";

export default function CtaBanner() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <h2>Ready to Start Your Recovery?</h2>
        <p>
          Book your appointment today — visit our Kattigenahalli clinic or
          request physiotherapy at your doorstep. Your first step to moving
          better starts here.
        </p>
        <div className="cta-buttons">
          <a href="#book" className="btn btn-white">
            Book Appointment
          </a>
          <a
            href="https://wa.me/917204688546"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
