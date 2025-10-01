import { ReactNode } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface ResizableLayoutProps {
  chat: ReactNode;
  main: ReactNode;
}

export const ResizableLayout = ({ chat, main }: ResizableLayoutProps) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        {chat}
      </ResizablePanel>
      
      <ResizableHandle className="w-1 bg-border hover:bg-primary transition-colors duration-200" />
      
      <ResizablePanel defaultSize={75}>
        {main}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};