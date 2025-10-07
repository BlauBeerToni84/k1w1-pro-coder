import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { LiveProgress } from "@/components/LiveProgress";
import { PreviewPanel } from "@/components/PreviewPanel";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  status: string;
  progress: number;
  apk_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "🚀 K1W1 Pro+ bereit!\n\nSag mir einfach was du bauen möchtest und ich erstelle ALLE Dateien automatisch.\n\n✨ Vollautomatische App-Generierung\n📱 Android APK auf Knopfdruck\n🔨 Auf Deutsch, wie Bolt.new\n\nWas möchtest du bauen?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadProject = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Helper to strip quotes from env vars
  const stripQuotes = (str: string | undefined): string => {
    if (!str) return 'https://rmqknehekpssknhrjbsu.supabase.co';
    return str.replace(/^["']|["']$/g, '');
  };

  const CHAT_URL = `${stripQuotes(import.meta.env.VITE_SUPABASE_URL)}/functions/v1/chat`;

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

    // Neues Projekt erstellen wenn keins vorhanden
    if (!project) {
      try {
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert({
            name: userText.slice(0, 50),
            prompt: userText,
            status: "building",
            progress: 0,
            user_id: "anonymous",
          })
          .select()
          .single();

        if (error) throw error;
        setProject(newProject);
        navigate(`/chat?project=${newProject.id}`, { replace: true });
      } catch (error: any) {
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive",
        });
      }
    }

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
        variant: "destructive",
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

    streamAssistant(toSend);
  };

  const renderContent = (content: string) => {
    return (
      <div className="space-y-1 animate-fade-in">
        {content.split('\n').map((line, idx) => {
          if (!line.trim()) return null;
          const getColor = () => {
            if (line.includes('🔨') || line.includes('⚙️') || line.includes('📦')) return 'text-primary';
            if (line.includes('✅') || line.includes('✓')) return 'text-green-500';
            if (line.includes('⚠️') || line.includes('❌')) return 'text-yellow-500';
            return 'text-foreground';
          };
          return (
            <div key={idx} className={`${getColor()} text-sm md:text-base`}>
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-base md:text-lg">
              {project?.name || "Neue App"}
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              K1W1 Pro+ • Vollautomatischer App-Builder
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project?.apk_url && (
            <Button size="sm" className="shadow-neon" asChild>
              <a href={project.apk_url} download>
                <Download className="w-4 h-4 mr-2" />
                APK
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Live Progress */}
      {project && <LiveProgress project={project} onUpdate={(updated) => setProject(updated)} />}

      {/* Split Screen: Chat + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left Side */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-border">
          <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
            <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground shadow-neon"
                        : "bg-secondary text-foreground border border-border"
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="text-sm md:text-base">{message.content}</div>
                    ) : (
                      renderContent(message.content)
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-secondary rounded-lg border border-border p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Beschreibe deine App... (Shift+Enter für neue Zeile)"
                className="min-h-[60px] md:min-h-[80px] resize-none text-sm md:text-base"
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
                className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] shrink-0 shadow-neon"
                disabled={isTyping || !input.trim()}
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">Enter</kbd> zum Senden
            </div>
          </div>
        </div>

        {/* Preview Panel - Right Side - Only on Desktop */}
        <div className="hidden md:flex md:w-1/2">
          <PreviewPanel projectId={project?.id} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
