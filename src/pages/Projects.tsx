import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Clock, CheckCircle, AlertCircle, MessageSquare, Rocket, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { SettingsDialog } from "@/components/SettingsDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const createNewProject = async () => {
    setIsCreating(true);
    try {
      // Simple navigation to builder - creation happens there
      navigate("/builder");
    } finally {
      setIsCreating(false);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Projekt gelöscht",
        description: "Das Projekt wurde erfolgreich entfernt.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "building":
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSettingsClick={() => setShowSettings(true)} />
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      
      <main className="flex-1 p-3 sm:p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl animate-glow-pulse" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Rocket className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary animate-float" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
                K1W1 Builder
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              Von Prompt zu APK in Sekunden. Deine Idee, deine App, automatisch erstellt.
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap px-4">
              <Button
                onClick={() => navigate("/builder")}
                size="lg"
                className="shadow-neon gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Neuer Build
              </Button>
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                variant="outline"
                className="gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Classic Chat
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Meine Projekte</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Erstelle und verwalte deine Android-Apps
            </p>
          </div>
          <Button
            onClick={() => navigate("/chat")}
            className="shadow-neon w-full sm:w-auto h-10 sm:h-11"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Neue App
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-5 sm:h-6 bg-muted rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-16 sm:h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="text-center p-8 sm:p-12">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <Plus className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
              <h2 className="text-xl sm:text-2xl font-semibold">Noch keine Projekte</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Erstelle deine erste Android-App mit K1W1 Pro+
              </p>
              <Button onClick={() => navigate("/chat")} className="mt-2 sm:mt-4 h-10 sm:h-11">
                Jetzt starten
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/chat?project=${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg md:text-xl mb-2 flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        <span className="line-clamp-1">{project.name}</span>
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                        {project.description || project.prompt}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="text-destructive hover:text-destructive/90 h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Fortschritt</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                      Zuletzt bearbeitet:{" "}
                      {new Date(project.updated_at).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
