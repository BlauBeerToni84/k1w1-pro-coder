import { useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export const ChatInterface = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Prompt ein",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setMessages([...messages, { role: "user", content: prompt }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ich generiere deine App...\n\n✅ App Generator Dashboard\n✅ Build Status Monitor\n✅ Template Selection\n✅ Build History\n✅ Settings",
        },
      ]);
      setIsGenerating(false);
      setPrompt("");
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-4 max-w-2xl mx-auto">
            <div className="relative">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-float" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
              Erstelle deine App mit KI
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Beschreibe deine App-Idee → KI generiert Code → Commit zu GitHub → APK Build
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-4">
              <Button
                variant="outline"
                className="h-auto p-3 flex flex-col items-start gap-1 hover:bg-secondary text-left"
                onClick={() => setPrompt("Erstelle eine Todo-App mit React Native und Supabase")}
              >
                <span className="font-semibold text-sm">📝 Todo-App</span>
                <span className="text-xs text-muted-foreground">
                  Aufgabenverwaltung mit Cloud-Sync
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 flex flex-col items-start gap-1 hover:bg-secondary text-left"
                onClick={() => setPrompt("Erstelle eine Chat-App mit Echtzeit-Messaging")}
              >
                <span className="font-semibold text-sm">💬 Chat-App</span>
                <span className="text-xs text-muted-foreground">
                  Echtzeit-Messaging mit Supabase
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === "assistant" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.role === "assistant"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? "🤖" : "👤"}
                </div>
                <div
                  className={`flex-1 rounded-lg p-4 ${
                    msg.role === "assistant"
                      ? "bg-card border border-border"
                      : "bg-secondary"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  🤖
                </div>
                <div className="flex-1 rounded-lg p-4 bg-card border border-border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Generiere...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border p-3 sm:p-4 bg-card">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Beschreibe deine App-Idee..."
            className="min-h-[50px] sm:min-h-[60px] max-h-[150px] resize-none bg-secondary border-border text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-primary hover:bg-primary/90 gap-2 h-auto px-3 sm:px-4"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
