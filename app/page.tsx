import ShowreelHero from "@/components/ShowreelHero";
import InteractiveHero from "@/components/InteractiveHero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
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
      <HowItWorks />
      <Features />
      <ProofDemo />
      <PricingTable />
      <FAQ />
      <FinalCTA />
      <StickyAssistant />
    </main>
  );
}