import { RefreshCw, ExternalLink, Smartphone, Monitor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const PreviewPanel = () => {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: "Preview aktualisiert",
      description: "Die Vorschau wurde neu geladen",
    });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleOpenExternal = () => {
    toast({
      title: "Externer Link",
      description: "Preview wird in neuem Tab geöffnet...",
    });
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="h-10 border-b border-border px-4 flex items-center justify-between bg-gradient-chrome">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Preview
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 transition-all duration-200 ${
              deviceMode === "desktop" 
                ? "bg-secondary shadow-neon" 
                : "hover:bg-secondary/50"
            }`}
            onClick={() => setDeviceMode("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 transition-all duration-200 ${
              deviceMode === "mobile" 
                ? "bg-secondary shadow-neon" 
                : "hover:bg-secondary/50"
            }`}
            onClick={() => setDeviceMode("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-secondary/50 transition-all duration-200 hover:rotate-180"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-secondary/50 transition-all duration-200"
            onClick={handleOpenExternal}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-muted/30 flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div
          className={`bg-background rounded-lg shadow-chrome transition-all duration-500 relative overflow-hidden ${
            deviceMode === "mobile" 
              ? "w-[375px] h-[667px] animate-fade-in" 
              : "w-full h-full animate-fade-in"
          }`}
        >
          {isRefreshing && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center animate-glow-pulse">
                  <span className="text-3xl font-bold text-primary">K</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-primary blur-xl opacity-50 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent animate-slide-in">
                  Willkommen bei K1W1 Pro+
                </h1>
                <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "200ms" }}>
                  Deine App wird hier in Echtzeit angezeigt
                </p>
              </div>

              <div className="flex gap-3 justify-center animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="px-4 py-2 rounded-lg bg-secondary/50 border border-border backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground">Hot Reload</div>
                  <div className="text-sm font-semibold text-primary">Aktiv</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-secondary/50 border border-border backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground">Build-Zeit</div>
                  <div className="text-sm font-semibold text-primary">0.5s</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-secondary/50 border border-border backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-sm font-semibold text-primary">Ready</div>
                </div>
              </div>

              <div className="pt-4 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "600ms" }}>
                Ändere deinen Code und sieh die Updates live
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};