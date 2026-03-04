"use client";

import { useState, useEffect } from "react";
import { HiOutlineViewGrid, HiOutlineClock, HiOutlineCog } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";
import { getHistory } from "./HistoryPage";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { id: "history", label: "History", icon: HiOutlineClock },
  { id: "settings", label: "Settings", icon: HiOutlineCog },
];

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    const calculateDailyUsage = () => {
      const history = getHistory();
      const today = new Date().setHours(0, 0, 0, 0);
      const count = history.filter(
        (entry) => new Date(entry.timestamp).setHours(0, 0, 0, 0) === today
      ).length;
      setDailyCount(count);
    };

    calculateDailyUsage();

    const handleHistoryUpdate = () => calculateDailyUsage();
    window.addEventListener("history-updated", handleHistoryUpdate);

    return () => {
      window.removeEventListener("history-updated", handleHistoryUpdate);
    };
  }, []);

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-sidebar border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
          <HiSparkles className="w-4.5 h-4.5 text-primary" />
        </div>
        <span className="text-sm font-bold tracking-tight text-foreground">
          AI Code Reviewer
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Usage Indicator */}
      <div className="mt-auto px-5 pb-6">
        <div className="text-xs text-text-muted mb-2">Daily Usage</div>
        <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all duration-500"
            style={{ width: `${Math.min((dailyCount / 50) * 100, 100)}%` }}
          />
        </div>
        <div className="text-xs text-text-dim mt-1.5">{dailyCount} Reviews Today</div>
      </div>
    </aside>
  );
}
