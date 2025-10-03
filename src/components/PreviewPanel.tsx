import { useState, useEffect } from "react";
import { Smartphone, Monitor, Tablet, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  projectId?: string;
}

type DeviceType = "mobile" | "tablet" | "desktop";

export const PreviewPanel = ({ projectId }: PreviewPanelProps) => {
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [key, setKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // Simuliere Preview URL - In Produktion würde hier die generierte App geladen
    if (projectId) {
      setPreviewUrl(`/preview/${projectId}`);
    } else {
      setPreviewUrl("about:blank");
    }
  }, [projectId]);

  const getDeviceClass = () => {
    switch (device) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
        return "w-full h-full";
      default:
        return "w-full h-full";
    }
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    if (previewUrl && previewUrl !== "about:blank") {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant={device === "mobile" ? "default" : "ghost"}
            size="icon"
            onClick={() => setDevice("mobile")}
            className={device === "mobile" ? "shadow-neon" : ""}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <Button
            variant={device === "tablet" ? "default" : "ghost"}
            size="icon"
            onClick={() => setDevice("tablet")}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={device === "desktop" ? "default" : "ghost"}
            size="icon"
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleOpenExternal}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        {projectId ? (
          <div className={`${getDeviceClass()} bg-background border-2 border-border rounded-lg shadow-chrome overflow-hidden transition-all duration-300`}>
            <iframe
              key={key}
              src={previewUrl}
              className="w-full h-full"
              title="App Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Monitor className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Kein Preview verfügbar</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Starte ein Projekt oder warte bis die KI die App generiert hat.
              Das Preview wird automatisch aktualisiert.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
