import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FactCheckInput from "@/components/FactCheckInput";
import ResultsSection from "@/components/ResultsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { Verdict } from "@/components/VerdictCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  canGuestCheck,
  formatResetIn,
  getGuestUsage,
  recordGuestCheck,
} from "@/lib/guestQuota";

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
  const [guestUsage, setGuestUsage] = useState(getGuestUsage());
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) setGuestUsage(getGuestUsage());
  }, [user]);

  const isGuest = !authLoading && !user;
  const guestBlocked =
    isGuest && guestUsage.text.remaining === 0 && guestUsage.link.remaining === 0;

  const handleSubmit = async (text: string, mode: "text" | "link") => {
    if (isGuest && !canGuestCheck(mode)) {
      toast({
        title: "Daily guest limit reached",
        description:
          mode === "text"
            ? "You've used your 2 text checks for today. Sign in for unlimited access."
            : "You've used your 1 link check for today. Sign in for unlimited access.",
        variant: "destructive",
      });
      setGuestUsage(getGuestUsage());
      return;
    }

    setIsLoading(true);
    setResult(null);
    setFactCheckId(null);

    try {
      const { data, error } = await supabase.functions.invoke("fact-check", {
        body: { content: text, mode },
      });

      if (error) throw new Error(error.message || "Failed to fact-check");
      if (data.error) throw new Error(data.error);

      setResult(data);

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
      } else {
        recordGuestCheck(mode);
        setGuestUsage(getGuestUsage());
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

      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-6 -mt-2 mb-4"
        >
          <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between gap-4 text-sm font-body">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Guest mode: <strong className="text-foreground">{guestUsage.text.remaining}</strong>/{guestUsage.text.limit} text,{" "}
                <strong className="text-foreground">{guestUsage.link.remaining}</strong>/{guestUsage.link.limit} link checks left today.
              </span>
            </div>
            <Link to="/auth" className="shrink-0 text-foreground font-medium hover:underline whitespace-nowrap">
              Sign in →
            </Link>
          </div>
        </motion.div>
      )}

      {guestBlocked ? (
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              You've reached today's free limit
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-1">
              Guests get 2 text and 1 link check per day.
            </p>
            <p className="text-muted-foreground font-body text-sm mb-6">
              Resets in <strong className="text-foreground">{formatResetIn()}</strong>, or create a free account for unlimited checks.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                Create free account <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        <FactCheckInput onSubmit={handleSubmit} isLoading={isLoading} />
      )}

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
