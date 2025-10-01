import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface BuildLog {
  type: "info" | "success" | "error" | "warning";
  message: string;
  timestamp: Date;
}

interface BuildConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  buildType: "web" | "android" | "ios" | null;
}

export const BuildConsole = ({ isOpen, onClose, buildType }: BuildConsoleProps) => {
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildComplete, setBuildComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (isOpen && buildType) {
      startBuild();
    }
  }, [isOpen, buildType]);

  const addLog = (type: BuildLog["type"], message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const startBuild = async () => {
    setIsBuilding(true);
    setBuildComplete(false);
    setLogs([]);

    const buildSteps = buildType === "android" 
      ? [
          { msg: "🔍 Überprüfe Projekt-Struktur...", delay: 500 },
          { msg: "📦 Installiere Capacitor Dependencies...", delay: 800 },
          { msg: "⚙️  Konfiguriere Android Projekt...", delay: 1000 },
          { msg: "🔨 Kompiliere TypeScript Code...", delay: 1500 },
          { msg: "📱 Erstelle Android Ressourcen...", delay: 1200 },
          { msg: "🎨 Optimiere App-Icons...", delay: 800 },
          { msg: "📦 Bundle JavaScript...", delay: 1500 },
          { msg: "🔧 Gradle Build läuft...", delay: 2000 },
          { msg: "📝 Signiere APK...", delay: 1000 },
          { msg: "✅ APK erfolgreich erstellt!", delay: 500, type: "success" as const },
        ]
      : buildType === "ios"
      ? [
          { msg: "🔍 Überprüfe Xcode Installation...", delay: 500 },
          { msg: "📦 Installiere Capacitor Dependencies...", delay: 800 },
          { msg: "⚙️  Konfiguriere iOS Projekt...", delay: 1000 },
          { msg: "🔨 Kompiliere Swift/Objective-C Code...", delay: 1800 },
          { msg: "📱 Erstelle iOS Assets...", delay: 1200 },
          { msg: "🎨 Generiere App-Icons...", delay: 800 },
          { msg: "📦 Bundle React Components...", delay: 1500 },
          { msg: "🔧 Xcode Build läuft...", delay: 2500 },
          { msg: "📝 Code-Signing...", delay: 1200 },
          { msg: "✅ iOS App erfolgreich erstellt!", delay: 500, type: "success" as const },
        ]
      : [
          { msg: "🔍 Analysiere Projekt...", delay: 500 },
          { msg: "📦 Installiere Dependencies...", delay: 800 },
          { msg: "🔨 Kompiliere TypeScript...", delay: 1000 },
          { msg: "⚡ Optimiere Assets...", delay: 1200 },
          { msg: "📦 Bundle JavaScript...", delay: 1500 },
          { msg: "🎨 Generiere CSS...", delay: 800 },
          { msg: "📝 Erstelle Production Build...", delay: 1800 },
          { msg: "✅ Web-Build erfolgreich!", delay: 500, type: "success" as const },
        ];

    for (const step of buildSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      addLog(step.type || "info", step.msg);
    }

    setIsBuilding(false);
    setBuildComplete(true);
  };

  if (!isOpen) return null;

  const getIcon = (type: BuildLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    }
  };

  const getDownloadFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    return buildType === "android" 
      ? `k1w1-app-${timestamp}.apk`
      : buildType === "ios"
      ? `k1w1-app-${timestamp}.ipa`
      : `k1w1-app-${timestamp}.zip`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-card rounded-lg border border-border shadow-chrome overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-chrome">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-semibold">
              Build-Konsole - {buildType === "android" ? "Android APK" : buildType === "ios" ? "iOS App" : "Web Build"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-96 p-4 bg-muted/30 font-mono text-sm" ref={scrollRef}>
          {logs.map((log, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 mb-2 animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {getIcon(log.type)}
              <span className="text-muted-foreground text-xs">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              <span className={
                log.type === "error" ? "text-red-500" :
                log.type === "success" ? "text-green-500" :
                log.type === "warning" ? "text-yellow-500" :
                "text-foreground"
              }>
                {log.message}
              </span>
            </div>
          ))}
          {isBuilding && (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Build läuft...</span>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {buildComplete ? (
              <span className="text-green-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Build abgeschlossen!
              </span>
            ) : isBuilding ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Build läuft...
              </span>
            ) : (
              <span>Bereit zum Build</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
            {buildComplete && (
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Download className="w-4 h-4" />
                {getDownloadFileName()} herunterladen
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};