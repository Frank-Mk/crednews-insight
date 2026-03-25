import { motion } from "framer-motion";
import { FileSearch, Brain, CheckSquare } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "Submit",
    desc: "Paste a news article, headline, link, or any claim you want verified.",
  },
  {
    icon: Brain,
    title: "Analyze",
    desc: "Our AI cross-references multiple trusted sources and databases in real-time.",
  },
  {
    icon: CheckSquare,
    title: "Verdict",
    desc: "Get a detailed credibility score with claim-by-claim breakdown.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
      <div className="editorial-divider mb-10" />
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-card border border-border mb-4">
              <step.icon className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
