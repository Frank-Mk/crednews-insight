import { motion } from "framer-motion";
import VerdictCard, { type Verdict } from "./VerdictCard";
import { Shield } from "lucide-react";

interface Claim {
  text: string;
  verdict: Verdict;
  explanation: string;
}

interface ResultsSectionProps {
  claims: Claim[];
  overallScore: number;
  summary?: string;
}

const getScoreLabel = (score: number) => {
  if (score >= 80) return { label: "Highly Credible", color: "text-verdict-true" };
  if (score >= 50) return { label: "Mixed Credibility", color: "text-verdict-mixed" };
  return { label: "Low Credibility", color: "text-verdict-false" };
};

const ResultsSection = ({ claims, overallScore, summary }: ResultsSectionProps) => {
  const scoreInfo = getScoreLabel(overallScore);

  return (
    <section className="max-w-3xl mx-auto px-6 pb-20">
      <div className="editorial-divider-bold mb-8" />

      {/* Overall score */}
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
            {overallScore}
          </span>
          <span className="text-2xl text-muted-foreground font-display">/100</span>
        </div>
        <p className={`mt-2 text-sm font-semibold font-body ${scoreInfo.color}`}>
          {scoreInfo.label}
        </p>
        {summary && (
          <p className="mt-3 text-sm text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
            {summary}
          </p>
        )}
      </motion.div>

      {/* Claims breakdown */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-foreground mb-4">
          Claims Analysis
        </h3>
        {claims.map((claim, i) => (
          <VerdictCard key={i} claim={claim} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ResultsSection;
