import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, FileSearch, Brain, CheckSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Slim landing header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-foreground" strokeWidth={2.5} />
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              CredNews
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Access</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" onClick={() => navigate("/app")}>Open app</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  Sign in
                </Button>
                <Button size="sm" onClick={() => navigate("/app")} className="gap-1.5">
                  Try free <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Verification
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tight"
        >
          The truth, <span className="italic">verified.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 text-lg text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed"
        >
          Paste any news article, link, or claim. CredNews cross-checks it against trusted
          sources and returns a credibility score with a claim-by-claim breakdown — in seconds.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" onClick={() => navigate("/app")} className="gap-2">
            Start fact-checking <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Create free account
          </Button>
        </motion.div>
        <p className="mt-4 text-xs text-muted-foreground font-body">
          No sign-up required — 3 free checks per day for guests.
        </p>
      </section>

      <div className="editorial-divider max-w-5xl mx-auto w-full" />

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20 w-full">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: FileSearch, title: "Submit", desc: "Paste a headline, full article, or a link to any news story." },
            { icon: Brain, title: "Analyze", desc: "Our AI cross-references trusted sources and extracts individual claims." },
            { icon: CheckSquare, title: "Verdict", desc: "Get a credibility score and a verdict for every claim, with reasoning." },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-card border border-border mb-4">
                <s.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="editorial-divider max-w-5xl mx-auto w-full" />

      {/* Access tiers */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 w-full">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
          Free for everyone
        </h2>
        <p className="text-muted-foreground font-body text-center max-w-xl mx-auto mb-12">
          Try CredNews instantly. Create an account to save your history and remove daily limits.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8">
            <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-2">Guest</p>
            <h3 className="font-display text-2xl font-bold mb-4">No account needed</h3>
            <ul className="space-y-2 text-sm font-body text-muted-foreground">
              <li>• 2 text fact-checks per day</li>
              <li>• 1 link fact-check per day</li>
              <li>• Full credibility breakdown</li>
            </ul>
            <Button variant="outline" className="w-full mt-6" onClick={() => navigate("/app")}>
              Try now
            </Button>
          </div>
          <div className="bg-foreground text-background rounded-xl p-8 relative">
            <p className="text-xs font-body uppercase tracking-[0.2em] opacity-70 mb-2">Free account</p>
            <h3 className="font-display text-2xl font-bold mb-4">Unlimited checks</h3>
            <ul className="space-y-2 text-sm font-body opacity-90">
              <li>• Unlimited text & link checks</li>
              <li>• Saved fact-check history</li>
              <li>• Shareable report links</li>
            </ul>
            <Button
              variant="secondary"
              className="w-full mt-6"
              onClick={() => navigate("/auth")}
            >
              Create free account
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
