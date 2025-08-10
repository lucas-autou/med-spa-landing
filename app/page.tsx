import ShowreelHero from "@/components/ShowreelHero";
import InteractiveHero from "@/components/InteractiveHero";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import MoneyBackBanner from "@/components/MoneyBackBanner";
import SecondCTA from "@/components/SecondCTA";
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
      {/* 1. Interactive Hero - Primary experience */}
      <InteractiveHero />
      
      {/* New sections right after the demo */}
      <div className="max-w-6xl mx-auto px-4">
        {/* 2. Social Proof Row */}
        <SocialProof />
        
        {/* 3. How It Works Visual */}
        <HowItWorks />
        
        {/* 4. Money-Back Guarantee Banner */}
        <MoneyBackBanner />
        
        {/* 5. Second CTA */}
        <SecondCTA />
      </div>
      
      {/* Original sections continue below */}
      {/* <ShowreelHero /> */}
      
      {/* 6. Why Sarah Works (Pain/Solution) */}
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