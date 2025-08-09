import ShowreelHero from "@/components/ShowreelHero";
import InteractiveHero from "@/components/InteractiveHero";
import ConversionSection from "@/components/ConversionSection";
import InteractiveDemo from "@/components/InteractiveDemo";
import HowItWorks from "@/components/HowItWorks";
import ProofDemo from "@/components/ProofDemo";
import PricingTable from "@/components/PricingTable";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import StickyAssistant from "@/components/StickyAssistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary">
      <ShowreelHero />
      <div id="interactive-demo">
        <InteractiveHero />
      </div>
      
      {/* New Conversion Flow - Right after demo */}
      <ConversionSection />
      
      <HowItWorks />
      <ProofDemo />
      <PricingTable />
      <FAQ />
      <FinalCTA />
      <StickyAssistant />
    </main>
  );
}