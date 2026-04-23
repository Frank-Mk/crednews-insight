import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FactCheckInput from "@/components/FactCheckInput";
import ResultsSection from "@/components/ResultsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import type { Verdict } from "@/components/VerdictCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FactCheckResult {
  overallScore: number;
  summary: string;
  claims: {
    text: string;
    verdict: Verdict;
    explanation: string;
  }[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [factCheckId, setFactCheckId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (text: string, mode: "text" | "link") => {
    setIsLoading(true);
    setResult(null);
    setFactCheckId(null);

    try {
      const { data, error } = await supabase.functions.invoke("fact-check", {
        body: { content: text, mode },
      });

      if (error) {
        throw new Error(error.message || "Failed to fact-check");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);

      // Save to history if user is logged in
      if (user) {
        const { data: inserted, error: saveError } = await supabase
          .from("fact_checks")
          .insert({
            user_id: user.id,
            content: text,
            mode,
            overall_score: data.overallScore,
            summary: data.summary,
            claims: data.claims,
          })
          .select("id")
          .single();
        if (saveError) {
          console.error("Failed to save fact-check:", saveError);
        } else if (inserted) {
          setFactCheckId(inserted.id);
        }
      }
    } catch (err: any) {
      console.error("Fact-check error:", err);
      toast({
        title: "Fact-check failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FactCheckInput onSubmit={handleSubmit} isLoading={isLoading} />
      {result && (
        <ResultsSection
          claims={result.claims}
          overallScore={result.overallScore}
          summary={result.summary}
          factCheckId={factCheckId}
        />
      )}
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
