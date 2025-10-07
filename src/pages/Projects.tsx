import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Clock, CheckCircle, AlertCircle, MessageSquare, Rocket, Sparkles } from "lucide-react";
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
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

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
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl animate-glow-pulse" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Rocket className="w-12 h-12 text-primary animate-float" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                K1W1 Builder
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Von Prompt zu APK in Sekunden. Deine Idee, deine App, automatisch erstellt.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={() => navigate("/builder")}
                size="lg"
                className="shadow-neon gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Neuer Build
              </Button>
              <Button
                onClick={() => navigate("/chat")}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Classic Chat
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Meine Projekte</h1>
            <p className="text-muted-foreground">
              Erstelle und verwalte deine Android-Apps
            </p>
          </div>
          <Button
            onClick={() => navigate("/chat")}
            size="lg"
            className="shadow-neon"
          >
            <Plus className="w-5 h-5 mr-2" />
            Neue App
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="text-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Plus className="w-16 h-16 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Noch keine Projekte</h2>
              <p className="text-muted-foreground">
                Erstelle deine erste Android-App mit K1W1 Pro+
              </p>
              <Button onClick={() => navigate("/chat")} size="lg" className="mt-4">
                Jetzt starten
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/chat?project=${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        {project.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
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
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fortschritt</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
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
