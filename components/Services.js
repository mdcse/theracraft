import "@/styles/services.css";
import SERVICES, { serviceId } from "@/lib/services";

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="services-inner">
        {/* Section heading */}
        <p className="section-eyebrow">Our Services</p>
        <h2 className="section-title">Specialized Care for Every Condition</h2>
        <p className="section-sub">
          {SERVICES.length} evidence-based treatments — at the clinic or in your home.
        </p>

        {/* Cards grid */}
        <div className="services-grid">
          {SERVICES.map((service) => (
            <div key={service.title} id={serviceId(service.title)} className="service-card">
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
