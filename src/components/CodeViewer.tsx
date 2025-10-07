import { useState } from "react";
import { FileCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface CodeFile {
  path: string;
  content: string;
  language: string;
}

interface CodeViewerProps {
  files?: CodeFile[];
}

export const CodeViewer = ({ files = [] }: CodeViewerProps) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (content: string, path: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(path);
      toast({ title: "Kopiert!", description: `${path} in die Zwischenablage kopiert` });
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Konnte nicht kopieren",
        variant: "destructive",
      });
    }
  };

  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <FileCode className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Kein Code verfügbar</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Starte einen Build, um generierten Code anzuzeigen.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue={files[0]?.path} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-4">
          <ScrollArea className="w-full">
            <TabsList className="bg-transparent h-12 inline-flex">
              {files.map((file) => (
                <TabsTrigger
                  key={file.path}
                  value={file.path}
                  className="data-[state=active]:bg-secondary"
                >
                  {file.path.split("/").pop()}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        {files.map((file) => (
          <TabsContent key={file.path} value={file.path} className="flex-1 m-0 p-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                <span className="text-sm font-mono text-muted-foreground">
                  {file.path}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(file.content, file.path)}
                >
                  {copiedFile === file.path ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <pre className="p-4 text-sm font-mono">
                  <code className="language-{file.language}">{file.content}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
