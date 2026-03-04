"use client";

import {
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineLightBulb,
  HiOutlineLightningBolt,
  HiOutlineCode,
} from "react-icons/hi";
import { HiSparkles, HiClipboardDocument } from "react-icons/hi2";
import { useState } from "react";

export interface ReviewIssue {
  title: string;
  category: "Security" | "Bug" | "Best Practice" | "Performance" | "Code Style";
  severity: "critical" | "warning" | "info";
  line: number;
  description: string;
  suggestion: string;
}

interface ReviewPanelProps {
  issues: ReviewIssue[];
  isLoading: boolean;
  error: string | null;
  onApplyFixes: (fixedCode: string) => void;
  onSaveToHistory: (originalCode: string, fixedCode: string, issues: ReviewIssue[]) => void;
  currentCode: string;
}

const categoryConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; badge: string }
> = {
  Security: {
    icon: HiOutlineShieldCheck,
    color: "text-accent-red",
    bg: "bg-accent-red/8",
    badge: "bg-accent-red/15 text-accent-red",
  },
  Bug: {
    icon: HiOutlineExclamationCircle,
    color: "text-accent-orange",
    bg: "bg-accent-orange/8",
    badge: "bg-accent-orange/15 text-accent-orange",
  },
  "Best Practice": {
    icon: HiOutlineLightBulb,
    color: "text-accent-blue",
    bg: "bg-accent-blue/8",
    badge: "bg-accent-blue/15 text-accent-blue",
  },
  Performance: {
    icon: HiOutlineLightningBolt,
    color: "text-accent-purple",
    bg: "bg-accent-purple/8",
    badge: "bg-accent-purple/15 text-accent-purple",
  },
  "Code Style": {
    icon: HiOutlineCode,
    color: "text-accent-green",
    bg: "bg-accent-green/8",
    badge: "bg-accent-green/15 text-accent-green",
  },
};

export default function ReviewPanel({ issues, isLoading, error, onApplyFixes, onSaveToHistory, currentCode }: ReviewPanelProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);

  const copySuggestion = (suggestion: string, idx: number) => {
    navigator.clipboard.writeText(suggestion);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const applyAllFixes = () => {
    // Build the fixed code by replacing lines referenced by each issue
    let fixedCode = currentCode;
    const lines = fixedCode.split("\n");

    // Sort issues by line number descending so replacements don't shift line indices
    const sorted = [...issues].filter(i => i.line > 0 && i.suggestion).sort((a, b) => b.line - a.line);

    for (const issue of sorted) {
      const lineIdx = issue.line - 1;
      if (lineIdx >= 0 && lineIdx < lines.length) {
        // Replace the line with the suggestion
        const suggestionLines = issue.suggestion.split("\n");
        lines.splice(lineIdx, 1, ...suggestionLines);
      }
    }

    fixedCode = lines.join("\n");
    onApplyFixes(fixedCode);
    onSaveToHistory(currentCode, fixedCode, issues);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="flex flex-col w-80 min-w-[320px] border-l border-border bg-surface/30">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <HiSparkles className="w-4 h-4 text-primary" />
          AI Analysis
        </div>
        {issues.length > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary/15 text-primary">
            {issues.length} Issue{issues.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl p-4 loading-shimmer h-32" />
            ))}
          </div>
        )}

        {error && (
          <div className="animate-fade-in rounded-xl bg-accent-red/8 border border-accent-red/20 p-4">
            <p className="text-xs text-accent-red font-medium">{error}</p>
          </div>
        )}

        {!isLoading && !error && issues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
              <HiOutlineCode className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">No analysis yet</p>
            <p className="text-xs text-text-muted/60 mt-1">
              Paste code and click Review
            </p>
          </div>
        )}

        {!isLoading &&
          issues.map((issue, idx) => {
            const config = categoryConfig[issue.category] || categoryConfig["Bug"];
            const Icon = config.icon;
            return (
              <div
                key={idx}
                className={`animate-slide-in rounded-xl border border-border/50 ${config.bg} p-4 transition-all duration-200 hover:border-border-bright`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Issue Header */}
                <div className="flex items-start gap-2 mb-2">
                  <Icon className={`w-4 h-4 mt-0.5 ${config.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground leading-tight">
                      {issue.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${config.badge}`}
                      >
                        {issue.category}
                      </span>
                      {issue.line > 0 && (
                        <span className="text-[10px] text-text-muted">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-text-dim leading-relaxed mt-2 mb-3">
                  {issue.description}
                </p>

                {/* Suggestion */}
                {issue.suggestion && (
                  <div className="relative group">
                    <pre className="text-[11px] font-mono leading-relaxed bg-code-bg/80 rounded-lg p-3 overflow-x-auto text-accent-green border border-border/30">
                      <span className="text-text-muted select-none">+ </span>
                      {issue.suggestion}
                    </pre>
                    <button
                      onClick={() => copySuggestion(issue.suggestion, idx)}
                      className="absolute top-2 right-2 p-1 rounded-md bg-surface/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Copy suggestion"
                    >
                      <HiClipboardDocument
                        className={`w-3.5 h-3.5 ${
                          copiedIdx === idx ? "text-accent-green" : "text-text-muted"
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Apply All Fixes */}
      {issues.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-border">
          <button
            onClick={applyAllFixes}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 shadow-lg cursor-pointer ${
              applied
                ? "bg-accent-green/15 text-accent-green shadow-accent-green/10"
                : "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
            }`}
          >
            <HiSparkles className="w-3.5 h-3.5" />
            {applied ? "✓ Fixes Applied!" : "Apply All Fixes"}
          </button>
        </div>
      )}
    </div>
  );
}
