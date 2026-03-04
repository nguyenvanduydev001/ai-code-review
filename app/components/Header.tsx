"use client";

import { HiOutlineFolder } from "react-icons/hi";
import { HiUserCircle } from "react-icons/hi2";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-surface/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        {/* Intentionally left for breadcrumb area */}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface text-xs text-text-dim">
          <HiOutlineFolder className="w-3.5 h-3.5" />
          <span>Project: <strong className="text-foreground">MyProject</strong></span>
        </div>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="text-right">
            <div className="text-xs font-medium text-foreground">Developer</div>
            <div className="text-[10px] text-text-muted">Pro Plan</div>
          </div>
          <HiUserCircle className="w-8 h-8 text-text-muted" />
        </div>
      </div>
    </header>
  );
}
