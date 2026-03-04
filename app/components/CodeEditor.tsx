"use client";

import { HiOutlineCode } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
];

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onReview: () => void;
  isLoading: boolean;
}

export default function CodeEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onReview,
  isLoading,
}: CodeEditorProps) {
  const lineCount = code.split("\n").length;

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <HiOutlineCode className="w-4 h-4 text-primary" />
          Code Editor
        </div>
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none pr-7"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            onClick={onReview}
            disabled={isLoading || !code.trim()}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer
              ${
                isLoading || !code.trim()
                  ? "bg-surface text-text-muted cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40"
              }`}
          >
            <HiSparkles className="w-3.5 h-3.5" />
            {isLoading ? "Analyzing..." : "Review Code"}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        {/* macOS dots */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50">
          <div className="w-3 h-3 rounded-full bg-accent-red/80" />
          <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
          <div className="w-3 h-3 rounded-full bg-accent-green/80" />
          <span className="ml-3 text-xs text-text-muted font-mono">
            {language.toLowerCase()}.review
          </span>
        </div>

        <div className="flex h-[calc(100%-40px)] overflow-auto bg-code-bg">
          {/* Line numbers */}
          <div className="flex flex-col items-end px-4 py-4 text-xs font-mono text-text-muted/40 select-none border-r border-border/30 min-w-[3rem]">
            {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
              <div key={i} className="leading-[1.7] h-[1.7em]">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code input */}
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="// Paste your code here for AI analysis..."
            className="code-editor flex-1 p-4 min-h-[400px] w-full"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
