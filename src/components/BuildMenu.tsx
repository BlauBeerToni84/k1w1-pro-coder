import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Smartphone, Monitor, Globe, Package, Settings } from "lucide-react";

interface BuildMenuProps {
  onBuild: (type: "web" | "android" | "ios") => void;
  onConfigClick: () => void;
  isBuilding: boolean;
}

export const BuildMenu = ({ onBuild, onConfigClick, isBuilding }: BuildMenuProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onConfigClick}
        className="gap-2 hover:bg-secondary"
      >
        <Settings className="w-4 h-4" />
        App konfigurieren
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-primary hover:bg-primary/90 shadow-neon transition-all duration-300 hover:scale-105 disabled:opacity-50"
            disabled={isBuilding}
          >
            <Package className="w-4 h-4 mr-2" />
            Build starten
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-border">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Build-Plattform wählen
          </div>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onBuild("web")}
            className="gap-2 cursor-pointer hover:bg-secondary focus:bg-secondary"
          >
            <Globe className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="font-medium">Web-Build</span>
              <span className="text-xs text-muted-foreground">Für Browser-Deployment</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => onBuild("android")}
            className="gap-2 cursor-pointer hover:bg-secondary focus:bg-secondary"
          >
            <Smartphone className="w-4 h-4 text-green-500" />
            <div className="flex flex-col">
              <span className="font-medium">Android APK</span>
              <span className="text-xs text-muted-foreground">Für Android-Geräte</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => onBuild("ios")}
            className="gap-2 cursor-pointer hover:bg-secondary focus:bg-secondary"
          >
            <Monitor className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="font-medium">iOS App</span>
              <span className="text-xs text-muted-foreground">Für iPhone/iPad</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            💡 Tipp: Konfiguriere zuerst deine App-Einstellungen
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};