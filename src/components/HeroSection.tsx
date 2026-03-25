import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xs font-body font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4"
      >
        AI-Powered Fact Checking
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tight text-balance"
      >
        Don't believe everything
        <br />
        <span className="italic">you read.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-6 text-lg text-muted-foreground font-body max-w-xl mx-auto leading-relaxed"
      >
        Paste any news article, link, or claim — and let our AI verify
        the facts in seconds.
      </motion.p>
    </section>
  );
};

export default HeroSection;
