import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Code, Eye, Play } from "lucide-react";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-96 flex-shrink-0">
          <ChatPanel />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* View Toggle */}
          <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className={viewMode === "preview" ? "bg-primary" : ""}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={viewMode === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("code")}
                className={viewMode === "code" ? "bg-primary" : ""}
              >
                <Code className="w-4 h-4 mr-2" />
                Code
              </Button>
            </div>

            <Button className="bg-primary hover:bg-primary/90 shadow-neon">
              <Play className="w-4 h-4 mr-2" />
              Build
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {viewMode === "preview" ? <PreviewPanel /> : <CodeEditor />}
          </div>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Index;