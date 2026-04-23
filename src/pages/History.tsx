import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Trash2, ArrowLeft, Clock, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerdictCard, { type Verdict } from "@/components/VerdictCard";
import { useToast } from "@/hooks/use-toast";
import { ensureShareLink } from "@/lib/share";

interface FactCheck {
  id: string;
  content: string;
  mode: string;
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

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checks, setChecks] = useState<FactCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("fact_checks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch history:", error);
    } else {
      setChecks((data as unknown as FactCheck[]) || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("fact_checks").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      setChecks((prev) => prev.filter((c) => c.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleShare = async (id: string) => {
    try {
      const url = await ensureShareLink(id);
      await navigator.clipboard.writeText(url);
      setSharedId(id);
      toast({ title: "Share link copied", description: url });
      setTimeout(() => setSharedId((curr) => (curr === id ? null : curr)), 2000);
    } catch (err: any) {
      toast({ title: "Could not create link", description: err.message, variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center text-muted-foreground font-body">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-1.5 text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Fact-Check History
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              {checks.length} {checks.length === 1 ? "check" : "checks"} saved
            </p>
          </div>
        </div>

        {checks.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              No fact-checks yet. Go run your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {checks.map((check) => {
              const scoreInfo = getScoreLabel(check.overall_score);
              const isExpanded = expandedId === check.id;

              return (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border rounded-xl bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : check.id)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <Shield className="w-5 h-5 text-foreground" />
                      <span className="font-display text-2xl font-bold text-foreground">
                        {check.overall_score}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-foreground truncate">
                        {check.content.slice(0, 120)}
                        {check.content.length > 120 ? "…" : ""}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-semibold font-body ${scoreInfo.color}`}>
                          {scoreInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground font-body">
                          {new Date(check.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-body">
                          {check.claims.length} {check.claims.length === 1 ? "claim" : "claims"}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-border pt-4">
                      {check.summary && (
                        <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">
                          {check.summary}
                        </p>
                      )}
                      <div className="space-y-3">
                        {check.claims.map((claim, i) => (
                          <VerdictCard key={i} claim={claim} index={i} />
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(check.id)}
                          className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                          {sharedId === check.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                          {sharedId === check.id ? "Copied" : "Share"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(check.id)}
                          className="gap-1.5 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default History;
