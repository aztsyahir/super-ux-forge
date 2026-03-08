import { useState } from "react";
import { ArrowLeft, CheckCircle, Info, Users, Mail, Phone, Calendar, Building, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { GroupCheckoutDialog } from "@/components/group-visit/GroupCheckoutDialog";

const MOCK_GROUP = {
  id: "grp-1",
  groupName: "UniKL Delegation",
  groupId: "GRP-87091314",
  picName: "KHAIRIL ANAS MD REZALI",
  company: "UNIVERSITI PUTRA MALAYSIA",
  groupSize: 15,
  visitDate: "Thurs, 26 Feb 2026 10:30 AM",
  createdDate: "Thurs, 26 Feb 2026 8:50 AM",
  picEmail: "khairilanas@upm.edu.my",
  picPhone: "0133416598",
  purpose: "Meeting",
  host: {
    name: "Dr. Tuan Ahmad Zahidi Tuan Abdul Rahman",
    dept: "Technical Operations (MIMOS Berhad)",
    phone: "60137996604",
    email: "zahidi.rahman@mimos.my",
  },
  status: "checked_in" as const,
  checkInTime: "26 Feb 2026 10:22 AM",
  checkoutProgress: { done: 13, total: 15 },
  preAssignedPasses: 15,
  members: [
    { id: "1", name: "Sarah Smith", passNumber: "4292" },
    { id: "2", name: "Lim Wei", passNumber: "4293" },
    { id: "3", name: "Marcus Johnson", passNumber: "4294" },
    { id: "4", name: "Emily Chen", passNumber: "4296" },
    { id: "5", name: "Ahmad Rizal", passNumber: "4297" },
    { id: "6", name: "Nur Farah", passNumber: "4298" },
  ],
};

export default function GroupInformationPage() {
  const { id } = useParams();
  const group = MOCK_GROUP;
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const checkoutPct = Math.round((group.checkoutProgress.done / group.checkoutProgress.total) * 100);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="px-6 py-6 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Link to="/group-visits" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Group Management
        </Link>

        <h1 className="mb-4 text-2xl font-bold text-foreground">Group Information</h1>

        {/* Group Details Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-bold text-foreground text-lg">Group Details</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
              <CheckCircle className="h-3.5 w-3.5" />
              Active Visit
            </span>
          </div>

          {/* Group check-in info banner */}
          <div className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-info-border bg-info-bg p-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-primary">Group Visit: PIC Check-In</p>
              <p className="text-xs text-primary/80">This will automatically check-in {group.groupSize - 1} other members.</p>
            </div>
          </div>

          <div className="p-6 space-y-0">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-6 border-b border-border pb-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">PIC Name</p>
                  <p className="text-sm font-bold text-foreground">{group.picName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Group ID</p>
                  <p className="text-sm font-bold text-foreground font-mono">{group.groupId}</p>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-6 border-b border-border py-5">
              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Company</p>
                  <p className="text-sm font-bold text-foreground">{group.company}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Group Size</p>
                  <p className="text-sm font-bold text-foreground">{group.groupSize} Members</p>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-6 border-b border-border py-5">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Visit Date</p>
                  <p className="text-sm font-bold text-foreground">{group.visitDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Created Date</p>
                  <p className="text-sm font-bold text-foreground">{group.createdDate}</p>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-6 border-b border-border py-5">
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

            {/* Purpose */}
            <div className="border-b border-border py-5">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Purpose</p>
                  <p className="text-sm font-bold text-foreground">{group.purpose}</p>
                </div>
              </div>
            </div>

            {/* Host */}
            <div className="py-5 border-b border-border">
              <div className="flex items-start gap-3 mb-3">
                <svg className="mt-0.5 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Host</p>
              </div>
              <div className="ml-7 rounded-lg border border-border bg-muted/20 p-4">
                <p className="font-bold text-foreground">{group.host.name}</p>
                <p className="text-sm text-muted-foreground">{group.host.dept}</p>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{group.host.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{group.host.email}</span>
                </div>
              </div>
            </div>

            {/* Visit Timeline & Checkout Progress */}
            <div className="pt-5">
              <h3 className="mb-3 font-bold text-foreground">Visit Timeline</h3>
              <p className="flex items-center gap-2 text-sm font-medium text-success">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Checked in: {group.checkInTime}
              </p>

              <div className="mt-4 rounded-xl bg-muted/30 border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Checkout Progress</p>
                <p className="text-sm font-semibold text-partial">
                  <span className="text-xl">{group.checkoutProgress.done}</span>/{group.checkoutProgress.total} Members Checked In
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-partial" style={{ width: `${checkoutPct}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{checkoutPct}%</span>
                </div>
              </div>

              {/* Group Summary */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total Members</p>
                  <p className="text-xl font-bold text-foreground mt-1">{group.groupSize}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pre-Assigned Passes</p>
                  <p className="text-xl font-bold text-foreground mt-1">{group.preAssignedPasses}/{group.groupSize}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setShowCheckout(true)}
            className="gap-2 bg-partial hover:bg-partial/90"
            disabled={checkoutDone}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {checkoutDone ? "Group Checked Out" : "Check Out Group"}
          </Button>
          <Link to={`/group-visits/${id}/assign-passes`}>
            <Button variant="outline" className="gap-2">
              <QrCode className="h-4 w-4" />
              Assign Passes
            </Button>
          </Link>
        </div>
      </main>

      {showCheckout && (
        <GroupCheckoutDialog
          groupPic={group.picName}
          visitId={group.groupId}
          totalMembers={group.groupSize}
          passesCollected={group.preAssignedPasses - 2}
          missingPassIds={["4291", "4295"]}
          members={group.members}
          onClose={() => setShowCheckout(false)}
          onConfirm={() => {
            setShowCheckout(false);
            setCheckoutDone(true);
          }}
        />
      )}
    </div>
  );
}
