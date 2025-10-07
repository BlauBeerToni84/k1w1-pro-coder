import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BuildStatusCardProps {
  title?: string;
  step?: string;
  status: "pending" | "running" | "success" | "failed" | "completed";
  message?: string;
}

export const BuildStatusCard = ({ title, step, status, message }: BuildStatusCardProps) => {
  const displayTitle = title || step || "Step";
  
  const getIcon = () => {
    switch (status) {
      case "success":
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500 animate-scale-in" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card
      className={`
        p-4 transition-all duration-300
        ${
          status === "pending"
            ? "border-border bg-card/50"
            : status === "running"
            ? "border-primary/50 bg-primary/5 shadow-glow"
            : status === "success" || status === "completed"
            ? "border-green-500/50 bg-green-500/5"
            : "border-red-500/50 bg-red-500/5"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{displayTitle}</h4>
          {message && (
            <p className="text-xs text-muted-foreground mt-1">{message}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
