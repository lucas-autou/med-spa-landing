import ShowreelHero from "@/components/ShowreelHero";
import InteractiveHero from "@/components/InteractiveHero";
import WhySarahWorks from "@/components/WhySarahWorks";
import IntegrationsRow from "@/components/IntegrationsRow";
import OfferPricing from "@/components/OfferPricing";
import SocialProofSection from "@/components/SocialProofSection";
import FAQ from "@/components/FAQ";
import FinalClose from "@/components/FinalClose";
import StickyAssistant from "@/components/StickyAssistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary">
      {/* 1. Hero Section */}
      <ShowreelHero />
      
      {/* 2. Interactive Demo */}
      <div id="interactive-demo">
        <InteractiveHero />
      </div>
      
      {/* 3. Why Sarah Works (Pain/Solution) */}
      <WhySarahWorks />
      
      {/* 4. Integrations Row */}
      <IntegrationsRow />
      
      {/* 5. Offer & Pricing */}
      <OfferPricing />
      
      {/* 6. Social Proof */}
      <SocialProofSection />
      
      {/* 7. FAQ */}
      <FAQ />
      
      {/* 8. Final Close */}
      <FinalClose />
      
      {/* Sticky Assistant (Mobile) */}
      <StickyAssistant />
    </main>
  );
}