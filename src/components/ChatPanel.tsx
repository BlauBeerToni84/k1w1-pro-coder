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

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2 rounded-lg overflow-hidden border border-border animate-fade-in">
      <div className="flex items-center justify-between bg-secondary/50 px-3 py-1.5 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
      <ScrollArea className="max-h-64">
        <pre className="p-3 text-xs overflow-x-auto">
          <code className="font-mono">{code}</code>
        </pre>
      </ScrollArea>
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
      content: "Hallo! Ich bin dein K1W1 Pro+ KI-Assistent. 🚀\n\nIch kann dir helfen mit:\n• Code-Generierung und Refactoring\n• Bug-Fixes und Optimierungen\n• Erklärungen zu deinem Code\n• Best Practices und Design Patterns\n\nWas möchtest du bauen?"
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

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    const words = text.split(" ");
    let currentText = "";
    const tempId = Date.now().toString();
    
    setMessages(prev => [...prev, {
      id: tempId,
      role: "assistant",
      content: "",
      isTyping: true
    }]);

    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index > 0 ? " " : "") + words[index];
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, content: currentText }
            : msg
        ));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, isTyping: false }
            : msg
        ));
      }
    }, 50);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Simulated AI responses
    setTimeout(() => {
      const responses = [
        "Verstanden! Ich erstelle den Code für dich. Einen Moment bitte... ✨",
        "Gute Idee! Lass mich das für dich optimieren. 🔧",
        "Perfekt! Ich arbeite an einer eleganten Lösung. 💡"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      simulateTyping(randomResponse);
    }, 500);

    toast({
      title: "Nachricht gesendet",
      description: "Die KI arbeitet an deiner Anfrage...",
    });
  };

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <p key={lastIndex} className="whitespace-pre-wrap">
            {content.substring(lastIndex, match.index)}
          </p>
        );
      }
      parts.push(
        <CodeBlock
          key={match.index}
          code={match[2].trim()}
          language={match[1] || "text"}
        />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <p key={lastIndex} className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </p>
      );
    }

    return parts;
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