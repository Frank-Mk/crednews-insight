import { Shield, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-foreground" strokeWidth={2.5} />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            CredNews
          </span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </nav>
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[160px]">
                    {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="gap-1.5"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign in
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="editorial-divider-bold max-w-5xl mx-auto" />
    </header>
  );
};

export default Header;
