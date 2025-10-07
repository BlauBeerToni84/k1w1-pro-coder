import { Progress } from "@/components/ui/progress";
import { BuildStatusCard } from "./BuildStatusCard";

interface BuildProgressProps {
  currentStep: number;
  totalSteps: number;
  status: "idle" | "planning" | "generating" | "committing" | "building" | "success" | "error";
  steps: Array<{
    name: string;
    status: "pending" | "running" | "success" | "failed";
    message?: string;
  }>;
}

export const BuildProgress = ({ currentStep, totalSteps, status, steps }: BuildProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-3">
        {steps.map((step, index) => (
          <BuildStatusCard
            key={index}
            title={step.name}
            status={step.status}
            message={step.message}
          />
        ))}
      </div>
    </div>
  );
};
