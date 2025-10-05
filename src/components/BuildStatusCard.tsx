import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BuildStatusCardProps {
  step: string;
  status: "completed" | "running" | "pending" | "failed";
}

export const BuildStatusCard = ({ step, status }: BuildStatusCardProps) => {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-accent" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "running":
        return "Running";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="font-medium text-sm">{step}</span>
      </div>
      <span className="text-xs text-muted-foreground">{getStatusText()}</span>
    </div>
  );
};

interface BuildProgressProps {
  steps: Array<{ name: string; status: "completed" | "running" | "pending" | "failed" }>;
  progress: number;
}

export const BuildProgress = ({ steps, progress }: BuildProgressProps) => {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Build Progress</h3>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <BuildStatusCard key={idx} step={step.name} status={step.status} />
          ))}
        </div>
      </div>
    </Card>
  );
};
