import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VerdictCard, { type Verdict } from "@/components/VerdictCard";
import Footer from "@/components/Footer";

interface FactCheck {
  id: string;
  content: string;
  overall_score: number;
  summary: string | null;
  claims: { text: string; verdict: Verdict; explanation: string }[];
  created_at: string;
}

const getScoreLabel = (score: number) => {
  if (score >= 80) return { label: "Highly Credible", color: "text-verdict-true" };
  if (score >= 50) return { label: "Mixed Credibility", color: "text-verdict-mixed" };
  return { label: "Low Credibility", color: "text-verdict-false" };
};

const Report = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [check, setCheck] = useState<FactCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    supabase
      .from("fact_checks")
      .select("id, content, overall_score, summary, claims, created_at")
      .eq("share_id", shareId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setCheck(data as unknown as FactCheck);
        setLoading(false);
      });
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-body">
        Loading report…
      </div>
    );
  }

  if (notFound || !check) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <Shield className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Report not found</h1>
        <p className="text-sm text-muted-foreground font-body mb-6">
          This shareable link may have been revoked or is invalid.
        </p>
        <Link to="/" className="text-sm font-semibold text-foreground underline underline-offset-4">
          Go home
        </Link>
      </div>
    );
  }

  const scoreInfo = getScoreLabel(check.overall_score);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-foreground" strokeWidth={2.5} />
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              CredNews
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Run your own check
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Shared Fact-Check Report · {new Date(check.created_at).toLocaleDateString()}
        </p>
        <blockquote className="border-l-2 border-foreground/20 pl-4 mb-10 text-base font-body text-foreground/90 leading-relaxed">
          {check.content}
        </blockquote>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Credibility Score
          </p>
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-foreground" />
            <span className="font-display text-6xl font-bold text-foreground">
              {check.overall_score}
            </span>
            <span className="text-2xl text-muted-foreground font-display">/100</span>
          </div>
          <p className={`mt-2 text-sm font-semibold font-body ${scoreInfo.color}`}>
            {scoreInfo.label}
          </p>
          {check.summary && (
            <p className="mt-3 text-sm text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
              {check.summary}
            </p>
          )}
        </motion.div>

        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold text-foreground mb-4">Claims Analysis</h3>
          {check.claims.map((claim, i) => (
            <VerdictCard key={i} claim={claim} index={i} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Report;
