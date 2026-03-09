import { useState, useEffect, useRef } from "react";
import { Search, Download, Columns, QrCode, ChevronDown, ChevronUp, Bus, Users, X, ScanLine, Keyboard, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/NavBar";
import { Link, useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupRow {
  id: string;
  groupName: string;
  picName: string;
  groupSize: number;
  host: string;
  hostDept: string;
  transport: string;
  transportPlates?: string[];
  checkInTime?: string;
  checkoutProgress: { done: number; total: number };
  passesProgress: { done: number; total: number };
  status: "pending_approval" | "approved" | "checked_in" | "partial_out" | "fully_out";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_GROUPS: GroupRow[] = [
  {
    id: "grp-1",
    groupName: "UniKL Delegation",
    picName: "Ahmad Zaki",
    groupSize: 45,
    host: "Dr. Sarah Lee",
    hostDept: "R&D Dept.",
    transport: "bus",
    transportPlates: ["BNA 4582"],
    checkInTime: "08:45 AM",
    checkoutProgress: { done: 45, total: 45 },
    passesProgress: { done: 45, total: 45 },
    status: "fully_out",
  },
  {
    id: "grp-2",
    groupName: "Vendor Training Grp",
    picName: "Steven Wong",
    groupSize: 12,
    host: "Maintenance Dept",
    hostDept: "Facility Ops",
    transport: "van",
    transportPlates: ["VANS (2)"],
    checkInTime: "09:15 AM",
    checkoutProgress: { done: 6, total: 12 },
    passesProgress: { done: 12, total: 12 },
    status: "partial_out",
  },
  {
    id: "grp-3",
    groupName: "Gov Audit Team",
    picName: "Pn. Faridah",
    groupSize: 5,
    host: "Mr. Tan CK",
    hostDept: "Finance Dept",
    transport: "private",
    checkoutProgress: { done: 0, total: 5 },
    passesProgress: { done: 0, total: 5 },
    status: "pending_approval",
  },
  {
    id: "grp-4",
    groupName: "School Tour A",
    picName: "Cikgu Murni",
    groupSize: 30,
    host: "Public Relations",
    hostDept: "Corp Comms",
    transport: "bus",
    transportPlates: ["PLT 9999"],
    checkoutProgress: { done: 0, total: 30 },
    passesProgress: { done: 28, total: 30 },
    status: "approved",
  },
  {
    id: "grp-5",
    groupName: "MIMOS Board Visit",
    picName: "Dato' Rashid",
    groupSize: 8,
    host: "CEO Office",
    hostDept: "Executive",
    transport: "private",
    checkInTime: "10:00 AM",
    checkoutProgress: { done: 0, total: 8 },
    passesProgress: { done: 8, total: 8 },
    status: "checked_in",
  },
  {
    id: "grp-6",
    groupName: "UTM Research Team",
    picName: "Prof. Azizah",
    groupSize: 15,
    host: "Dr. Kamal",
    hostDept: "AI Research",
    transport: "bus",
    transportPlates: ["UTM 1122"],
    checkInTime: "11:30 AM",
    checkoutProgress: { done: 15, total: 15 },
    passesProgress: { done: 15, total: 15 },
    status: "fully_out",
  },
  {
    id: "grp-7",
    groupName: "Cybersecurity Audit",
    picName: "Encik Farhan",
    groupSize: 4,
    host: "IT Security",
    hostDept: "ICT Division",
    transport: "private",
    checkoutProgress: { done: 0, total: 4 },
    passesProgress: { done: 0, total: 4 },
    status: "pending_approval",
  },
  {
    id: "grp-8",
    groupName: "Industry Collaborators",
    picName: "Ms. Rachel Tan",
    groupSize: 20,
    host: "Biz Dev Team",
    hostDept: "Strategy",
    transport: "van",
    transportPlates: ["VAN 5566"],
    checkoutProgress: { done: 0, total: 20 },
    passesProgress: { done: 18, total: 20 },
    status: "approved",
  },
];

// QR token → group ID map (simulates Supabase lookup)
const QR_TOKEN_MAP: Record<string, string> = {
  "GRP-1-QR": "grp-1",
  "GRP-2-QR": "grp-2",
  "GRP-3-QR": "grp-3",
  "GRP-4-QR": "grp-4",
  "GRP-5-QR": "grp-5",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "bg-[hsl(var(--badge-pending-bg))] text-[hsl(var(--badge-pending-text))]",
  approved: "bg-[hsl(var(--info-bg))] text-primary",
  checked_in: "bg-[hsl(var(--badge-checked-in-bg))] text-[hsl(var(--badge-checked-in-text))]",
  partial_out: "bg-[hsl(var(--badge-partial-bg))] text-[hsl(var(--badge-partial-text))]",
  fully_out: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<string, string> = {
  pending_approval: "Pending Approval",
  approved: "Approved",
  checked_in: "Checked In",
  partial_out: "Partial Out",
  fully_out: "Fully Out",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ done, total, variant }: { done: number; total: number; variant: "checkout" | "pass" }) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  const barColor = variant === "pass"
    ? pct === 100 ? "bg-primary" : pct > 0 ? "bg-primary/60" : "bg-muted-foreground/30"
    : pct === 100 ? "bg-[hsl(var(--success))]" : pct > 0 ? "bg-[hsl(var(--partial))]" : "bg-muted-foreground/30";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${pct === 100 ? "text-[hsl(var(--success))]" : pct > 0 ? "text-[hsl(var(--partial))]" : "text-muted-foreground"}`}>
        {done}/{total}
      </span>
    </div>
  );
}

// ─── QR Scan Modal ────────────────────────────────────────────────────────────

type ScanMode = "camera" | "manual";
type ScanStatus = "idle" | "scanning" | "loading" | "error";
type ScanError = "NOT_FOUND" | "ALREADY_OUT" | "NOT_APPROVED";

const SCAN_ERRORS: Record<ScanError, string> = {
  NOT_FOUND: "QR code not recognised. Please verify the visitor's pass.",
  ALREADY_OUT: "This group has already checked out.",
  NOT_APPROVED: "This visit is not yet approved for check-in.",
};

function QrScanModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [manualToken, setManualToken] = useState("");
  const [scanError, setScanError] = useState<ScanError | null>(null);
  const bufferRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // USB / keyboard-wedge support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) return;
      if (e.key === "Enter") {
        if (bufferRef.current.length > 3) processToken(bufferRef.current.trim());
        bufferRef.current = "";
        if (timerRef.current) clearTimeout(timerRef.current);
        return;
      }
      if (e.key.length === 1) {
        bufferRef.current += e.key;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => { bufferRef.current = ""; }, 300);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processToken = async (token: string) => {
    setScanStatus("loading");
    setScanError(null);
    // Simulate network
    await new Promise((r) => setTimeout(r, 900));

    const groupId = QR_TOKEN_MAP[token.toUpperCase()];
    if (!groupId) {
      setScanError("NOT_FOUND");
      setScanStatus("error");
      return;
    }
    const group = MOCK_GROUPS.find((g) => g.id === groupId);
    if (group?.status === "fully_out") {
      setScanError("ALREADY_OUT");
      setScanStatus("error");
      return;
    }
    if (group?.status === "pending_approval") {
      setScanError("NOT_APPROVED");
      setScanStatus("error");
      return;
    }
    // Success — navigate to group detail
    onClose();
    navigate(`/group-visits/${groupId}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim().length > 3) processToken(manualToken.trim());
  };

  const isLoading = scanStatus === "loading";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <QrCode className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Scan Visitor QR</h2>
              <p className="text-[11px] text-muted-foreground">PIC QR code to open group details</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 self-start">
            <button
              onClick={() => setMode("camera")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${mode === "camera" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Camera className="h-3.5 w-3.5" /> Camera
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${mode === "manual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Keyboard className="h-3.5 w-3.5" /> Manual
            </button>
          </div>

          {/* Scanner area */}
          {mode === "camera" ? (
            <div className="relative w-full aspect-square max-h-56 rounded-xl overflow-hidden border-2 border-dashed border-primary/40 bg-muted/50 flex flex-col items-center justify-center gap-3">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-4 border-muted" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent" style={{ animation: "spin 0.8s linear infinite" }} />
                  </div>
                  <p className="text-xs text-muted-foreground animate-pulse">Looking up visitor…</p>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-36 h-36">
                      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary" />
                      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary" />
                      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary" />
                      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary" />
                      <div className="absolute left-1 right-1 h-0.5 bg-primary/70 rounded-full" style={{ animation: "scan-line 2s ease-in-out infinite" }} />
                    </div>
                  </div>
                  <ScanLine className="h-8 w-8 text-primary/20 z-10" />
                  <p className="text-[11px] text-muted-foreground z-10">Position PIC QR inside frame</p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">QR Token / Visitor ID</label>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="e.g. GRP-5-QR"
                  className="flex-1 font-mono text-sm"
                  disabled={isLoading}
                />
                <Button type="submit" size="sm" disabled={isLoading || manualToken.trim().length < 4}>
                  {isLoading ? "…" : "Go"}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">USB barcode scanner also works here</p>
            </form>
          )}

          {/* Error */}
          {scanStatus === "error" && scanError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive">{SCAN_ERRORS[scanError]}</p>
            </div>
          )}

          {/* Hint */}
          {scanStatus === "idle" && (
            <p className="text-center text-[10px] text-muted-foreground/70">
              Try tokens: <span className="font-mono">GRP-2-QR</span>, <span className="font-mono">GRP-5-QR</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat cards config ────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label: "Pending Approval", key: "pending_approval",
    color: "text-[hsl(var(--badge-pending-text))]",
    iconBg: "bg-[hsl(var(--badge-pending-bg))]",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    label: "Approved", key: "approved",
    color: "text-primary",
    iconBg: "bg-[hsl(var(--info-bg))]",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: "Checked In", key: "checked_in",
    color: "text-[hsl(var(--success))]",
    iconBg: "bg-[hsl(var(--success-bg))]",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" /></svg>,
  },
  {
    label: "Partial Out", key: "partial_out",
    color: "text-[hsl(var(--partial))]",
    iconBg: "bg-[hsl(var(--badge-partial-bg))]",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>,
  },
  {
    label: "Fully Out", key: "fully_out",
    color: "text-muted-foreground",
    iconBg: "bg-muted",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  },
  {
    label: "Bus Transport", key: "bus",
    color: "text-destructive",
    iconBg: "bg-destructive/10",
    icon: <Bus className="h-6 w-6" />,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GroupVisitManagement() {
  const [todayOnly, setTodayOnly] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showQr, setShowQr] = useState(false);

  const statCounts = {
    pending_approval: MOCK_GROUPS.filter((g) => g.status === "pending_approval").length,
    approved: MOCK_GROUPS.filter((g) => g.status === "approved").length,
    checked_in: MOCK_GROUPS.filter((g) => g.status === "checked_in").length,
    partial_out: MOCK_GROUPS.filter((g) => g.status === "partial_out").length,
    fully_out: MOCK_GROUPS.filter((g) => g.status === "fully_out").length,
    bus: MOCK_GROUPS.filter((g) => g.transport === "bus").length,
  };

  const filtered = MOCK_GROUPS.filter((g) => {
    const matchSearch =
      g.groupName.toLowerCase().includes(search.toLowerCase()) ||
      g.picName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar todayOnly={todayOnly} onToggleToday={setTodayOnly} />

      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Group Visit Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {todayOnly ? "Today's" : "All"} group visits — manage check-ins, passes and checkouts.
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {MOCK_GROUPS.length}{" "}
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Total Groups{todayOnly ? " Today" : ""}
              </span>
            </p>
          </div>
          <Button
            onClick={() => setShowQr(true)}
            className="gap-2.5 h-14 px-6 rounded-xl text-sm font-semibold"
          >
            <QrCode className="h-5 w-5" />
            <div className="text-left">
              <p className="font-bold leading-tight">Scan QR</p>
              <p className="text-xs opacity-80 leading-tight">Quick Check-In</p>
            </div>
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {STAT_CARDS.map((card) => {
            const count = statCounts[card.key as keyof typeof statCounts];
            return (
              <button
                key={card.key}
                onClick={() => setStatusFilter(card.key === "bus" ? "all" : (statusFilter === card.key ? "all" : card.key))}
                className={`rounded-xl border border-border bg-card p-4 shadow-sm text-left transition-all hover:shadow-md ${statusFilter === card.key ? "ring-2 ring-primary/40" : ""}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-snug">{card.label}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className={`text-3xl font-bold ${card.color}`}>{count}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Group List Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-foreground text-sm">Group List</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {filtered.length} of {MOCK_GROUPS.length}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search group / PIC…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-52 h-8 text-xs"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="checked_in">Checked In</option>
                <option value="partial_out">Partial Out</option>
                <option value="fully_out">Fully Out</option>
              </select>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Columns className="h-3.5 w-3.5" /> Columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Group / PIC</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Host</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Transport</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check-In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Checkout</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Passes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No groups match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <>
                    <tr key={g.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      {/* Expand */}
                      <td className="px-4 py-4">
                        <button onClick={() => toggleExpand(g.id)} className="text-muted-foreground hover:text-foreground">
                          {expanded.has(g.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </td>

                      {/* Group / PIC */}
                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground text-sm">{g.groupName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">PIC: {g.picName}</p>
                      </td>

                      {/* Size */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground text-sm">{g.groupSize}</span>
                        </div>
                      </td>

                      {/* Host */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground text-sm">{g.host}</p>
                        <p className="text-xs text-muted-foreground">{g.hostDept}</p>
                      </td>

                      {/* Transport */}
                      <td className="px-4 py-4">
                        {g.transport === "private" ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                            Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                            <Bus className="h-3 w-3" />
                            {g.transportPlates?.[0] ?? g.transport}
                          </span>
                        )}
                      </td>

                      {/* Check-in time */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-foreground tabular-nums">
                          {g.checkInTime ?? <span className="text-muted-foreground">—</span>}
                        </span>
                      </td>

                      {/* Checkout progress */}
                      <td className="px-4 py-4">
                        <ProgressBar done={g.checkoutProgress.done} total={g.checkoutProgress.total} variant="checkout" />
                      </td>

                      {/* Pass progress */}
                      <td className="px-4 py-4">
                        <ProgressBar done={g.passesProgress.done} total={g.passesProgress.total} variant="pass" />
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[g.status]}`}>
                          {STATUS_LABELS[g.status]}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4">
                        <ActionButton group={g} />
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expanded.has(g.id) && (
                      <tr key={`${g.id}-exp`} className="bg-muted/10 border-b border-border">
                        <td colSpan={10} className="px-10 py-3">
                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span><span className="font-semibold text-foreground">Visit Date:</span> {new Date().toLocaleDateString("en-MY")}</span>
                            <span><span className="font-semibold text-foreground">Transport:</span> {g.transport} {g.transportPlates?.join(", ")}</span>
                            <span><span className="font-semibold text-foreground">Group Size:</span> {g.groupSize} visitors</span>
                            <span><span className="font-semibold text-foreground">Checkout:</span> {g.checkoutProgress.done}/{g.checkoutProgress.total} out</span>
                            <Link to={`/group-visits/${g.id}`} className="ml-auto text-primary hover:underline font-medium">
                              View full details →
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span>Showing <strong>{filtered.length}</strong> of <strong>{MOCK_GROUPS.length}</strong> groups</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>Previous</Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>Next</Button>
            </div>
          </div>
        </div>
      </main>

      {showQr && <QrScanModal onClose={() => setShowQr(false)} />}
    </div>
  );
}

// ─── Action button per status ─────────────────────────────────────────────────

function ActionButton({ group }: { group: GroupRow }) {
  if (group.status === "checked_in") return (
    <Link to={`/group-visits/${group.id}`}>
      <Button size="sm" className="h-7 text-xs px-3">Manage</Button>
    </Link>
  );
  if (group.status === "partial_out") return (
    <Link to={`/group-visits/${group.id}`}>
      <Button size="sm" variant="outline" className="h-7 text-xs px-3 border-[hsl(var(--partial))] text-[hsl(var(--partial))]">View Status</Button>
    </Link>
  );
  if (group.status === "pending_approval") return (
    <Link to={`/group-visits/${group.id}`}>
      <Button size="sm" className="h-7 text-xs px-3 bg-[hsl(var(--badge-pending-text))] hover:bg-[hsl(var(--badge-pending-text))]/90 text-white">Review</Button>
    </Link>
  );
  if (group.status === "approved") return (
    <Link to={`/group-visits/${group.id}/assign-passes`}>
      <Button size="sm" className="h-7 text-xs px-3">Assign Passes</Button>
    </Link>
  );
  if (group.status === "fully_out") return (
    <Link to={`/group-visits/${group.id}`}>
      <Button size="sm" variant="ghost" className="h-7 text-xs px-3 text-muted-foreground">View Record</Button>
    </Link>
  );
  return null;
}
