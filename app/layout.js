import { Playfair_Display, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "TheraCraft Rehab & Physiotherapy",
  description: "Physiotherapy clinic in Kattigenahalli, Bengaluru",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
