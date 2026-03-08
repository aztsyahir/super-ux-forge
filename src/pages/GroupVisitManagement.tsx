import { useState } from "react";
import { Search, Download, Columns, QrCode, ChevronDown, ChevronUp, Bus, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/NavBar";
import { Link } from "react-router-dom";

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
    status: "checked_in",
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
    passesProgress: { done: 0, total: 30 },
    status: "pending_approval",
  },
];

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "bg-[hsl(var(--badge-pending-bg))] text-[hsl(var(--badge-pending-text))]",
  approved: "bg-info-bg text-primary",
  checked_in: "bg-success-bg text-success",
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

function ProgressBar({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold ${pct === 100 ? "text-success" : pct > 0 ? "text-partial" : "text-muted-foreground"}`}>
        {done}/{total}
      </span>
    </div>
  );
}

function QrScanModal({ onClose }: { onClose: () => void }) {
  const [scanning, setScanning] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Scan QR Code</h2>
            <p className="text-sm text-muted-foreground">Point your camera at the visitor's QR code</p>
          </div>
          <button onClick={onClose} className="rounded-sm p-1 opacity-70 hover:opacity-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="flex min-h-[240px] items-center justify-center rounded-xl bg-muted/40 border border-border relative overflow-hidden">
            {scanning ? (
              <>
                <div className="w-full h-full bg-muted/60 flex items-center justify-center text-muted-foreground text-sm">
                  [Camera Feed Active]
                </div>
                {/* Corner brackets */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-card" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-card" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-card" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-card" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <svg className="h-14 w-14 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-muted-foreground">Click "Start Scanning" to begin</p>
                <Button onClick={() => setScanning(true)} className="gap-2 mt-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  Start Scanning
                </Button>
              </div>
            )}
          </div>
          {scanning && (
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="outline" className="flex-1" onClick={() => setScanning(false)}>Stop Scanning</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STAT_CARDS = [
  { label: "Pending Approval", value: 2, color: "text-[hsl(var(--badge-pending-text))]", icon: <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, iconBg: "bg-[hsl(var(--badge-pending-bg))]" },
  { label: "Approved Groups", value: 1, color: "text-primary", icon: <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, iconBg: "bg-info-bg" },
  { label: "Checked In", value: 1, color: "text-success", icon: <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>, iconBg: "bg-success-bg" },
  { label: "Partial Out", value: 1, color: "text-partial", icon: <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>, iconBg: "bg-[hsl(var(--badge-partial-bg))]" },
  { label: "Fully Out", value: 0, color: "text-muted-foreground", icon: <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>, iconBg: "bg-muted" },
  { label: "Bus Transport", value: 3, color: "text-destructive", icon: <Bus className="h-7 w-7" />, iconBg: "bg-red-50" },
];

export default function GroupVisitManagement() {
  const [todayOnly, setTodayOnly] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showQr, setShowQr] = useState(false);

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
            <h1 className="text-2xl font-bold text-foreground">Today's Group Visits</h1>
            <p className="text-sm text-muted-foreground">Manage all large group visits and delegation schedules for today.</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {MOCK_GROUPS.length}{" "}
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Total Groups Today</span>
            </p>
          </div>
          <Button onClick={() => setShowQr(true)} className="gap-2 h-16 px-6 rounded-xl text-base">
            <QrCode className="h-6 w-6" />
            <div className="text-left">
              <p className="font-bold">Scan QR</p>
              <p className="text-xs opacity-80">Quick Check-In</p>
            </div>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-6 gap-3">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Group List */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-foreground">Group List</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {MOCK_GROUPS.length} groups
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by Group Name, PIC..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-56"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="checked_in">Checked In</option>
                <option value="partial_out">Partial Out</option>
                <option value="fully_out">Fully Out</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns className="h-4 w-4" />
                Columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground hover:text-foreground">
                    PIC Name <span className="flex flex-col text-[8px] leading-[6px]"><span>▲</span><span>▼</span></span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Group Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Host</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Transport</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Check-In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Checkout</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Passes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <>
                  <tr key={g.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4">
                      <button onClick={() => toggleExpand(g.id)} className="text-muted-foreground hover:text-foreground">
                        {expanded.has(g.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{g.groupName}</p>
                      <p className="text-xs text-muted-foreground">PIC: {g.picName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{g.groupSize} Visitors</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">{g.host}</p>
                      <p className="text-xs text-muted-foreground">{g.hostDept}</p>
                    </td>
                    <td className="px-4 py-4">
                      {g.transport === "private" ? (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m2 4h3l3 3-3 3h-3v-6z" /></svg>
                          Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                          <Bus className="h-3.5 w-3.5" />
                          {g.transportPlates?.[0] ?? "Bus"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-foreground">{g.checkInTime ?? "–"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <ProgressBar done={g.checkoutProgress.done} total={g.checkoutProgress.total} color="text-partial" />
                    </td>
                    <td className="px-4 py-4">
                      <ProgressBar done={g.passesProgress.done} total={g.passesProgress.total} color="text-primary" />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[g.status]}`}>
                        {STATUS_LABELS[g.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {g.status === "checked_in" && (
                        <Link to={`/group-visits/${g.id}`}>
                          <Button size="sm" className="text-xs px-4">Manage Group</Button>
                        </Link>
                      )}
                      {g.status === "partial_out" && (
                        <Link to={`/group-visits/${g.id}`}>
                          <Button size="sm" variant="outline" className="text-xs px-4 border-primary text-primary">View Status</Button>
                        </Link>
                      )}
                      {g.status === "pending_approval" && (
                        <Link to={`/group-visits/${g.id}`}>
                          <Button size="sm" className="text-xs px-4 bg-[hsl(var(--badge-pending-text))] hover:bg-[hsl(var(--badge-pending-text))]/90 text-white">Review App</Button>
                        </Link>
                      )}
                      {g.status === "approved" && (
                        <Link to={`/group-visits/${g.id}/assign-passes`}>
                          <Button size="sm" className="text-xs px-4">Assign Passes</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                  {expanded.has(g.id) && (
                    <tr key={`${g.id}-expanded`} className="bg-muted/10 border-b border-border">
                      <td colSpan={10} className="px-8 py-4">
                        <p className="text-xs text-muted-foreground italic">
                          Expanded details for {g.groupName} — member list would appear here.
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm text-muted-foreground">
            <span>Showing <strong>1 to {filtered.length}</strong> of <strong>{filtered.length}</strong> results</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled>Previous</Button>
              <Button variant="ghost" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>
      </main>

      {showQr && <QrScanModal onClose={() => setShowQr(false)} />}
    </div>
  );
}
