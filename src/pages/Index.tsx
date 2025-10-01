import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { AppConfigDialog } from "@/components/AppConfigDialog";
import { BuildConsole } from "@/components/BuildConsole";
import { BuildMenu } from "@/components/BuildMenu";
import { ResizableLayout } from "@/components/ResizableLayout";
import { Button } from "@/components/ui/button";
import { Code, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appConfigOpen, setAppConfigOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [buildConsoleOpen, setBuildConsoleOpen] = useState(false);
  const [currentBuildType, setCurrentBuildType] = useState<"web" | "android" | "ios" | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const { toast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + E für Preview Toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setViewMode(prev => prev === "preview" ? "code" : "preview");
      }
      // Ctrl/Cmd + , für Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  const handleBuild = (type: "web" | "android" | "ios") => {
    setCurrentBuildType(type);
    setBuildConsoleOpen(true);
    setIsBuilding(true);

    const typeNames = {
      web: "Web-App",
      android: "Android APK",
      ios: "iOS App"
    };

    toast({
      title: `${typeNames[type]} Build gestartet`,
      description: "Öffne die Build-Konsole für Details",
    });

    // Simulate build completion
    setTimeout(() => {
      setIsBuilding(false);
    }, 10000);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      
      <ResizableLayout
        chat={<ChatPanel />}
        main={
          <div className="flex flex-col h-full">
            {/* View Toggle */}
            <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "preview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("preview")}
                  className={`transition-all duration-200 ${
                    viewMode === "preview" 
                      ? "bg-primary shadow-neon" 
                      : "hover:bg-secondary"
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                  <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-secondary/50">⌘E</kbd>
                </Button>
                <Button
                  variant={viewMode === "code" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("code")}
                  className={`transition-all duration-200 ${
                    viewMode === "code" 
                      ? "bg-primary shadow-neon" 
                      : "hover:bg-secondary"
                  }`}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Code
                  <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-secondary/50">⌘E</kbd>
                </Button>
              </div>

              <BuildMenu
                onBuild={handleBuild}
                onConfigClick={() => setAppConfigOpen(true)}
                isBuilding={isBuilding}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === "preview" ? <PreviewPanel /> : <CodeEditor />}
            </div>
          </div>
        }
      />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AppConfigDialog open={appConfigOpen} onOpenChange={setAppConfigOpen} />
      <BuildConsole 
        isOpen={buildConsoleOpen} 
        onClose={() => setBuildConsoleOpen(false)}
        buildType={currentBuildType}
      />
    </div>
  );
};

export default Index;