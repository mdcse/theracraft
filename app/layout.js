import { Playfair_Display, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://theracraftrehab.com"),
  title: "TheraCraft Rehab & Physiotherapy | Best Physiotherapy in Bengaluru",
  description:
    "TheraCraft Rehab & Physiotherapy in Kattigenahalli, Bengaluru. Expert care in orthopedic & sports rehab, dry needling, cupping, and home visit physiotherapy by Dr. Guriya Kumari (B.PTh, MIAP).",
  keywords: [
    "physiotherapy Bengaluru",
    "physiotherapy Kattigenahalli",
    "home visit physiotherapy",
    "dry needling",
    "cupping therapy",
    "sports injury rehab",
    "back pain treatment",
    "Dr. Guriya Kumari",
  ],
  authors: [{ name: "TheraCraft Rehab & Physiotherapy" }],
  openGraph: {
    title: "TheraCraft Rehab & Physiotherapy | Physiotherapy in Bengaluru",
    description:
      "Expert physiotherapy in Kattigenahalli, Bengaluru — clinic visits & physio at your doorstep. Heal • Restore • Move Better.",
    url: "https://theracraftrehab.com",
    siteName: "TheraCraft Rehab & Physiotherapy",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data — helps Google show clinic info in search results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "TheraCraft Rehab & Physiotherapy",
  image: "https://theracraftrehab.com/logo.png",
  "@id": "https://theracraftrehab.com",
  url: "https://theracraftrehab.com",
  telephone: "+919145974904",
  priceRange: "₹₹",
  medicalSpecialty: "Physiotherapy",
  address: {
    "@type": "PostalAddress",
    streetAddress: "PR Mineral, Muneshwara Layout, Kattigenahalli",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560064",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.1007,
    longitude: 77.6387,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "07:00",
      closes: "20:00",
    },
  ],
  founder: {
    "@type": "Person",
    name: "Dr. Guriya Kumari",
    jobTitle: "Physiotherapist (B.PTh, MIAP)",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Apply saved theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t){document.documentElement.dataset.theme=t;}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
