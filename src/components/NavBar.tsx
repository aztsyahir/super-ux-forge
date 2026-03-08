import { LayoutDashboard, ExternalLink, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface NavBarProps {
  showTodayToggle?: boolean;
  todayOnly?: boolean;
  onToggleToday?: (val: boolean) => void;
}

export function NavBar({ showTodayToggle = true, todayOnly = true, onToggleToday }: NavBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card shadow-sm">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-foreground text-base">
            mi-<span className="inline-block bg-primary text-primary-foreground rounded px-1">vam</span>
          </span>
        </Link>

        {/* Center controls */}
        {showTodayToggle && (
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1">
            <button
              onClick={() => onToggleToday?.(true)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                todayOnly
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onToggleToday?.(false)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
                !todayOnly
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link to="/group-visits">
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <Users className="h-4 w-4" />
              Group Visits
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2 text-sm">
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-sm">
            <ExternalLink className="h-4 w-4" />
            Mi-TRACK
          </Button>
          <button className="flex items-center gap-2 rounded-full bg-primary p-0.5 pr-2 text-primary-foreground hover:bg-primary/90 transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground text-primary font-semibold text-sm">
              SA
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-tight">Super Admin</p>
              <p className="text-[10px] opacity-80 leading-tight">Administrator</p>
            </div>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </button>
        </div>
      </div>
    </header>
  );
}
