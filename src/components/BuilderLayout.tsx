import { useState } from "react";
import { MessageSquare, Code, Eye, Settings2, History, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsDialog } from "./SettingsDialog";
import { PreviewPanel } from "./PreviewPanel";
import { CodeViewer } from "./CodeViewer";
import { BuildHistory } from "./BuildHistory";

interface BuilderLayoutProps {
  children: React.ReactNode;
}

export const BuilderLayout = ({ children }: BuilderLayoutProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 animate-float">
            <Rocket className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold gradient-text">K1W1 Builder</span>
          </div>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-md">
            Prompt To APK
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="border-b border-border bg-card px-4">
            <TabsList className="bg-transparent border-b-0 h-12">
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="code"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-2"
              >
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-2"
              >
                <History className="w-4 h-4" />
                History
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
