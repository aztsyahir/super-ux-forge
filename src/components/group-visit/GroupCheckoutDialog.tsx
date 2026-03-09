import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Users, AlertTriangle, Info, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type CheckoutMode = "entire_group" | "pic_only" | "individual";

interface GroupMember {
  id: string;
  name: string;
  passNumber: string;
}

interface GroupCheckoutDialogProps {
  groupPic: string;
  visitId: string;
  totalMembers: number;
  passesCollected: number;
  missingPassIds?: string[];
  members: GroupMember[];
  visitDate: string; // ISO date string e.g. "2026-02-26"
  visitStatus: string;
  checkedOutAt?: string | null;
  onClose: () => void;
  onConfirm: (mode: CheckoutMode, selectedIds?: string[], reason?: string, lateReason?: string) => void;
}

/** Determine if current time is past 17:45 on the same visit date */
function detectLateCheckout(
  visitDate: string,
  visitStatus: string,
  checkedOutAt?: string | null
): boolean {
  if (visitStatus !== "checked_in" || checkedOutAt) return false;
  const visitEnd = new Date(visitDate);
  visitEnd.setHours(17, 45, 0, 0);
  return new Date() > visitEnd;
}

/** Simulate groupCheckoutCascade backend call */
async function groupCheckoutCascade(visitId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`[groupCheckoutCascade] checked out visit ${visitId}`);
}

export function GroupCheckoutDialog({
  groupPic,
  visitId,
  totalMembers,
  passesCollected,
  missingPassIds = [],
  members,
  visitDate,
  visitStatus,
  checkedOutAt,
  onClose,
  onConfirm,
}: GroupCheckoutDialogProps) {
  const navigate = useNavigate();

  const [mode, setMode] = useState<CheckoutMode>("entire_group");
  const [confirmed, setConfirmed] = useState(false);
  const [justification, setJustification] = useState(""); // PIC only
  const [lateCheckoutReason, setLateCheckoutReason] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLateCheckout = detectLateCheckout(visitDate, visitStatus, checkedOutAt);
  const passPercent = totalMembers > 0 ? Math.round((passesCollected / totalMembers) * 100) : 0;
  const remainingMembers = totalMembers - 1; // excluding PIC

  const resetFields = () => {
    setConfirmed(false);
    setJustification("");
    setLateCheckoutReason("");
    setSelectedMembers(new Set());
    setSearch("");
  };

  const handleModeChange = (newMode: CheckoutMode) => {
    setMode(newMode);
    resetFields();
  };

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.passNumber.toLowerCase().includes(search.toLowerCase())
  );

  /** Validation per spec */
  const isCheckoutDisabled = (): boolean => {
    if (isLoading) return true;
    if (mode === "entire_group") {
      if (!confirmed) return true;
      if (isLateCheckout && lateCheckoutReason.trim().length < 10) return true;
      return false;
    }
    if (mode === "pic_only") {
      if (justification.trim().length < 10) return true;
      if (isLateCheckout && lateCheckoutReason.trim().length < 10) return true;
      return false;
    }
    if (mode === "individual") {
      if (selectedMembers.size === 0) return true;
      if (isLateCheckout && lateCheckoutReason.trim().length < 10) return true;
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (mode === "entire_group") {
        await groupCheckoutCascade(visitId);
        onConfirm(mode, [], "", lateCheckoutReason);
        onClose();
        navigate("/group-visits");
      } else {
        onConfirm(
          mode,
          Array.from(selectedMembers),
          mode === "pic_only" ? justification : "",
          lateCheckoutReason
        );
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const modeCards = [
    {
      key: "entire_group" as CheckoutMode,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      iconBg: "bg-info-bg text-primary",
      title: "Checkout Entire Group",
      desc: `Process checkout for the PIC and all ${remainingMembers} remaining members simultaneously.`,
    },
    {
      key: "pic_only" as CheckoutMode,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      iconBg: "bg-orange-50 text-orange-600",
      title: "Checkout PIC Only",
      desc: "For early PIC departure. Remaining members stay checked in and must checkout later.",
    },
    {
      key: "individual" as CheckoutMode,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      iconBg: "bg-success-bg text-success",
      title: "Individual Member",
      desc: "Select specific members to checkout while keeping the rest of the group active.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-card shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-bg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Group Checkout</h2>
              <p className="text-sm text-muted-foreground">Select a checkout method for the group visit.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-sm p-1 opacity-70 hover:opacity-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Late Checkout Banner ───────────────────────────────── */}
        {isLateCheckout && (
          <div className="mx-6 mb-3 flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-3">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-warning">Late Checkout Detected</p>
              <p className="text-xs text-warning/80">
                Current time is past 17:45. A late checkout reason is required before proceeding.
              </p>
            </div>
          </div>
        )}

        {/* ── Visit Info Bar ─────────────────────────────────────── */}
        <div className="mx-6 mb-4 flex items-center rounded-xl bg-muted/40 border border-border px-4 py-3">
          <div className="mr-4 flex items-center gap-3 border-r border-border pr-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {groupPic.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Group PIC</p>
              <p className="text-sm font-bold text-foreground">{groupPic}</p>
            </div>
          </div>
          <div className="mr-auto px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Visit ID</p>
            <p className="text-sm font-mono text-foreground">{visitId}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">Passes Collected</p>
              <p className="text-xs text-muted-foreground">{passesCollected} of {totalMembers} Physical Passes</p>
            </div>
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" width="56" height="56">
                <circle cx="28" cy="28" r="22" stroke="hsl(var(--muted))" strokeWidth="5" fill="none" />
                <circle
                  cx="28" cy="28" r="22"
                  stroke="hsl(var(--primary))"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={2 * Math.PI * 22 * (1 - passPercent / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs font-bold text-primary">{passPercent}%</span>
            </div>
          </div>
        </div>

        {/* ── Checkout Mode Cards ────────────────────────────────── */}
        <div className="mx-6 grid grid-cols-3 gap-3 mb-4">
          {modeCards.map((card) => (
            <button
              key={card.key}
              onClick={() => handleModeChange(card.key)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                mode === card.key
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
              {mode === card.key ? (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="absolute right-3 top-3 h-5 w-5 rounded-full border-2 border-border" />
              )}
              <p className="text-sm font-bold text-foreground">{card.title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">{card.desc}</p>
            </button>
          ))}
        </div>

        {/* ── Individual Member List ─────────────────────────────── */}
        {mode === "individual" && (
          <div className="mx-6 mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Select Members to Checkout
            </p>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search member name or pass number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-lg border border-border divide-y divide-border max-h-48 overflow-y-auto">
              {filteredMembers.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.has(m.id)}
                      onChange={() => toggleMember(m.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Pass #{m.passNumber}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Required Action Section ────────────────────────────── */}
        <div className="mx-6 mb-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Required Action</p>

          {/* Missing passes warning — entire group only */}
          {missingPassIds.length > 0 && mode === "entire_group" && (
            <div className="flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
              <div>
                <p className="text-sm font-semibold text-warning">
                  Missing {missingPassIds.length} Pass{missingPassIds.length > 1 ? "es" : ""}
                </p>
                <p className="text-xs text-warning/80">
                  Please ensure all physical passes are returned before confirming group checkout. Pass
                  {missingPassIds.length > 1 ? "es" : ""}{" "}
                  {missingPassIds.map((p, i) => (
                    <span key={i}>
                      #{p}{i < missingPassIds.length - 1 ? " and " : ""}
                    </span>
                  ))}{" "}
                  {missingPassIds.length > 1 ? "are" : "is"} still outstanding.
                </p>
              </div>
            </div>
          )}

          {/* PIC only — remaining members warning */}
          {mode === "pic_only" && (
            <div className="flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
              <div>
                <p className="text-sm font-semibold text-warning">
                  Warning: {remainingMembers} member{remainingMembers !== 1 ? "s" : ""} will remain checked-in
                </p>
                <p className="text-xs text-warning/80">
                  The group status will update to <strong>Partially Checked Out</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Individual — empty selection hint */}
          {mode === "individual" && selectedMembers.size === 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-info-border bg-info-bg p-3">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">Member Selection</p>
                <p className="text-xs text-primary/80">Please select at least one member to proceed.</p>
              </div>
            </div>
          )}

          {/* ── PIC ONLY: Justification textarea ── */}
          {mode === "pic_only" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Justification <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Enter justification for PIC leaving before the rest of the group."
                className="min-h-[90px]"
              />
              {justification.length > 0 && justification.trim().length < 10 && (
                <p className="mt-1 text-xs text-destructive">Minimum 10 characters required.</p>
              )}
            </div>
          )}

          {/* ── LATE CHECKOUT: Reason textarea (shown for any mode when late) ── */}
          {isLateCheckout && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Reason for Late Checkout <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={lateCheckoutReason}
                onChange={(e) => setLateCheckoutReason(e.target.value)}
                placeholder="Provide reason for late checkout (e.g., meeting extended, delayed transport)."
                className="min-h-[90px]"
              />
              {lateCheckoutReason.length > 0 && lateCheckoutReason.trim().length < 10 && (
                <p className="mt-1 text-xs text-destructive">Minimum 10 characters required.</p>
              )}
            </div>
          )}

          {/* ── Confirmation checkbox (entire_group & pic_only) ── */}
          {mode !== "individual" && (
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {mode === "entire_group"
                    ? `I confirm that all ${totalMembers} visitor passes have been collected.`
                    : "I confirm the PIC pass has been collected."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mode === "entire_group"
                    ? "This action will deactivate all active passes for this group visit."
                    : "This action will only deactivate the PIC's pass."}
                </p>
              </div>
            </label>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            disabled={isCheckoutDisabled()}
            onClick={handleConfirm}
            className="gap-2"
          >
            {isLoading && (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {mode === "entire_group" && "Confirm Group Checkout →"}
            {mode === "pic_only" && "Confirm PIC Checkout →"}
            {mode === "individual" && `Check-Out Selected (${selectedMembers.size}) →`}
          </Button>
        </div>

      </div>
    </div>
  );
}
