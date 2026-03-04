"use client";

import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ReviewPanel, { ReviewIssue } from "./components/ReviewPanel";
import SettingsPage from "./components/SettingsPage";
import HistoryPage, { saveToHistory } from "./components/HistoryPage";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = useCallback(async () => {
    const apiKey = localStorage.getItem("gemini-api-key");
    if (!apiKey) {
      setError("Please add your Gemini API key in Settings first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIssues([]);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to review code.");
        return;
      }

      setIssues(data.issues || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  const handleSaveToHistory = useCallback(
    (originalCode: string, fixedCode: string, reviewIssues: ReviewIssue[]) => {
      saveToHistory({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        language,
        originalCode,
        fixedCode,
        issues: reviewIssues,
      });
    },
    [language]
  );

  const handleLoadReview = useCallback((loadedCode: string, loadedLanguage: string) => {
    setCode(loadedCode);
    setLanguage(loadedLanguage);
    setIssues([]);
    setError(null);
    setActivePage("dashboard");
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        {activePage === "settings" ? (
          <SettingsPage onBack={() => setActivePage("dashboard")} />
        ) : activePage === "history" ? (
          <HistoryPage onLoadReview={handleLoadReview} />
        ) : (
          <div className="flex flex-1 min-h-0">
            <CodeEditor
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onReview={handleReview}
              isLoading={isLoading}
            />
            <ReviewPanel
              issues={issues}
              isLoading={isLoading}
              error={error}
              currentCode={code}
              onApplyFixes={setCode}
              onSaveToHistory={handleSaveToHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
