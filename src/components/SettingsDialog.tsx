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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key, Github, Smartphone, Sparkles, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [aiProvider, setAiProvider] = useState("lovable");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "✅ Einstellungen gespeichert",
      description: "Alle Änderungen wurden übernommen",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Einstellungen
          </DialogTitle>
          <DialogDescription>
            Konfiguriere deine API-Keys und Integrationen
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              KI-Provider
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="expo" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Expo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1">Lovable AI aktiviert</p>
                  <p className="text-xs text-muted-foreground">
                    Die KI-Assistenten sind automatisch konfiguriert und auf Deutsch eingestellt. 
                    Sie arbeiten wie bei Bolt - vollautomatisch mit Code-Generierung, Auto-Fix und 
                    intelligenten Vorschlägen.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>KI-Modell (Vollautomatische Code-Generierung)</Label>
              <Select value={aiProvider} onValueChange={setAiProvider}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lovable">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Lovable AI (Empfohlen - wie Bolt)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gemini">Google Gemini Pro/Flash</SelectItem>
                  <SelectItem value="groq">Groq (Llama 3.3, Mixtral)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Generiert automatisch vollständige Apps auf Deutsch - keine manuelle Code-Eingabe nötig
              </p>
            </div>

            {aiProvider === "lovable" && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Lovable AI Features</p>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>✓ Automatische Code-Generierung auf Deutsch</li>
                      <li>✓ Intelligente Fehler-Erkennung und Auto-Fix</li>
                      <li>✓ Kontextbewusstes Refactoring</li>
                      <li>✓ Best Practices und Optimierungen</li>
                      <li>✓ Multi-Modell Support (Gemini & GPT-5)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {aiProvider === "gemini" && (
              <>
                <div className="space-y-2">
                  <Label>Gemini Modell</Label>
                  <Select defaultValue="flash">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pro">Gemini 2.5 Pro (Beste Qualität)</SelectItem>
                      <SelectItem value="flash">Gemini 2.5 Flash (Schnell & Effizient)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">Gemini API Key</Label>
                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="AIza..."
                    className="bg-secondary border-border"
                  />
                </div>
              </>
            )}

            {aiProvider === "groq" && (
              <>
                <div className="space-y-2">
                  <Label>Groq Modell</Label>
                  <Select defaultValue="llama3">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama3">Llama 3.3 70B (Empfohlen)</SelectItem>
                      <SelectItem value="mixtral">Mixtral 8x7B Instruct</SelectItem>
                      <SelectItem value="llama-90b">Llama 3.1 405B</SelectItem>
                      <SelectItem value="gemma2">Gemma 2 9B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groq-key">Groq API Key</Label>
                  <Input
                    id="groq-key"
                    type="password"
                    placeholder="gsk_..."
                    className="bg-secondary border-border"
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="github" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">GitHub Personal Access Token</Label>
              <Input
                id="github-token"
                type="password"
                placeholder="ghp_..."
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github-repo">Repository URL</Label>
              <Input
                id="github-repo"
                placeholder="https://github.com/username/repo"
                className="bg-secondary border-border"
              />
            </div>
          </TabsContent>

          <TabsContent value="expo" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="expo-token">Expo Access Token</Label>
              <Input
                id="expo-token"
                type="password"
                placeholder="expo_..."
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expo-project">Projekt Slug</Label>
              <Input
                id="expo-project"
                placeholder="my-app"
                className="bg-secondary border-border"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};