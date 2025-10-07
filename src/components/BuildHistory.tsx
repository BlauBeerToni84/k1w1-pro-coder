import { History, ExternalLink, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface BuildHistoryItem {
  id: string;
  prompt: string;
  status: "success" | "failed" | "running";
  timestamp: string;
  apkUrl?: string;
  aabUrl?: string;
  runUrl?: string;
}

interface BuildHistoryProps {
  builds?: BuildHistoryItem[];
}

export const BuildHistory = ({ builds = [] }: BuildHistoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "failed":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      case "running":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (builds.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <History className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Keine Build-Historie</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Deine vergangenen Builds werden hier angezeigt.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-3 max-w-4xl mx-auto">
        {builds.map((build) => (
          <div
            key={build.id}
            className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor(build.status)}>
                    {build.status === "success"
                      ? "Erfolgreich"
                      : build.status === "failed"
                      ? "Fehlgeschlagen"
                      : "Läuft"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(build.timestamp)}
                  </span>
                </div>
                <p className="text-sm mb-3 line-clamp-2">{build.prompt}</p>
                <div className="flex flex-wrap gap-2">
                  {build.apkUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={build.apkUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        APK
                      </a>
                    </Button>
                  )}
                  {build.aabUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={build.aabUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        AAB
                      </a>
                    </Button>
                  )}
                  {build.runUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={build.runUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Details
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
