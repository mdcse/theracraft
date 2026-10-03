// THE one list of services for the whole site.
// Add, remove, rename or reorder here and it updates everywhere:
//   - Services section cards  (components/Services.js)
//   - Booking form dropdown   (components/Contact.js)
//   - Footer "Services" links (components/Footer.js) — only those with footer: true
//
// icon   emoji shown on the service card
// title  name shown everywhere (and sent in the WhatsApp booking message)
// desc   one-line description on the service card
// footer true = also list it in the footer

const SERVICES = [
  {
    icon: "🏠",
    title: "Home Visit Physiotherapy",
    desc: "Complete physiotherapy care delivered at your doorstep.",
    footer: true,
  },
  {
    icon: "🏃",
    title: "Sports Injury Rehabilitation",
    desc: "Sport-specific recovery plans to get you back in the game safely.",
    footer: true,
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
    footer: true,
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
    footer: true,
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
    footer: true,
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
    icon: "⚡",
    title: "Shock Wave Therapy",
    desc: "Non-invasive therapy that uses targeted sound waves to reduce pain and support tissue healing.",
  },
  {
    icon: "🖐️",
    title: "IASTM (Instrument-Assisted Soft Tissue Mobilization)",
    desc: "Specialized tools help release tight muscles, improve mobility and reduce soft tissue restrictions.",
  },
  {
    icon: "💪",
    title: "Frozen Shoulder Rehabilitation",
    desc: "Targeted therapy to reduce shoulder pain, restore mobility and improve arm function.",
  },
  {
    icon: "💪",
    title: "Rotator Cuff Injury Rehabilitation",
    desc: "Targeted rehabilitation to reduce shoulder pain, restore strength and improve range of motion.",
  },
  {
    icon: "🦾",
    title: "Bankart Lesion Repair Rehabilitation",
    desc: "Structured rehabilitation after Bankart repair to restore shoulder stability, strength and range of motion.",
  },
  {
    icon: "🧠",
    title: "Stroke Rehabilitation",
    desc: "Personalized therapy to improve strength, balance, coordination and functional independence after stroke.",
  },
  {
    icon: "🩼",
    title: "Post-Operative Fracture Rehabilitation",
    desc: "Progressive rehabilitation to restore mobility, strength and function after fracture surgery.",
  },
];

// "Dry Needling Therapy" → "service-dry-needling-therapy" (the card's anchor id)
export const serviceId = (title) =>
  "service-" +
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default SERVICES;
