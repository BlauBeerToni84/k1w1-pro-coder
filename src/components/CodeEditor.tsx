import { useState } from "react";
import { FileCode, Folder, ChevronRight, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

const sampleProject: FileNode = {
  name: "my-project",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "App.tsx", type: "file", content: "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello K1W1 Pro+</h1>\n    </div>\n  );\n}\n\nexport default App;" },
        { name: "index.css", type: "file", content: "body {\n  margin: 0;\n  font-family: sans-serif;\n}" }
      ]
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "index.html", type: "file" }
      ]
    },
    { name: "package.json", type: "file" }
  ]
};

const FileTree = ({ node, level = 0 }: { node: FileNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(level < 2);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 hover:bg-secondary/50 cursor-pointer rounded transition-colors`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => node.type === "folder" && setIsOpen(!isOpen)}
      >
        {node.type === "folder" ? (
          <>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Folder className="w-4 h-4 text-primary" />
          </>
        ) : (
          <FileCode className="w-4 h-4 text-muted-foreground ml-6" />
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileTree key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CodeEditor = () => {
  const [selectedFile] = useState(sampleProject.children?.[0]?.children?.[0]);

  return (
    <div className="flex h-full">
      {/* File Explorer */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold">Projekt-Struktur</h3>
        </div>
        <ScrollArea className="h-[calc(100%-3rem)]">
          <div className="p-2">
            <FileTree node={sampleProject} />
          </div>
        </ScrollArea>
      </div>

      {/* Code View */}
      <div className="flex-1 bg-muted/30">
        {selectedFile ? (
          <>
            <div className="h-10 border-b border-border bg-card px-4 flex items-center">
              <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
            </div>
            <ScrollArea className="h-[calc(100%-2.5rem)]">
              <pre className="p-4 text-sm font-mono">
                <code className="text-foreground">{selectedFile.content}</code>
              </pre>
            </ScrollArea>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Wähle eine Datei aus
          </div>
        )}
      </div>
    </div>
  );
};