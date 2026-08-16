"use client";

import { useState } from "react";
import "@/styles/faq.css";

const faqs = [
  {
    q: "Do you offer home visit physiotherapy?",
    a: "Yes! We provide complete physiotherapy at your doorstep across Bengaluru — ideal for elderly patients, post-surgery recovery, or anyone who finds travel difficult.",
  },
  {
    q: "What conditions do you treat?",
    a: "We treat orthopedic injuries, sports injuries, post-operative rehab (ACL/TKR), back and neck pain, sciatica, paralysis and neurological conditions, antenatal/postnatal care, and more — 12 specialized services in total.",
  },
  {
    q: "Do I need a doctor's referral to book?",
    a: "No referral is required. You can book an appointment directly with us. If you already have a doctor's prescription or reports, bring them along for a more tailored plan.",
  },
  {
    q: "What are your clinic timings?",
    a: "We are open Monday to Saturday, 7:00 AM to 8:00 PM. Sunday appointments are available on request.",
  },
  {
    q: "How long is each physiotherapy session?",
    a: "A typical session lasts 45 to 60 minutes, depending on your condition and treatment plan. Your first visit may take a little longer for a full assessment.",
  },
  {
    q: "How do I book an appointment?",
    a: "Use the booking form below, message us on WhatsApp, or call directly at +91 9145974904. We'll confirm your slot shortly after.",
  },
];

export default function Faq() {
  // Track which question is open (null = all closed)
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="faq-inner">
        <p className="section-eyebrow">FAQ</p>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub">
          Everything you need to know before your first visit.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="faq-answer">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
