import { useState } from "react";
import { motion } from "framer-motion";
import VerdictCard, { type Verdict } from "./VerdictCard";
import { Shield, Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureShareLink } from "@/lib/share";
import { useToast } from "@/hooks/use-toast";

interface Claim {
  text: string;
  verdict: Verdict;
  explanation: string;
}

interface ResultsSectionProps {
  claims: Claim[];
  overallScore: number;
  summary?: string;
  factCheckId?: string | null;
}

const getScoreLabel = (score: number) => {
  if (score >= 80) return { label: "Highly Credible", color: "text-verdict-true" };
  if (score >= 50) return { label: "Mixed Credibility", color: "text-verdict-mixed" };
  return { label: "Low Credibility", color: "text-verdict-false" };
};

const ResultsSection = ({ claims, overallScore, summary, factCheckId }: ResultsSectionProps) => {
  const scoreInfo = getScoreLabel(overallScore);
  const { toast } = useToast();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleShare = async () => {
    if (!factCheckId) return;
    setGenerating(true);
    try {
      const url = await ensureShareLink(factCheckId);
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Share link copied",
        description: "Anyone with this link can view the report.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      toast({
        title: "Could not create share link",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {factCheckId && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={generating}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {shareUrl ? "Link ready" : generating ? "Creating link…" : "Create shareable link"}
            </Button>
            {shareUrl && (
              <div className="flex items-center gap-2 w-full max-w-md border border-border rounded-md bg-muted/30 px-3 py-2">
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
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
