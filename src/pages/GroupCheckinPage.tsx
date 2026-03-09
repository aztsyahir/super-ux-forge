import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  RefreshCcw,
  QrCode,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "@/components/NavBar";
import { QRScannerInput } from "@/components/group-visit/QRScannerInput";
import {
  CheckinResultCard,
  type CheckinResult,
} from "@/components/group-visit/CheckinResultCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanState = "idle" | "loading" | "success" | "error";

type ErrorKind =
  | "NOT_GROUP"
  | "ALREADY_CHECKED_IN"
  | "EXPIRED"
  | "INVALID"
  | "UNKNOWN";

const ERROR_MESSAGES: Record<ErrorKind, string> = {
  NOT_GROUP: "This visit is not registered as a group visit.",
  ALREADY_CHECKED_IN: "This group has already checked in.",
  EXPIRED: "This visit request is no longer valid.",
  INVALID: "Invalid QR Code or visit not approved.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};

// ─── Mock Supabase helpers ────────────────────────────────────────────────────
// Replace these with actual supabase calls when backend is ready.

async function checkGroupCheckin(qrToken: string): Promise<CheckinResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1400));

  // Demo: tokens starting with "ERR-" trigger error flows for testing
  if (qrToken.startsWith("ERR-NOT_GROUP")) throw { kind: "NOT_GROUP" };
  if (qrToken.startsWith("ERR-ALREADY")) throw { kind: "ALREADY_CHECKED_IN" };
  if (qrToken.startsWith("ERR-EXPIRED")) throw { kind: "EXPIRED" };
  if (qrToken.startsWith("ERR-")) throw { kind: "INVALID" };

  // Supabase RPC equivalent:
  // const { data, error } = await supabase.rpc("group_checkin_cascade", { qr_token: qrToken });
  // if (error) throw error;
  // return data;

  const now = new Date();
  const checkinTime = now.toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    pic_name: "Dr Ahmad Fauzi bin Ismail",
    host_name: "Encik Hazwan Rosli",
    department: "Research & Innovation Department",
    group_size: 12,
    checkin_time: checkinTime,
    members: [
      { id: "1", name: "Dr Ahmad Fauzi bin Ismail", id_number: "800311-14-5021", pass_number: "P-001", status: "checked_in" },
      { id: "2", name: "Nur Syafiqah Aziz", id_number: "910522-10-6032", pass_number: "P-002", status: "checked_in" },
      { id: "3", name: "Mohd Hafizuddin Zain", id_number: "870714-08-1234", pass_number: "P-003", status: "checked_in" },
      { id: "4", name: "Lim Wei Xian", id_number: "920301-14-5678", pass_number: "P-004", status: "checked_in" },
      { id: "5", name: "Siti Nabilah Hassan", id_number: "950801-01-9012", pass_number: "P-005", status: "checked_in" },
      { id: "6", name: "Rajan Pillai", id_number: "880610-10-3456", pass_number: "P-006", status: "checked_in" },
      { id: "7", name: "Faizal bin Kamaruddin", id_number: "900425-03-7890", pass_number: "P-007", status: "checked_in" },
      { id: "8", name: "Tan Mei Ling", id_number: "930915-07-2345", pass_number: "P-008", status: "checked_in" },
      { id: "9", name: "Azrul Hisham Bakar", id_number: "860203-05-6789", pass_number: undefined, status: "pending" },
      { id: "10", name: "Nurul Izzah Mokhtar", id_number: "940712-14-0123", pass_number: undefined, status: "pending" },
      { id: "11", name: "Kevin Chong Boon Keat", id_number: "850918-12-4567", pass_number: undefined, status: "rejected" },
      { id: "12", name: "Zarina binti Othman", id_number: "970630-11-8901", pass_number: "P-012", status: "checked_in" },
    ],
  };
}

// ─── Realtime subscription (Supabase) ────────────────────────────────────────
// Uncomment and wire up when Supabase is connected:
//
// function useRealtimeMemberStatus(visitId: string | null, onUpdate: (members: GroupMember[]) => void) {
//   useEffect(() => {
//     if (!visitId) return;
//     const channel = supabase
//       .channel(`visit-${visitId}`)
//       .on("postgres_changes", { event: "UPDATE", schema: "public", table: "visits" }, (payload) => {
//         // Refetch members on any visit update
//         fetchMembers(visitId).then(onUpdate);
//       })
//       .subscribe();
//     return () => { supabase.removeChannel(channel); };
//   }, [visitId, onUpdate]);
// }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GroupCheckinPage() {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const [result, setResult] = useState<CheckinResult | null>(null);

  const handleScan = useCallback(async (token: string) => {
    if (scanState === "loading") return;
    setScanState("loading");
    setErrorKind(null);
    setResult(null);

    try {
      const data = await checkGroupCheckin(token);
      setResult(data);
      setScanState("success");
    } catch (err: unknown) {
      const kind =
        err && typeof err === "object" && "kind" in err
          ? (err as { kind: ErrorKind }).kind
          : "UNKNOWN";
      setErrorKind(kind as ErrorKind);
      setScanState("error");
    }
  }, [scanState]);

  const handleReset = () => {
    setScanState("idle");
    setErrorKind(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar showTodayToggle={false} />

      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate("/group-visits")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                Group Visitor Check-in
              </h1>
              <p className="text-xs text-muted-foreground">
                Scan the PIC QR code to check in the entire group.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* Scanner card — hide after success */}
        {scanState !== "success" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Quick Group Check-in
                  </CardTitle>
                </div>
                {scanState === "error" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Try Again
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground pt-1">
                Scan the Person-in-Charge (PIC) QR code to check in the group.
              </p>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-5 pb-7 pt-2">
              {/* Loading overlay */}
              {scanState === "loading" ? (
                <div className="flex flex-col items-center gap-4 py-10">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-muted" />
                    <div
                      className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Validating QR code &amp; processing check-in…
                  </p>
                </div>
              ) : (
                <QRScannerInput onScan={handleScan} disabled={scanState === "loading"} />
              )}

              {/* Error banner */}
              {scanState === "error" && errorKind && (
                <div className="flex w-full max-w-xs items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">
                    {ERROR_MESSAGES[errorKind]}
                  </p>
                </div>
              )}

              {/* Tips */}
              {scanState === "idle" && (
                <div className="flex flex-wrap justify-center gap-4 text-[11px] text-muted-foreground">
                  <Tip>Supports webcam QR scanning</Tip>
                  <Tip>USB barcode scanner supported</Tip>
                  <Tip>Manual token entry available</Tip>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Success result */}
        {scanState === "success" && result && (
          <div className="flex flex-col gap-4">
            <CheckinResultCard result={result} />

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <QrCode className="h-4 w-4" />
                Scan Another Group
              </Button>
              <Button onClick={() => navigate("/group-visits")} className="gap-2">
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Tiny helper ──────────────────────────────────────────────────────────────

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
      {children}
    </span>
  );
}
