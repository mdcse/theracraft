import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
      <Faq />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
