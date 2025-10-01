import { Settings, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary">K</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          K1W1 Pro+
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-secondary">
          <Github className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          className="hover:bg-secondary"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};