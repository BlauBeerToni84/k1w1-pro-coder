import { useState } from "react";
import { FileCode, Folder, ChevronRight, ChevronDown, File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor from "@monaco-editor/react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
}

const sampleProject: FileNode = {
  name: "my-project",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { 
          name: "App.tsx", 
          type: "file", 
          language: "typescript",
          content: `import React from 'react';
import './App.css';

function App() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Willkommen bei K1W1 Pro+</h1>
        <p>Counter: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </header>
    </div>
  );
}

export default App;` 
        },
        { 
          name: "index.css", 
          type: "file",
          language: "css",
          content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
}

.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #00d9ff, #0099cc);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}` 
        },
        { 
          name: "utils.ts", 
          type: "file",
          language: "typescript",
          content: `export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};` 
        }
      ]
    },
    {
      name: "public",
      type: "folder",
      children: [
        { 
          name: "index.html", 
          type: "file",
          language: "html",
          content: `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>K1W1 Pro+ App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>` 
        }
      ]
    },
    { 
      name: "package.json", 
      type: "file",
      language: "json",
      content: `{
  "name": "k1w1-pro-app",
  "version": "1.0.0",
  "description": "Built with K1W1 Pro+",
  "main": "index.js",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}` 
    }
  ]
};

const FileTree = ({ 
  node, 
  level = 0,
  onSelect 
}: { 
  node: FileNode; 
  level?: number;
  onSelect: (node: FileNode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(level < 2);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  return (
    <div className="animate-fade-in">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 hover:bg-secondary/50 cursor-pointer rounded transition-all duration-200 hover:translate-x-1`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" ? (
          <>
            <div className="transition-transform duration-200">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <Folder className="w-4 h-4 text-primary animate-glow-pulse" />
          </>
        ) : (
          <>
            <div className="w-4 ml-6" />
            <File className="w-4 h-4 text-muted-foreground" />
          </>
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div className="animate-slide-in">
          {node.children.map((child, idx) => (
            <FileTree key={idx} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CodeEditor = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | undefined>(
    sampleProject.children?.[0]?.children?.[0]
  );

  return (
    <div className="flex h-full">
      {/* File Explorer */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" />
            Projekt-Struktur
          </h3>
        </div>
        <ScrollArea className="h-[calc(100%-3rem)]">
          <div className="p-2">
            <FileTree node={sampleProject} onSelect={setSelectedFile} />
          </div>
        </ScrollArea>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 bg-muted/30">
        {selectedFile ? (
          <>
            <div className="h-10 border-b border-border bg-card px-4 flex items-center gap-2 animate-fade-in">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
            </div>
            <div className="h-[calc(100%-2.5rem)]">
              <Editor
                height="100%"
                language={selectedFile.language || "typescript"}
                value={selectedFile.content}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  fontLigatures: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling: true,
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2 animate-fade-in">
              <FileCode className="w-12 h-12 mx-auto text-primary/50" />
              <p>Wähle eine Datei aus dem Explorer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};