import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

// Status-Update Komponente (ersetzt Code-Blöcke)
const StatusUpdate = ({ text }: { text: string }) => {
  const getIcon = (line: string) => {
    if (line.includes('🔨') || line.includes('⚙️') || line.includes('📦')) return 'text-primary';
    if (line.includes('✅') || line.includes('✓')) return 'text-green-500';
    if (line.includes('⚠️') || line.includes('❌')) return 'text-yellow-500';
    return 'text-foreground';
  };

  return (
    <div className="my-2 space-y-1 animate-fade-in">
      {text.split('\n').map((line, idx) => (
        line.trim() && (
          <div key={idx} className={`flex items-center gap-2 ${getIcon(line)}`}>
            <span className="text-sm">{line}</span>
          </div>
        )
      ))}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-1 p-3">
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "🚀 K1W1 Pro+ bereit!\n\nIch bin dein vollautomatischer App-Builder für Android.\nSag mir einfach was du bauen möchtest und ich erstelle ALLE Dateien automatisch.\n\n✨ Wie Bolt.new - aber für Android APKs\n📱 Vollständige Apps mit einem Prompt\n🔨 Automatische Code-Generierung auf Deutsch\n\nWas möchtest du bauen?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Streaming von Lovable AI (Edge Function) – nur Status-Updates auf Deutsch
  const CHAT_URL = "/functions/v1/chat";

  const streamChat = async ({
    messages,
    onDelta,
    onDone,
  }: {
    messages: { role: "user" | "assistant"; content: string }[];
    onDelta: (deltaText: string) => void;
    onDone: () => void;
  }) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok || !resp.body) {
      const t = await resp.text().catch(() => "");
      throw new Error(t || `Stream konnte nicht gestartet werden (${resp.status})`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Rest flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  };

  const streamAssistant = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = { id: `${Date.now()}-u`, role: "user", content: userText };
    const assistantId = `${Date.now()}-a`;

    // Nutzer- und Platzhalter-Assistenten-Nachricht einfügen
    setMessages(prev => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "", isTyping: true }
    ]);
    setIsTyping(true);

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      await streamChat({
        messages: history,
        onDelta: (chunk) => {
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m.content || "") + chunk } : m));
        },
        onDone: () => {
          setIsTyping(false);
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, isTyping: false } : m));
        },
      });
    } catch (e: any) {
      console.error(e);
      setIsTyping(false);
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, isTyping: false } : m));
      toast({
        title: "KI nicht verfügbar",
        description: e?.message || "Bitte später erneut versuchen.",
      });
    }
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const toSend = input;
    setInput("");

    toast({
      title: "Nachricht gesendet",
      description: "Die KI arbeitet an deiner Anfrage...",
    });

    // Starte Streaming-Antwort der KI (nur Status-Updates)
    streamAssistant(toSend);
  };

  const renderContent = (content: string) => {
    // Rendere nur Status-Updates, keinen Code
    return <StatusUpdate text={content} />;
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border flex items-center gap-2 bg-gradient-primary">
        <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
        <h2 className="font-semibold">KI-Assistent</h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground shadow-neon"
                    : "bg-secondary text-foreground border border-border"
                }`}
              >
                {message.isTyping ? (
                  <div className="text-sm">{message.content}</div>
                ) : (
                  <div className="text-sm">{renderContent(message.content)}</div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-secondary rounded-lg border border-border">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-gradient-chrome">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Beschreibe deine Änderungen... (Shift+Enter für neue Zeile)"
            className="min-h-[60px] resize-none bg-secondary border-border focus:border-primary transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isTyping}
          />
          <Button 
            onClick={handleSend} 
            size="icon"
            className="h-[60px] w-[60px] bg-primary hover:bg-primary/90 shadow-neon transition-all duration-300 hover:scale-110 disabled:opacity-50"
            disabled={isTyping || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Powered by KI • <kbd className="px-1.5 py-0.5 rounded bg-muted">Enter</kbd> zum Senden
        </div>
      </div>
    </div>
  );
};