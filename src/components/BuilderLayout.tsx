import { useState } from "react";
import { MessageSquare, Code, Eye, Settings2, History, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsDialog } from "./SettingsDialog";
import { PreviewPanel } from "./PreviewPanel";
import { CodeViewer } from "./CodeViewer";
import { BuildHistory } from "./BuildHistory";
import { RepoSelector } from "./RepoSelector";

interface BuilderLayoutProps {
  children: React.ReactNode;
}

export const BuilderLayout = ({ children }: BuilderLayoutProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header - Mobile Optimized */}
      <header className="h-12 sm:h-14 border-b border-border flex items-center justify-between px-3 sm:px-4 bg-card">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 animate-float">
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-base sm:text-lg font-semibold gradient-text">K1W1</span>
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary rounded-md">
            Prompt→APK
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </header>

      {/* Repo Selector Bar - Mobile Optimized */}
      <div className="border-b border-border bg-card px-3 py-2">
        <RepoSelector />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="border-b border-border bg-card px-2 sm:px-4">
            <TabsList className="bg-transparent border-b-0 h-10 sm:h-12 w-full justify-start">
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="code"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Code className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Code</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0">
              {children}
            </TabsContent>
            <TabsContent value="preview" className="h-full m-0">
              <PreviewPanel />
            </TabsContent>
            <TabsContent value="code" className="h-full m-0">
              <CodeViewer />
            </TabsContent>
            <TabsContent value="history" className="h-full m-0">
              <BuildHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};
