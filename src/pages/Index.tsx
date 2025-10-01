import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ResizableLayout } from "@/components/ResizableLayout";
import { Button } from "@/components/ui/button";
import { Code, Eye, Play, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [isBuilding, setIsBuilding] = useState(false);
  const { toast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B für Build
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        handleBuild();
      }
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

  const handleBuild = () => {
    setIsBuilding(true);
    toast({
      title: "Build gestartet...",
      description: "Deine App wird kompiliert",
    });

    setTimeout(() => {
      setIsBuilding(false);
      toast({
        title: "✅ Build erfolgreich!",
        description: "Deine App ist bereit zum Deployen",
      });
    }, 2500);
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

              <Button 
                className="bg-primary hover:bg-primary/90 shadow-neon transition-all duration-300 hover:scale-105 disabled:opacity-50"
                onClick={handleBuild}
                disabled={isBuilding}
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Building...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Build
                    <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-primary-foreground/20">⌘B</kbd>
                  </>
                )}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === "preview" ? <PreviewPanel /> : <CodeEditor />}
            </div>
          </div>
        }
      />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Index;