import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Github, Database, Save, Check, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [relayUrl, setRelayUrl] = useState("");
  const [expoToken, setExpoToken] = useState("");
  const [ollamaEndpoint, setOllamaEndpoint] = useState("");
  const [aiProvider, setAiProvider] = useState("ollama");
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [showExpoToken, setShowExpoToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    // Load from localStorage
    setSupabaseUrl(localStorage.getItem("supabase-url") || "");
    setSupabaseKey(localStorage.getItem("supabase-anon-key") || "");
    setGithubToken(localStorage.getItem("github-token") || "");
    setGithubRepo(localStorage.getItem("github-repo") || "BlauBeerToni/Cursor-k1w1-Builder");
    setRelayUrl(localStorage.getItem("relay-url") || "");
    setExpoToken(localStorage.getItem("expo-token") || "");
    setOllamaEndpoint(localStorage.getItem("ollama-endpoint") || "http://10.0.2.2:11434");
    setAiProvider(localStorage.getItem("ai-provider") || "ollama");
  }, [open]);

  const handleSave = () => {
    localStorage.setItem("supabase-url", supabaseUrl);
    localStorage.setItem("supabase-anon-key", supabaseKey);
    localStorage.setItem("github-token", githubToken);
    localStorage.setItem("github-repo", githubRepo);
    localStorage.setItem("relay-url", relayUrl);
    localStorage.setItem("expo-token", expoToken);
    localStorage.setItem("ollama-endpoint", ollamaEndpoint);
    localStorage.setItem("ai-provider", aiProvider);

    toast({
      title: "Einstellungen gespeichert",
      description: "Deine Konfiguration wurde erfolgreich gespeichert",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary animate-float" />
            Integrationen
          </DialogTitle>
          <DialogDescription>
            Verbinde deine Tools und Services
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary text-xs sm:text-sm">
            <TabsTrigger value="tokens" className="gap-1 sm:gap-2">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Tokens</span>
            </TabsTrigger>
            <TabsTrigger value="supabase" className="gap-1 sm:gap-2">
              <Database className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Supabase</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-1 sm:gap-2">
              <Github className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </TabsTrigger>
          </TabsList>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">API Tokens & Keys</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sichere Speicherung deiner API-Schlüssel
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="expo-token" className="text-sm font-medium">
                    Expo Token
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="expo-token"
                      type={showExpoToken ? "text" : "password"}
                      value={expoToken}
                      onChange={(e) => setExpoToken(e.target.value)}
                      placeholder="eas token:create"
                      className="bg-background border-border font-mono text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowExpoToken(!showExpoToken)}
                    >
                      {showExpoToken ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Für EAS Build (npx eas token:create)
                  </p>
                </div>

                <div>
                  <Label htmlFor="ai-provider" className="text-sm font-medium">
                    AI Provider
                  </Label>
                  <Select value={aiProvider} onValueChange={setAiProvider}>
                    <SelectTrigger id="ai-provider" className="mt-1.5 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ollama">Ollama (Lokal)</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {aiProvider === "ollama" && (
                  <div>
                    <Label htmlFor="ollama-endpoint" className="text-sm font-medium">
                      Ollama Endpoint
                    </Label>
                    <Input
                      id="ollama-endpoint"
                      value={ollamaEndpoint}
                      onChange={(e) => setOllamaEndpoint(e.target.value)}
                      placeholder="http://10.0.2.2:11434"
                      className="mt-1.5 bg-background border-border font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Android Emulator: 10.0.2.2 | Gerät: LAN IP
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Supabase Tab */}
          <TabsContent value="supabase" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Supabase</h3>
                    <Badge variant="outline" className="text-xs bg-accent/20 text-accent border-accent/30">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sync up your app with robust and scalable database
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="supabase-url" className="text-sm font-medium">
                    Supabase URL
                  </Label>
                  <Input
                    id="supabase-url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xxxxx.supabase.co"
                    className="mt-1.5 bg-background border-border font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="supabase-key" className="text-sm font-medium">
                    Anon Key
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="supabase-key"
                      type={showSupabaseKey ? "text" : "password"}
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="bg-background border-border font-mono text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                    >
                      {showSupabaseKey ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* GitHub Tab */}
          <TabsContent value="github" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Github className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">GitHub</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect your repository for automated builds
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="github-token" className="text-sm font-medium">
                    Personal Access Token
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="github-token"
                      type={showGithubToken ? "text" : "password"}
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_..."
                      className="bg-background border-border font-mono text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowGithubToken(!showGithubToken)}
                    >
                      {showGithubToken ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Benötigt Berechtigungen: repo, workflow
                  </p>
                </div>

                <div>
                  <Label htmlFor="github-repo" className="text-sm font-medium">
                    Repository
                  </Label>
                  <Input
                    id="github-repo"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="username/repository"
                    className="mt-1.5 bg-background border-border font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="relay-url" className="text-sm font-medium">
                    Relay URL (optional)
                  </Label>
                  <Input
                    id="relay-url"
                    value={relayUrl}
                    onChange={(e) => setRelayUrl(e.target.value)}
                    placeholder="https://relay.k1w1.app"
                    className="mt-1.5 bg-background border-border font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Für secure GitHub dispatch
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};