import { Globe, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function VisitorRegistrationLanding() {
  const [dark, setDark] = useState(false);

  return (
    <div className={`min-h-screen bg-background flex flex-col ${dark ? "dark" : ""}`}>
      {/* Dark mode toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDark(!dark)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-sm hover:bg-muted transition-colors"
        >
          {dark ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
        </button>
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card shadow-sm text-xs font-bold text-muted-foreground">
            MIMOS
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
              mi-
              <span className="rounded bg-primary px-2 py-0.5 text-primary-foreground">vam</span>
            </div>
            <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              Intelligence Visitor Access Management System
            </p>
          </div>
        </div>

        <p className="mb-10 text-lg text-foreground">Pre-register your visit to MIMOS Berhad</p>

        {/* Visitor type cards */}
        <div className="flex w-full max-w-3xl gap-6">
          {/* Malaysian Visitor */}
          <Link to="/register?type=malaysian" className="flex-1">
            <div className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-10 shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
                🇲🇾
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Malaysian Visitor</h2>
              <p className="mb-8 text-center text-sm text-muted-foreground">
                Register your visit with{" "}
                <span className="font-semibold text-primary">MyDigital ID</span>
              </p>
              <div className="mt-auto w-full rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between hover:border-primary transition-colors group-hover:bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    <span className="text-red-500 font-bold">my</span>{" "}
                    <span className="text-blue-600 font-bold italic">digital</span>{" "}
                    <span className="text-blue-800 font-bold italic">ID</span>
                  </span>
                </div>
                <span className="text-sm text-foreground font-medium">Register with MyDigital ID →</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Don't have MyDigital ID?{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Register here
                </a>
              </p>
            </div>
          </Link>

          {/* International Visitor */}
          <Link to="/register?type=international" className="flex-1">
            <div className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-10 shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Globe className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">International Visitor</h2>
              <p className="mb-8 text-center text-sm text-muted-foreground">
                Register your visit as an international guest
              </p>
              <div className="mt-auto w-full rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between hover:border-primary transition-colors group-hover:bg-muted/30">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground font-medium">Register as International Visitor →</span>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center pb-8 text-center">
        <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Powered by</p>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background text-[8px] font-bold">
            M
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground leading-tight">MIMOS</p>
            <p className="text-xs text-muted-foreground leading-tight">SERVICES</p>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">A wholly-owned subsidiary of MIMOS Berhad</p>
      </footer>
    </div>
  );
}
