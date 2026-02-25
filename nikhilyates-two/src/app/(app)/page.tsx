"use client"

import LandingPage from "./landing/LandingPage";
import Experience from "@/components/sections/experience/page";
import About from "@/app/(app)/about/page";
import Thoughts from "@/app/(app)/thoughts/page";
import { ContactForm } from "@/app/(app)/contact/ContactForm"
// import Portfolio from "@/app/(app)/portfolio/page"
import Footer from "@/app/(app)/footer/page"
import Head from "next/head"
import { useState, useEffect } from "react";

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1000); // Adjust breakpoint as needed
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="w-100vw overflow-hidden [&::-webkit-scrollbar]:bg-black [&::-webkit-scrollbar-thumb]:bg-black selection:bg-white">
      <LandingPage />
      <About />
      <Experience />
      {/* {!isSmallScreen && <Portfolio />} */}
      <Thoughts />
      <ContactForm />
      <Footer />
    </div>
  );
}
