import React from "react";
import BrainstormingSection from "./sections/BrainstormingSection";
import FeaturesSection from "./sections/FeaturesSection";
import HeroSection from "./sections/HeroSection";
import PricingSection from "./sections/PricingSection";
import StatsSection from "./sections/StatsSection";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <BrainstormingSection />
      <PricingSection />
    </div>
  );
};

export default LandingPage;
