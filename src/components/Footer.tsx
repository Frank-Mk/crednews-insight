import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer id="about" className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="font-display text-lg font-bold text-foreground">CredNews</span>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            AI-assisted fact checking. Always verify critical information with primary sources.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
