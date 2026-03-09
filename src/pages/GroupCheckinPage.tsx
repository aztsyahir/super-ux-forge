import { useState } from "react";
import { ArrowLeft, Users, Building, Calendar, Mail, Phone, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";

// ─── Mock data (in real app: fetch by id from Supabase) ────────────────────────

const MOCK_GROUPS: Record<string, {
  groupName: string;
  groupId: string;
  picName: string;
  company: string;
  groupSize: number;
  visitDate: string;
  picEmail: string;
  picPhone: string;
  purpose: string;
  host: { name: string; dept: string; phone: string; email: string };
}> = {
  "grp-1": {
    groupName: "UniKL Delegation",
    groupId: "GRP-87091314",
    picName: "Ahmad Zaki",
    company: "UniKL",
    groupSize: 45,
    visitDate: "Mon, 9 Mar 2026 09:00 AM",
    picEmail: "ahmad.zaki@unikl.edu.my",
    picPhone: "0123456789",
    purpose: "Campus Tour",
    host: { name: "Dr. Sarah Lee", dept: "R&D Dept.", phone: "60137996601", email: "sarah.lee@mimos.my" },
  },
  "grp-2": {
    groupName: "Vendor Training Grp",
    groupId: "GRP-87091315",
    picName: "Steven Wong",
    company: "TechVen Sdn Bhd",
    groupSize: 12,
    visitDate: "Mon, 9 Mar 2026 09:15 AM",
    picEmail: "steven@techven.com",
    picPhone: "0129876543",
    purpose: "Vendor Training",
    host: { name: "Maintenance Dept", dept: "Facility Ops", phone: "60137996602", email: "facility@mimos.my" },
  },
  "grp-4": {
    groupName: "School Tour A",
    groupId: "GRP-87091316",
    picName: "Cikgu Murni",
    company: "SMK Keramat",
    groupSize: 30,
    visitDate: "Mon, 9 Mar 2026 10:00 AM",
    picEmail: "murni@smkkeramat.edu.my",
    picPhone: "0111234567",
    purpose: "Educational Tour",
    host: { name: "Public Relations", dept: "Corp Comms", phone: "60137996603", email: "pr@mimos.my" },
  },
  "grp-5": {
    groupName: "MIMOS Board Visit",
    groupId: "GRP-87091317",
    picName: "Dato' Rashid",
    company: "MIMOS Board",
    groupSize: 8,
    visitDate: "Mon, 9 Mar 2026 10:00 AM",
    picEmail: "rashid@mimosboard.my",
    picPhone: "0167890123",
    purpose: "Board Meeting",
    host: { name: "CEO Office", dept: "Executive", phone: "60137996604", email: "ceo@mimos.my" },
  },
};

// ─── Confirmation Modal ────────────────────────────────────────────────────────

function CheckinConfirmModal({
  groupName,
  picName,
  groupSize,
  onConfirm,
  onCancel,
  loading,
}: {
  groupName: string;
  picName: string;
  groupSize: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--success-bg))]">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Confirm Group Check-In</h2>
            <p className="text-xs text-muted-foreground">This action cannot be undone</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Group</span>
              <span className="font-semibold text-foreground">{groupName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">PIC</span>
              <span className="font-semibold text-foreground">{picName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Members to check in</span>
              <span className="font-semibold text-foreground">{groupSize} visitors</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-[hsl(var(--info-border))] bg-[hsl(var(--info-bg))] px-3 py-2.5">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-primary">
              Checking in the PIC will automatically check in all <strong>{groupSize - 1}</strong> approved members of this group.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Check-In
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GroupCheckinPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const group = id ? MOCK_GROUPS[id] : null;

  const handleConfirmCheckin = async () => {
    setLoading(true);
    // Simulate backend call: checkGroupCheckin(id)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setShowConfirm(false);
    navigate("/group-visits");
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-lg font-semibold text-foreground">Group not found</p>
          <Link to="/group-visits">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="px-6 py-6 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/group-visits"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-foreground">Group Check-In</h1>
          {/* Status badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--info-bg))] border border-[hsl(var(--info-border))] px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Approved
          </span>
        </div>

        {/* Info banner */}
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[hsl(var(--info-border))] bg-[hsl(var(--info-bg))] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-primary">Group Visit — PIC Check-In</p>
            <p className="text-xs text-primary/80 mt-0.5">
              Checking in the PIC will automatically check in all {group.groupSize - 1} approved group members.
            </p>
          </div>
        </div>

        {/* Group Details Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
          {/* Header */}
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Group Name</p>
            <p className="text-xl font-bold text-foreground">{group.groupName}</p>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">{group.groupId}</p>
          </div>

          {/* PIC + Company */}
          <div className="grid grid-cols-2 gap-6 px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-muted-foreground">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">PIC Name</p>
                <p className="text-sm font-bold text-foreground">{group.picName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Company</p>
                <p className="text-sm font-bold text-foreground">{group.company}</p>
              </div>
            </div>
          </div>

          {/* Group Size + Visit Date */}
          <div className="grid grid-cols-2 gap-6 px-6 py-4">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Group Size</p>
                <p className="text-sm font-bold text-foreground">{group.groupSize} Members</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Visit Date</p>
                <p className="text-sm font-bold text-foreground">{group.visitDate}</p>
              </div>
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-6 px-6 py-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">PIC Email</p>
                <p className="text-sm font-bold text-foreground">{group.picEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">PIC Phone</p>
                <p className="text-sm font-bold text-foreground">{group.picPhone}</p>
              </div>
            </div>
          </div>

          {/* Host */}
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">Host</p>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="font-bold text-foreground">{group.host.name}</p>
              <p className="text-sm text-muted-foreground">{group.host.dept}</p>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{group.host.phone}</span>
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{group.host.email}</span>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Purpose of Visit</p>
            <p className="text-sm font-semibold text-foreground">{group.purpose}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setShowConfirm(true)}
            className="flex-1 gap-2 h-12 text-base font-semibold bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white"
          >
            <CheckCircle2 className="h-5 w-5" />
            Check In Group
          </Button>
          <Link to="/group-visits">
            <Button variant="outline" className="h-12 px-6">
              Cancel
            </Button>
          </Link>
        </div>
      </main>

      {showConfirm && (
        <CheckinConfirmModal
          groupName={group.groupName}
          picName={group.picName}
          groupSize={group.groupSize}
          onConfirm={handleConfirmCheckin}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
