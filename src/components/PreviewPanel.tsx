import { RefreshCw, ExternalLink, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const PreviewPanel = () => {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="h-10 border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${deviceMode === "desktop" ? "bg-secondary" : ""}`}
            onClick={() => setDeviceMode("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${deviceMode === "mobile" ? "bg-secondary" : ""}`}
            onClick={() => setDeviceMode("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-muted/30 flex items-center justify-center">
        <div
          className={`bg-background rounded-lg shadow-chrome transition-all duration-300 ${
            deviceMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-full"
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-primary flex items-center justify-center animate-glow-pulse">
                <span className="text-2xl font-bold text-primary">K</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                Willkommen bei K1W1 Pro+
              </h1>
              <p className="text-muted-foreground">
                Deine App wird hier angezeigt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};