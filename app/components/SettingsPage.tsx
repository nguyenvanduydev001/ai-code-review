"use client";

import { useState, useEffect } from "react";
import { HiOutlineKey, HiOutlineCheck, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

interface SettingsPageProps {
  onBack: () => void;
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [model, setModel] = useState("gemini-2.0-flash");

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key");
    const storedModel = localStorage.getItem("gemini-model");
    if (storedKey) setApiKey(storedKey);
    if (storedModel) setModel(storedModel);
  }, []);

  const handleSave = () => {
    localStorage.setItem("gemini-api-key", apiKey);
    localStorage.setItem("gemini-model", model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
      <div className="max-w-xl">
        <button
          onClick={onBack}
          className="text-xs text-text-muted hover:text-foreground transition-colors mb-6 cursor-pointer"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-xl font-bold text-foreground mb-1">Settings</h2>
        <p className="text-sm text-text-muted mb-8">
          Configure your API key and preferences.
        </p>

        {/* API Key Section */}
        <div className="rounded-xl bg-surface border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineKey className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Google Gemini API Key</h3>
          </div>
          <p className="text-xs text-text-muted mb-4 leading-relaxed">
            Your API key is stored locally in your browser and never sent to any server other than
            Google&apos;s API. Get your key from{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover underline transition-colors"
            >
              Google AI Studio
            </a>
            .
          </p>

          <div className="relative mb-4">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full px-4 py-3 pr-10 text-sm rounded-lg bg-code-bg border border-border text-foreground placeholder-text-muted/60 focus:outline-none focus:border-primary transition-colors font-mono"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {showKey ? (
                <HiOutlineEyeOff className="w-4 h-4" />
              ) : (
                <HiOutlineEye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Model Selection */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-text-dim mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-lg bg-code-bg border border-border text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
              ${
                saved
                  ? "bg-accent-green/15 text-accent-green"
                  : apiKey.trim()
                  ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25"
                  : "bg-surface text-text-muted cursor-not-allowed"
              }`}
          >
            {saved ? (
              <>
                <HiOutlineCheck className="w-4 h-4" /> Saved!
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>

        {/* Info Card */}
        <div className="rounded-xl bg-primary/5 border border-primary/15 p-5">
          <h4 className="text-sm font-semibold text-primary mb-2">How it works</h4>
          <ul className="space-y-2 text-xs text-text-dim leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              Paste your code in the editor and select a language.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              Click &quot;Review Code&quot; to send it to Google Gemini for analysis.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              Review the AI-detected issues with categorized severity levels.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              Copy individual fixes or apply all suggestions at once.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
