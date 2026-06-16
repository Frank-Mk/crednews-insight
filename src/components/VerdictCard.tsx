import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ExternalLink } from "lucide-react";

export type Verdict = "true" | "false" | "mixed" | "unverified";

export interface ClaimSource {
  title: string;
  url: string;
}

interface Claim {
  text: string;
  verdict: Verdict;
  explanation: string;
  sources?: ClaimSource[];
}

interface VerdictCardProps {
  claim: Claim;
  index: number;
}

const verdictConfig: Record<Verdict, { label: string; icon: typeof CheckCircle2; colorClass: string; bgClass: string }> = {
  true: { label: "Verified True", icon: CheckCircle2, colorClass: "text-verdict-true", bgClass: "bg-verdict-true/10" },
  false: { label: "False", icon: XCircle, colorClass: "text-verdict-false", bgClass: "bg-verdict-false/10" },
  mixed: { label: "Mixed / Misleading", icon: AlertTriangle, colorClass: "text-verdict-mixed", bgClass: "bg-verdict-mixed/10" },
  unverified: { label: "Unverified", icon: HelpCircle, colorClass: "text-verdict-unverified", bgClass: "bg-verdict-unverified/10" },
};

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const VerdictCard = ({ claim, index }: VerdictCardProps) => {
  const config = verdictConfig[claim.verdict];
  const Icon = config.icon;
  const sources = claim.sources?.filter((s) => s?.url) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border border-border rounded-xl p-5 bg-card"
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${config.bgClass} shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${config.colorClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-semibold uppercase tracking-wider font-body ${config.colorClass}`}>
              {config.label}
            </span>
          </div>
          <p className="text-foreground font-display text-lg font-semibold leading-snug mb-2">
            "{claim.text}"
          </p>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            {claim.explanation}
          </p>

          {sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] font-body font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Related Sources
              </p>
              <ul className="space-y-1.5">
                {sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 text-sm font-body text-foreground hover:text-foreground"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                      <span className="min-w-0">
                        <span className="underline decoration-muted-foreground/40 underline-offset-2 group-hover:decoration-foreground">
                          {s.title}
                        </span>
                        <span className="block text-xs text-muted-foreground truncate">
                          {hostname(s.url)}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VerdictCard;
