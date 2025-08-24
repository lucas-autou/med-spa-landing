import InteractiveHero from "@/components/InteractiveHero";
import MedSpasLoveSarah from "@/components/MedSpasLoveSarah";
import OfferPricing from "@/components/OfferPricing";
import FAQ from "@/components/FAQ";
import FinalClose from "@/components/FinalClose";
import StickyAssistant from "@/components/StickyAssistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary">
      {/* 1. Interactive Hero - Primary experience */}
      <InteractiveHero />
      
      {/* 2. Strong Social Proof - "Med Spas Love Sarah" */}
      <MedSpasLoveSarah />
      
      
      {/* 5. Conversion Push - Pricing with guarantee */}
      <OfferPricing />
      
      {/* 6. FAQ - Ask Sarah section */}
      <FAQ />
      
      {/* 7. Final Close - Urgency CTA */}
      <FinalClose />
      
      {/* Sticky Assistant (Mobile) */}
      <StickyAssistant />
    </main>
  );
}