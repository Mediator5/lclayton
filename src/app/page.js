import Image from "next/image";
import Hero from "./components/hero";
import AboutSnapshot from "./components/Aboutsnapshot";
import ServicesSection from "./components/Servicessection ";
import FiduciaryBanner from "./components/Fiduciarybanner";
import TeamSection from "./components/Teamsection";
import BlogPreview from "./components/Blogpreview";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <>

      <Hero />
      <AboutSnapshot />
      <ServicesSection />
      <FiduciaryBanner />
      <Testimonials />
      <TeamSection />
      <BlogPreview />
    </>
  );
}
