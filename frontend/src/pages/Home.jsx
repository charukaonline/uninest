import HeroSection from "@/components/landing_page/HeroSection";
import LandingSection2 from "@/components/landing_page/LandingSection2";
import LandingSection3 from "@/components/landing_page/LandingSection3";
import LandingSection4 from "@/components/landing_page/LandingSection4";
// eslint-disable-next-line no-unused-vars
import React from "react";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <LandingSection2/>
      <LandingSection3 />
      <LandingSection4 />
    </div>
  );
};

export default Home;
