import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FactCheckInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const FactCheckInput = ({ onSubmit, isLoading }: FactCheckInputProps) => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"text" | "link">("text");

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="max-w-3xl mx-auto px-6 pb-12"
    >
      <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
        {/* Mode tabs */}
        <div className="flex gap-1 mb-2 px-1 pt-1">
          <button
            onClick={() => setMode("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-body transition-colors ${
              mode === "text"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Text
          </button>
          <button
            onClick={() => setMode("link")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-body transition-colors ${
              mode === "link"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Link
          </button>
        </div>

        {/* Input area */}
        <div className="relative">
          {mode === "text" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a news article, headline, or claim to fact-check..."
              className="w-full min-h-[120px] bg-transparent border-0 resize-none px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0"
            />
          ) : (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a URL to a news article..."
              className="w-full bg-transparent border-0 px-4 py-4 text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <span className="text-xs text-muted-foreground font-body">
            {input.length > 0 ? `${input.length} characters` : ""}
          </span>
          <Button
            variant="hero"
            size="lg"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="gap-2 rounded-lg"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
              />
            ) : (
              <>
                Fact-Check
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default FactCheckInput;
