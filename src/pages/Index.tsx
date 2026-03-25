import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FactCheckInput from "@/components/FactCheckInput";
import ResultsSection from "@/components/ResultsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import type { Verdict } from "@/components/VerdictCard";

// Mock result for demo
const mockClaims = [
  {
    text: "Global temperatures have risen by 1.1°C since pre-industrial times",
    verdict: "true" as Verdict,
    explanation:
      "According to NASA, NOAA, and the IPCC Sixth Assessment Report, the global average temperature has risen approximately 1.1°C above pre-industrial levels as of 2023.",
  },
  {
    text: "The Arctic will be completely ice-free by 2025",
    verdict: "false" as Verdict,
    explanation:
      "While Arctic sea ice is declining, no major scientific body projects a completely ice-free Arctic by 2025. Most models project ice-free summers could occur by the 2040s–2050s.",
  },
  {
    text: "Renewable energy now accounts for 30% of global electricity",
    verdict: "mixed" as Verdict,
    explanation:
      "Renewables generated approximately 29-30% of global electricity in 2023 according to the IEA, but this figure varies by region and includes hydropower, which some definitions exclude.",
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (_text: string) => {
    setIsLoading(true);
    setShowResults(false);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FactCheckInput onSubmit={handleSubmit} isLoading={isLoading} />
      {showResults && (
        <ResultsSection claims={mockClaims} overallScore={62} />
      )}
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
