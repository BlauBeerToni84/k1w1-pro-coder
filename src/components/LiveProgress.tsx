import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2 } from "lucide-react";

interface LiveProgressProps {
  project: {
    id: string;
    status: string;
    progress: number;
  };
  onUpdate: (project: any) => void;
}

export const LiveProgress = ({ project, onUpdate }: LiveProgressProps) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    // Simuliere Fortschritts-Updates basierend auf progress
    const progress = project.progress;
    
    if (progress >= 10 && !steps.includes("Analysiere Anfrage")) {
      setSteps(prev => [...prev, "Analysiere Anfrage"]);
      setCurrentStep("Analysiere Anfrage...");
    }
    if (progress >= 25 && !steps.includes("Erstelle Projektstruktur")) {
      setSteps(prev => [...prev, "Erstelle Projektstruktur"]);
      setCurrentStep("Erstelle Projektstruktur...");
    }
    if (progress >= 40 && !steps.includes("Generiere Komponenten")) {
      setSteps(prev => [...prev, "Generiere Komponenten"]);
      setCurrentStep("Generiere Komponenten...");
    }
    if (progress >= 60 && !steps.includes("Implementiere Features")) {
      setSteps(prev => [...prev, "Implementiere Features"]);
      setCurrentStep("Implementiere Features...");
    }
    if (progress >= 80 && !steps.includes("Erstelle APK")) {
      setSteps(prev => [...prev, "Erstelle APK"]);
      setCurrentStep("Erstelle APK...");
    }
    if (progress >= 100) {
      setCurrentStep("✅ Fertig!");
    }
  }, [project.progress, steps]);

  if (project.status === "completed") {
    return (
      <div className="bg-green-500/10 border-b border-green-500/20 p-3 md:p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-green-500">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm md:text-base">App erfolgreich erstellt!</span>
        </div>
      </div>
    );
  }

  if (project.status === "building") {
    return (
      <div className="bg-card border-b border-border p-3 md:p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-primary shrink-0" />
              <span className="font-medium">{currentStep}</span>
            </div>
            <span className="text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          
          {/* Schrittliste */}
          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
