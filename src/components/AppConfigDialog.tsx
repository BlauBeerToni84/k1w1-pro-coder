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
import { Upload, Sparkles, Package, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppConfigDialog = ({ open, onOpenChange }: AppConfigDialogProps) => {
  const [appName, setAppName] = useState("K1W1 App");
  const [packageId, setPackageId] = useState("com.k1w1.myapp");
  const [version, setVersion] = useState("1.0.0");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleGenerateIcon = () => {
    toast({
      title: "Icon wird generiert...",
      description: "Die KI erstellt ein App-Icon basierend auf deinem App-Namen",
    });
  };

  const handleSave = () => {
    toast({
      title: "✅ Konfiguration gespeichert",
      description: `${appName} wurde erfolgreich konfiguriert`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            App-Konfiguration
          </DialogTitle>
          <DialogDescription>
            Konfiguriere deine App für den finalen Build
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="icon">App-Icon</TabsTrigger>
            <TabsTrigger value="advanced">Erweitert</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">App-Name *</Label>
              <Input
                id="app-name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Meine tolle App"
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                Der Name, der auf dem Home-Screen angezeigt wird
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="package-id">Package ID *</Label>
              <Input
                id="package-id"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                placeholder="com.beispiel.app"
                className="bg-secondary border-border font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Eindeutige Identifikation (Format: com.firma.appname)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="build-number">Build-Nummer</Label>
                <Input
                  id="build-number"
                  defaultValue="1"
                  type="number"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Was macht deine App?"
                className="bg-secondary border-border"
              />
            </div>
          </TabsContent>

          <TabsContent value="icon" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-secondary/20">
              <div className="w-32 h-32 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-neon animate-glow-pulse">
                <span className="text-5xl font-bold text-primary">K</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Aktuelles App-Icon</p>
              
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Icon hochladen
                </Button>
                <Button 
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleGenerateIcon}
                >
                  <Sparkles className="w-4 h-4" />
                  Mit KI generieren
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex gap-2 mb-2">
                <Info className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Icon-Anforderungen</p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• Mindestgröße: 1024x1024 Pixel</li>
                    <li>• Format: PNG mit transparentem Hintergrund</li>
                    <li>• Wird automatisch für alle Plattformen skaliert</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bundle-id">Bundle Identifier (iOS)</Label>
              <Input
                id="bundle-id"
                value={packageId}
                className="bg-secondary border-border font-mono text-sm"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-id">Application ID (Android)</Label>
              <Input
                id="application-id"
                value={packageId}
                className="bg-secondary border-border font-mono text-sm"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Berechtigungen</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Kamera", "Mikrofon", "Standort", "Benachrichtigungen", "Speicher", "Kontakte"].map((perm) => (
                  <div key={perm} className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                    <input type="checkbox" id={perm} className="rounded" />
                    <label htmlFor={perm} className="text-sm cursor-pointer">
                      {perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-sdk">Min. Android SDK</Label>
              <Input
                id="min-sdk"
                defaultValue="24"
                type="number"
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
            Konfiguration speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};