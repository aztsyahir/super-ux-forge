import { LayoutDashboard, ExternalLink, ChevronDown, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-0">
              <span className="font-black text-foreground text-xl tracking-tight">mi-</span>
              <span className="font-black text-xl tracking-tight text-white bg-[hsl(var(--nav-brand))] px-1.5 py-0.5 rounded-sm leading-tight">
                vam
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground font-normal tracking-wide mt-0.5">
              Intelligent Visitor Access Management System
            </span>
          </div>
        </Link>

        {/* Center: Today / All toggle */}
        {showTodayToggle && (
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium transition-colors cursor-pointer ${
                todayOnly ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => onToggleToday?.(true)}
            >
              Today
            </span>

            {/* Toggle switch */}
            <button
              role="switch"
              aria-checked={!todayOnly}
              onClick={() => onToggleToday?.(!todayOnly)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                !todayOnly ? "bg-[hsl(var(--nav-brand))]" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform ${
                  !todayOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <span
              className={`text-sm font-medium transition-colors cursor-pointer ${
                !todayOnly ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => onToggleToday?.(false)}
            >
              All
            </span>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-sm font-medium">
            <ExternalLink className="h-4 w-4" />
            Mi-TRACK
          </Button>

          {/* User chip */}
          <button className="flex items-center gap-2 rounded-full bg-[hsl(var(--nav-brand))] pl-0.5 pr-3 py-0.5 text-white hover:opacity-90 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-tight">Super Admin</p>
              <p className="text-[10px] opacity-80 leading-tight">Administrator</p>
            </div>
            <ChevronDown className="h-3 w-3 opacity-70 ml-1" />
          </button>
        </div>

      </div>
    </header>
  );
}
