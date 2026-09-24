import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/marg-darshak-icon.png";
import { auth } from "@/integrations/firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NavigationProps {
  accessibilityMode?: boolean;
  onAccessibilityToggle?: () => void;
}

const Navigation = ({ accessibilityMode: propAccessibilityMode, onAccessibilityToggle: propOnAccessibilityToggle }: NavigationProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Use local state if props are not provided (for pages other than Index)
  const [localAccessibilityMode, setLocalAccessibilityMode] = useState(() => {
    return document.documentElement.classList.contains("accessibility-mode");
  });

  const accessibilityMode = propAccessibilityMode !== undefined ? propAccessibilityMode : localAccessibilityMode;
  
  const handleAccessibilityToggle = () => {
    const newValue = !accessibilityMode;
    if (propOnAccessibilityToggle) {
      propOnAccessibilityToggle();
    } else {
      setLocalAccessibilityMode(newValue);
    }
    
    // Globally apply the CSS class to the HTML root for app-wide accessibility
    if (newValue) {
      document.documentElement.classList.add("accessibility-mode");
    } else {
      document.documentElement.classList.remove("accessibility-mode");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const isGuest = localStorage.getItem("isGuest") === "true";
    if (isGuest) {
      setUser({ uid: "guest", email: "guest@example.com", isGuest: true } as any);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (localStorage.getItem("isGuest") === "true") {
        localStorage.removeItem("isGuest");
        setUser(null);
        toast.success("Logged out successfully");
        navigate("/");
        return;
      }

      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group">
            <div className="relative">
              <img src={logo} alt="Marg-Darshak Logo" className="h-14 w-14 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                Marg-Darshak
              </h1>
              <p className="text-sm font-medium text-foreground/80">A path for all abilities</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            <NavLink
              to="/leaderboard"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 relative group px-2 py-1"
              activeClassName="text-primary"
            >
              Leaderboard
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </NavLink>

            <NavLink
              to="/admin"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 relative group px-2 py-1"
              activeClassName="text-primary"
            >
              Admin
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </NavLink>


            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border/50">
              <span className="text-sm font-medium">Accessibility</span>
              <Switch checked={accessibilityMode} onCheckedChange={handleAccessibilityToggle} />
            </div>

            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate("/login")} className="gap-2">
                <LogIn size={16} />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">

            <NavLink
              to="/leaderboard"
              className="block px-2 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </NavLink>

            <NavLink
              to="/admin"
              className="block px-2 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </NavLink>

            <div className="flex items-center justify-between px-2 py-2 border-t border-border mt-4 pt-4">
              <span className="text-sm font-medium">Accessibility Mode</span>
              <Switch checked={accessibilityMode} onCheckedChange={handleAccessibilityToggle} />
            </div>
            <div className="pt-2">
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
                  <LogOut size={16} />
                  Logout
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={() => { navigate("/login"); setIsOpen(false); }} className="w-full justify-start gap-2">
                  <LogIn size={16} />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
