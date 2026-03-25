import { Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-foreground" strokeWidth={2.5} />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            CredNews
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
        </nav>
      </div>
      <div className="editorial-divider-bold max-w-5xl mx-auto" />
    </header>
  );
};

export default Header;
