import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

export type Verdict = "true" | "false" | "mixed" | "unverified";

interface Claim {
  text: string;
  verdict: Verdict;
  explanation: string;
}

interface VerdictCardProps {
  claim: Claim;
  index: number;
}

const verdictConfig: Record<Verdict, { label: string; icon: typeof CheckCircle2; colorClass: string; bgClass: string }> = {
  true: {
    label: "Verified True",
    icon: CheckCircle2,
    colorClass: "text-verdict-true",
    bgClass: "bg-verdict-true/10",
  },
  false: {
    label: "False",
    icon: XCircle,
    colorClass: "text-verdict-false",
    bgClass: "bg-verdict-false/10",
  },
  mixed: {
    label: "Mixed / Misleading",
    icon: AlertTriangle,
    colorClass: "text-verdict-mixed",
    bgClass: "bg-verdict-mixed/10",
  },
  unverified: {
    label: "Unverified",
    icon: HelpCircle,
    colorClass: "text-verdict-unverified",
    bgClass: "bg-verdict-unverified/10",
  },
};

const VerdictCard = ({ claim, index }: VerdictCardProps) => {
  const config = verdictConfig[claim.verdict];
  const Icon = config.icon;

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
        </div>
      </div>
    </motion.div>
  );
};

export default VerdictCard;
