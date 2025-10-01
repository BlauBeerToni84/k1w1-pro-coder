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
import { Key, Github, Smartphone, Sparkles } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [aiProvider, setAiProvider] = useState("gemini");

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
            <div className="space-y-2">
              <Label>KI-Provider wählen</Label>
              <Select value={aiProvider} onValueChange={setAiProvider}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {aiProvider === "gemini" && (
              <>
                <div className="space-y-2">
                  <Label>Gemini Modell</Label>
                  <Select defaultValue="pro">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pro">Gemini Pro</SelectItem>
                      <SelectItem value="flash">Gemini Flash</SelectItem>
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
                      <SelectItem value="llama3">Llama 3 70B</SelectItem>
                      <SelectItem value="mixtral">Mixtral 8x7B</SelectItem>
                      <SelectItem value="gemma">Gemma 7B</SelectItem>
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
          <Button className="bg-primary hover:bg-primary/90">
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};