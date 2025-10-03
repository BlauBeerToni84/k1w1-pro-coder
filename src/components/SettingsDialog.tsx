import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Github, Smartphone, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [aiProvider, setAiProvider] = useState("lovable");
  const [aiModel, setAiModel] = useState("google/gemini-2.5-flash");
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [expoToken, setExpoToken] = useState("");
  const [expoSlug, setExpoSlug] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    // Speichere in localStorage
    localStorage.setItem("ai-provider", aiProvider);
    localStorage.setItem("ai-model", aiModel);
    if (openaiKey) localStorage.setItem("openai-key", openaiKey);
    if (anthropicKey) localStorage.setItem("anthropic-key", anthropicKey);
    if (groqKey) localStorage.setItem("groq-key", groqKey);
    if (githubToken) localStorage.setItem("github-token", githubToken);
    if (githubRepo) localStorage.setItem("github-repo", githubRepo);
    if (expoToken) localStorage.setItem("expo-token", expoToken);
    if (expoSlug) localStorage.setItem("expo-slug", expoSlug);

    toast({
      title: "✅ Einstellungen gespeichert",
      description: "Deine Konfiguration wurde erfolgreich gespeichert",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Einstellungen
          </DialogTitle>
          <DialogDescription>
            Konfiguriere KI-Provider, GitHub und Build-Tools
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai">KI-Provider</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="expo">Expo</TabsTrigger>
          </TabsList>

          {/* AI Provider Tab */}
          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>KI-Provider auswählen</Label>
              <Select value={aiProvider} onValueChange={setAiProvider}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lovable">Lovable AI (empfohlen)</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Lovable AI benötigt keinen API Key
              </p>
            </div>

            {aiProvider === "lovable" && (
              <div className="space-y-2">
                <Label>Modell auswählen</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash (schnell)</SelectItem>
                    <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro (stark)</SelectItem>
                    <SelectItem value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (günstig)</SelectItem>
                    <SelectItem value="openai/gpt-5">GPT-5 (sehr stark)</SelectItem>
                    <SelectItem value="openai/gpt-5-mini">GPT-5 Mini (ausgewogen)</SelectItem>
                    <SelectItem value="openai/gpt-5-nano">GPT-5 Nano (schnell)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {aiProvider === "openai" && (
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-secondary border-border font-mono text-sm"
                />
              </div>
            )}

            {aiProvider === "anthropic" && (
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                <Input
                  id="anthropic-key"
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="bg-secondary border-border font-mono text-sm"
                />
              </div>
            )}

            {aiProvider === "groq" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="groq-key">Groq API Key</Label>
                  <Input
                    id="groq-key"
                    type="password"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="bg-secondary border-border font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Groq Modell</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B</SelectItem>
                      <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B (schnell)</SelectItem>
                      <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold mb-2">💡 Tipp</p>
              <p className="text-xs text-muted-foreground">
                Lovable AI ist der einfachste Weg und benötigt keine API Keys. 
                Alle Gemini Modelle sind aktuell kostenlos (bis 06.10.2025).
              </p>
            </div>
          </TabsContent>

          {/* GitHub Tab */}
          <TabsContent value="github" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">Personal Access Token</Label>
              <Input
                id="github-token"
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="bg-secondary border-border font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Benötigt für Push zu GitHub. Erstelle ein Token unter: 
                github.com/settings/tokens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-repo">Repository URL</Label>
              <Input
                id="github-repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="bg-secondary border-border"
              />
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex gap-2 mb-2">
                <Github className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">GitHub Integration</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Token-Berechtigungen: repo, workflow
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Expo Tab */}
          <TabsContent value="expo" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="expo-token">Expo Access Token</Label>
              <Input
                id="expo-token"
                type="password"
                value={expoToken}
                onChange={(e) => setExpoToken(e.target.value)}
                placeholder="..."
                className="bg-secondary border-border font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Für automatische Expo Builds
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expo-slug">Project Slug</Label>
              <Input
                id="expo-slug"
                value={expoSlug}
                onChange={(e) => setExpoSlug(e.target.value)}
                placeholder="@username/project-name"
                className="bg-secondary border-border"
              />
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Expo Build Service</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ermöglicht Cloud-Builds für iOS und Android
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