import { useState, useRef } from "react";
import { X, CloudUpload, Download, Trash2, Bus, AlertCircle, CheckCircle, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MemberRow {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
}

interface BulkImportWizardProps {
  picName: string;
  onClose: () => void;
  onComplete: () => void;
}

const DEMO_MEMBERS: MemberRow[] = [
  { id: "1", name: "Muhammad Aizat Syahir", idNumber: "010415100169", phone: "60123456789" },
  { id: "2", name: "Sarah Wong Mei Lin", idNumber: "9208121456 78", phone: "60198765432" },
  { id: "3", name: "Rajesh Kumar A/L Muthu", idNumber: "880523089012", phone: "60172349081" },
  { id: "4", name: "Nurul Huda Binti Ahmad", idNumber: "951130023456", phone: "60135567890" },
  { id: "5", name: "Tan Wei Keong", idNumber: "850214105678", phone: "60167891234" },
  { id: "6", name: "Lim Chee Wai", idNumber: "921105089012", phone: "60178912345" },
  { id: "7", name: "Farah Adilah Binti Zaki", idNumber: "960803123456", phone: "60189023456" },
  { id: "8", name: "David Raj Saminathan", idNumber: "870615078901", phone: "60191234567" },
  { id: "9", name: "Siti Norfazlin Bt Hassan", idNumber: "930420056789", phone: "60112345678" },
  { id: "10", name: "Mohd Ridhwan Bin Ali", idNumber: "891010034567", phone: "60123456789" },
  { id: "11", name: "Priya d/o Krishnan", idNumber: "950701012345", phone: "60134567890" },
  { id: "12", name: "Chen Mei Ying", idNumber: "880909090123", phone: "60145678901" },
];

type TransportType = "no_bus" | "bus";

export function BulkImportWizard({ picName, onClose, onComplete }: BulkImportWizardProps) {
  const [step, setStep] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [transport, setTransport] = useState<TransportType>("no_bus");
  const [busPlates, setBusPlates] = useState<string[]>(["ABC 1234"]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const steps = ["Upload", "Preview", "Transport", "Complete"];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  };

  const simulateUpload = (name: string) => {
    setFileName(name);
    setFileUploaded(true);
    setMembers(DEMO_MEMBERS);
    setTimeout(() => setStep(2), 600);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addBusPlate = () => {
    if (busPlates.length < 3) setBusPlates((p) => [...p, ""]);
  };

  const updatePlate = (idx: number, val: string) => {
    setBusPlates((p) => p.map((pl, i) => (i === idx ? val : pl)));
  };

  const removePlate = (idx: number) => {
    setBusPlates((p) => p.filter((_, i) => i !== idx));
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const isCompleted = step > num;
        const isActive = step === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                  isCompleted
                    ? "border-success bg-success text-success-foreground"
                    : isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? "✓" : num}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 mb-5 h-0.5 w-16 ${step > num ? "bg-success" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Bulk Import Group Members</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {step === 1 && "Import multiple group members from a CSV file"}
              {step === 2 && "Review the list of members before importing"}
              {step === 3 && "Import multiple group members from a CSV file"}
              {step === 4 && "Review the summary before finalizing the group registration."}
            </p>
          </div>
          <button onClick={onClose} className="rounded-sm p-1 opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <StepIndicator />

          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                  dragOver ? "border-primary bg-info-bg" : "border-border bg-muted/30"
                }`}
              >
                <CloudUpload className={`mx-auto mb-4 h-12 w-12 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-base font-medium text-foreground">Drag and drop CSV file here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or{" "}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-primary underline hover:no-underline"
                  >
                    click to browse
                  </button>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Accepted: .csv up to 5MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) simulateUpload(f.name);
                  }}
                />
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Need a template?</p>
                  <p className="text-xs text-muted-foreground">
                    Required: name, email • Optional: phone, department, position
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <div>
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-info-border bg-info-bg p-3">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Data Validation Successful</p>
                  <p className="text-sm text-primary/80">
                    We found {members.length} valid entries in your CSV file. Please review the details below before proceeding.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">ID Number</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.slice(0, 5).map((m) => (
                      <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3 text-foreground">{m.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.idNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">{m.phone}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => removeMember(m.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Showing 5 of {members.length} entries</span>
                <span className="font-semibold text-foreground">Total Members: {members.length}</span>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <span>←</span> Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Next Step <span>→</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Transport */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold text-foreground">Transport Configuration</h3>
              <p className="mb-4 text-sm text-muted-foreground">Select transport mode for the group</p>

              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-foreground">Transport Type</p>
                <div className="flex gap-6">
                  {(["no_bus", "bus"] as TransportType[]).map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="transport"
                        value={t}
                        checked={transport === t}
                        onChange={() => {
                          setTransport(t);
                          if (t === "bus" && busPlates.length === 0) setBusPlates([""]);
                        }}
                        className="accent-primary h-4 w-4"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {t === "no_bus" ? "No Bus" : "Bus"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {transport === "bus" && (
                <div className="mb-4 space-y-2">
                  <div className="border-t border-border pt-4">
                    <p className="mb-3 text-sm font-medium text-foreground">Bus Plate Number</p>
                    {busPlates.map((plate, idx) => (
                      <div key={idx} className="mb-2 flex items-center gap-2">
                        <div className="relative flex-1">
                          <Bus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={plate}
                            onChange={(e) => updatePlate(idx, e.target.value)}
                            placeholder="e.g., ABC 1234"
                            className="pl-9"
                          />
                        </div>
                        <button onClick={() => removePlate(idx)} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {busPlates.length < 3 && (
                      <button
                        onClick={addBusPlate}
                        className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Plus className="h-4 w-4" />
                        Add Bus Plate
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-info-border bg-info-bg p-3 flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Important Note</p>
                  <p className="text-sm text-primary/80">
                    Providing bus plate numbers helps security personnel expedite the entry process for large groups.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Next Step</Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div>
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-success-border bg-success-bg p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <div>
                  <p className="font-semibold text-success">Ready for Submission</p>
                  <p className="text-sm text-success/80">
                    All {members.length} members have been successfully validated. Please review the details below.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Group Summary
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Person in Charge (PIC)</p>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{picName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Members</p>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-semibold text-foreground">{members.length} Visitors</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Transport Type</p>
                    <div className="flex items-center gap-2">
                      <Bus className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-semibold text-foreground">
                        {transport === "bus" ? "Chartered Bus" : "No Bus / Private"}
                      </p>
                    </div>
                  </div>
                  {transport === "bus" && busPlates.filter(Boolean).length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Vehicle Plate Number</p>
                      <div className="flex flex-wrap gap-2">
                        {busPlates.filter(Boolean).map((plate, i) => (
                          <span key={i} className="flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-sm font-mono font-medium text-foreground">
                            <Bus className="h-3 w-3 text-muted-foreground" />
                            {plate}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                By confirming, these visitors will be pre-registered in the system.
              </p>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={onComplete}>Confirm Group Registration</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
