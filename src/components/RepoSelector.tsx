import { useState, useEffect } from "react";
import { GitBranch, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const RepoSelector = () => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [repos, setRepos] = useState<string[]>([]);

  useEffect(() => {
    // Load saved repo or default
    const saved = localStorage.getItem("github-repo") || "BlauBeerToni/Cursor-k1w1-Builder";
    setSelectedRepo(saved);
    
    // Load repo list (could be fetched from GitHub API)
    const savedRepos = localStorage.getItem("github-repos");
    if (savedRepos) {
      setRepos(JSON.parse(savedRepos));
    } else {
      setRepos([saved]);
    }
  }, []);

  const handleRepoChange = (value: string) => {
    setSelectedRepo(value);
    localStorage.setItem("github-repo", value);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg border border-border">
      <GitBranch className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <Select value={selectedRepo} onValueChange={handleRepoChange}>
        <SelectTrigger className="h-8 text-xs sm:text-sm bg-background border-border w-full sm:w-[200px]">
          <SelectValue placeholder="Repository wählen..." />
        </SelectTrigger>
        <SelectContent>
          {repos.map((repo) => (
            <SelectItem key={repo} value={repo} className="text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                {selectedRepo === repo && <Check className="w-3 h-3 text-primary" />}
                <span className="font-mono">{repo}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
