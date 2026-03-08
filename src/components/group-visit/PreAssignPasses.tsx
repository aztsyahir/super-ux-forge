import { useState } from "react";
import { X, Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PassOption {
  id: string;
  label: string;
  available: boolean;
}

interface AssignPassDialogProps {
  memberName: string;
  availablePasses: PassOption[];
  onClose: () => void;
  onConfirm: (passId: string) => void;
}

export function AssignPassDialog({ memberName, availablePasses, onClose, onConfirm }: AssignPassDialogProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = availablePasses.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card shadow-2xl">
        <div className="p-6">
          <h2 className="text-lg font-bold text-foreground">
            Assign Pass to{" "}
            <span className="text-primary">{memberName}</span>
          </h2>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Select Physical Pass</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={selected ? availablePasses.find(p => p.id === selected)?.label ?? "Search..." : "Search pass..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="mt-1 rounded-lg border border-border divide-y divide-border max-h-48 overflow-y-auto">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  disabled={!p.available}
                  onClick={() => p.available && setSelected(p.id)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${
                    !p.available
                      ? "cursor-not-allowed opacity-50 text-muted-foreground"
                      : selected === p.id
                      ? "bg-primary/5 text-primary"
                      : "hover:bg-muted/30 text-foreground"
                  }`}
                >
                  <span className="font-medium">{p.label} {p.available ? "(Available)" : "(Assigned)"}</span>
                  <div className="flex items-center gap-2">
                    {!p.available && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Assigned</span>
                    )}
                    {selected === p.id && (
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={!selected} onClick={() => selected && onConfirm(selected)}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ---- Pre-Assign Passes Page ----
interface GroupMemberPass {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
  passId?: string;
  isPic?: boolean;
}

interface PreAssignPassesPageProps {
  groupName: string;
  visitId: string;
  hostName: string;
  members: GroupMemberPass[];
  onBack: () => void;
  onSave: (assignments: Record<string, string>) => void;
}

const AVAILABLE_PASSES: PassOption[] = [
  { id: "1042", label: "Pass #1042", available: false },
  { id: "1043", label: "Pass #1043", available: false },
  { id: "1044", label: "Pass #1044", available: true },
  { id: "1045", label: "Pass #1045", available: true },
  { id: "1046", label: "Pass #1046", available: true },
  { id: "1047", label: "Pass #1047", available: false },
  { id: "1048", label: "Pass #1048", available: true },
  { id: "1049", label: "Pass #1049", available: true },
];

export function PreAssignPassesPage({ groupName, visitId, hostName, members: initialMembers, onBack, onSave }: PreAssignPassesPageProps) {
  const [members, setMembers] = useState<GroupMemberPass[]>(initialMembers);
  const [assigningFor, setAssigningFor] = useState<GroupMemberPass | null>(null);

  const assigned = members.filter((m) => m.passId).length;
  const total = members.length;
  const pct = Math.round((assigned / total) * 100);

  const handleAssign = (passId: string) => {
    if (!assigningFor) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === assigningFor.id ? { ...m, passId } : m))
    );
    setAssigningFor(null);
  };

  const handleUnassign = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, passId: undefined } : m)));
  };

  const assignments = Object.fromEntries(members.filter((m) => m.passId).map((m) => [m.id, m.passId!]));

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-foreground">
            Assign Passes for Group: <span className="text-foreground">{groupName}</span>
          </h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Visit ID: {visitId}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Host: {hostName}
            </span>
          </div>

          {/* Summary cards */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-bg">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Group Size</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{total} Members</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg">
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{assigned}/{total}</p>
              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground w-8">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Member Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">ID Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Pass Assignment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                        {m.isPic && (
                          <span className="rounded-full bg-info-bg px-2 py-0.5 text-[10px] font-semibold text-primary">PIC</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{m.idNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.phone}</td>
                    <td className="px-4 py-3">
                      {m.passId ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          Pass #{m.passId}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                          Not Assigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {m.passId ? (
                        <button
                          onClick={() => handleUnassign(m.id)}
                          className="flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/5 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                        >
                          <Minus className="h-3 w-3" />
                          Unassign
                        </button>
                      ) : (
                        <button
                          onClick={() => setAssigningFor(m)}
                          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <Plus className="h-3 w-3" />
                          Assign Pass
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All passes must be returned at checkout. Partial assignment is allowed.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack}>Cancel</Button>
              <Button onClick={() => onSave(assignments)} className="gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Assignments
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Pass Sub-Modal */}
      {assigningFor && (
        <AssignPassDialog
          memberName={assigningFor.name}
          availablePasses={AVAILABLE_PASSES}
          onClose={() => setAssigningFor(null)}
          onConfirm={handleAssign}
        />
      )}
    </div>
  );
}
