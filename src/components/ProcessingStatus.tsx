import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Parsing content",
  "Extracting factual claims",
  "Cross-referencing reliable sources",
  "Scoring credibility",
  "Compiling report",
];

const ProcessingStatus = ({ active }: { active: boolean }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1400);
    return () => clearInterval(id);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-3xl mx-auto px-6 pb-10"
        >
          <div className="border border-border rounded-xl bg-card p-6">
            <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Processing
            </p>
            <ul className="space-y-3">
              {STEPS.map((label, i) => {
                const done = i < step;
                const current = i === step;
                return (
                  <li key={label} className="flex items-center gap-3 font-body text-sm">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        done
                          ? "bg-verdict-true/15 text-verdict-true"
                          : current
                          ? "bg-foreground/10 text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <Check className="w-3 h-3" />
                      ) : current ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                      )}
                    </span>
                    <span
                      className={
                        done
                          ? "text-foreground"
                          : current
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {label}
                      {current && "…"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default ProcessingStatus;
