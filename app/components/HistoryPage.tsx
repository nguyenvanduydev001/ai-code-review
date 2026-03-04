"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlineCode,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineLightBulb,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi2";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  language: string;
  originalCode: string;
  fixedCode: string;
  issues: {
    title: string;
    category: string;
    severity: string;
    line: number;
    description: string;
    suggestion: string;
  }[];
}

interface HistoryPageProps {
  onLoadReview: (code: string, language: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Security: HiOutlineShieldCheck,
  Bug: HiOutlineExclamationCircle,
  "Best Practice": HiOutlineLightBulb,
  Performance: HiOutlineLightningBolt,
  "Code Style": HiOutlineCode,
};

const categoryColors: Record<string, string> = {
  Security: "text-accent-red bg-accent-red/12",
  Bug: "text-accent-orange bg-accent-orange/12",
  "Best Practice": "text-accent-blue bg-accent-blue/12",
  Performance: "text-accent-purple bg-accent-purple/12",
  "Code Style": "text-accent-green bg-accent-green/12",
};

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("review-history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: HistoryEntry) {
  const history = getHistory();
  history.unshift(entry);
  // Keep only last 50 entries
  if (history.length > 50) history.length = 50;
  localStorage.setItem("review-history", JSON.stringify(history));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("history-updated"));
}

export function clearHistory() {
  localStorage.removeItem("review-history");
  if (typeof window !== "undefined") window.dispatchEvent(new Event("history-updated"));
}

export default function HistoryPage({ onLoadReview }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("review-history", JSON.stringify(updated));
    if (typeof window !== "undefined") window.dispatchEvent(new Event("history-updated"));
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No Review History
          </h3>
          <p className="text-sm text-text-muted">
            Your past code reviews will appear here after you apply fixes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Review History</h2>
            <p className="text-sm text-text-muted mt-0.5">
              {history.length} review{history.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-accent-red hover:bg-accent-red/10 transition-colors cursor-pointer"
          >
            <HiOutlineTrash className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>

        <div className="space-y-3">
          {history.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const criticalCount = entry.issues.filter(
              (i) => i.severity === "critical"
            ).length;
            const warningCount = entry.issues.filter(
              (i) => i.severity === "warning"
            ).length;
            const infoCount = entry.issues.filter(
              (i) => i.severity === "info"
            ).length;

            return (
              <div
                key={entry.id}
                className="rounded-xl border border-border bg-surface/50 overflow-hidden transition-all duration-200 hover:border-border-bright"
              >
                {/* Summary Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : entry.id)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/15 text-primary">
                        {entry.language}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {criticalCount > 0 && (
                        <span className="text-[10px] font-semibold text-accent-red">
                          {criticalCount} critical
                        </span>
                      )}
                      {warningCount > 0 && (
                        <span className="text-[10px] font-semibold text-accent-orange">
                          {warningCount} warning
                        </span>
                      )}
                      {infoCount > 0 && (
                        <span className="text-[10px] font-semibold text-accent-blue">
                          {infoCount} info
                        </span>
                      )}
                      <span className="text-[10px] text-text-muted">
                        {entry.issues.length} total issue
                        {entry.issues.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadReview(entry.fixedCode, entry.language);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      title="Load fixed code into editor"
                    >
                      <HiOutlineEye className="w-3 h-3" />
                      Load
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 space-y-3 animate-fade-in">
                    {/* Original Code Preview */}
                    <div>
                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Original Code
                      </p>
                      <pre className="text-[11px] font-mono bg-code-bg rounded-lg p-3 overflow-x-auto text-text-dim max-h-40 border border-border/30">
                        {entry.originalCode}
                      </pre>
                    </div>

                    {/* Issues */}
                    <div>
                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Issues Found
                      </p>
                      <div className="space-y-2">
                        {entry.issues.map((issue, idx) => {
                          const Icon =
                            categoryIcons[issue.category] || HiOutlineCode;
                          const color =
                            categoryColors[issue.category] ||
                            "text-text-muted bg-surface";
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-2.5 rounded-lg bg-surface/50 border border-border/30"
                            >
                              <Icon
                                className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                                  color.split(" ")[0]
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-foreground">
                                    {issue.title}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${color}`}
                                  >
                                    {issue.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-text-dim mt-0.5">
                                  {issue.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fixed Code Preview */}
                    <div>
                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Fixed Code
                      </p>
                      <pre className="text-[11px] font-mono bg-code-bg rounded-lg p-3 overflow-x-auto text-accent-green max-h-40 border border-border/30">
                        {entry.fixedCode}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
