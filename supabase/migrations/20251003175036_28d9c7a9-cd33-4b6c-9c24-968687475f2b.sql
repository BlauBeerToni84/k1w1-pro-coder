-- Tabelle für gespeicherte App-Projekte
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'building',
  progress INTEGER DEFAULT 0,
  apk_url TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies für anonymous Zugriff (da keine Auth implementiert)
CREATE POLICY "Jeder kann seine Projekte sehen"
ON public.projects
FOR SELECT
USING (true);

CREATE POLICY "Jeder kann Projekte erstellen"
ON public.projects
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Jeder kann seine Projekte aktualisieren"
ON public.projects
FOR UPDATE
USING (true);

CREATE POLICY "Jeder kann seine Projekte löschen"
ON public.projects
FOR DELETE
USING (true);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();