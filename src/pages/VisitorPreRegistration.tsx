import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Users, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BulkImportWizard, BulkImportResult } from "@/components/group-visit/BulkImportWizard";

export default function VisitorPreRegistration() {
  const [params] = useSearchParams();
  const type = params.get("type") || "malaysian";
  const isMalaysian = type === "malaysian";

  const [visitPurpose, setVisitPurpose] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [isGroupVisit, setIsGroupVisit] = useState<"no" | "yes">("no");
  const [groupImportResult, setGroupImportResult] = useState<BulkImportResult | null>(null);
  const [pdpaAgreed, setPdpaAgreed] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Visitor Pre-Registration</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Please fill out the form below to register your visit to MIMOS. All fields marked with{" "}
              <span className="text-destructive">*</span> are required.
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* MyDigitalID Banner (Malaysian only) */}
        {isMalaysian && (
          <div className="mb-6 rounded-lg border border-success-border bg-success-bg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
              <div>
                <p className="font-semibold text-success">✓ Authenticated with MyDigitalID</p>
                <p className="text-sm text-success/80">
                  Your name and IC have been verified. Please fill in your email and other details.
                </p>
                <p className="mt-1 text-sm font-medium text-success">Name: MUHAMMAD AIZAT SYAHIR MOHD KHAIRI</p>
                <p className="text-sm font-medium text-success">IC: 010415100169</p>
                <a href="#" className="mt-1 block text-sm text-primary underline hover:no-underline">
                  Use a different MyDigitalID account
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* Visitor Name */}
          <div>
            <Label className="mb-1.5 flex items-center gap-1 text-sm font-medium">
              Visitor Name{" "}
              <span className="text-xs text-muted-foreground">(from MyDigitalID)</span>
              <span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              value={isMalaysian ? "MUHAMMAD AIZAT SYAHIR MOHD KHAIRI" : ""}
              readOnly={isMalaysian}
              className={isMalaysian ? "border-success/50 bg-success-bg/30 text-foreground" : ""}
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input type="email" placeholder="your.email@example.com" />
          </div>

          {/* Phone */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">Phone Number</Label>
            <Input type="tel" placeholder="60123456789" />
            <p className="mt-1 text-xs text-muted-foreground">Digits only (e.g., 60123456789)</p>
          </div>

          {/* Company */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">Company/Organization</Label>
            <Input placeholder="Your company name" />
          </div>

          {/* IC Number */}
          <div>
            <Label className="mb-1.5 flex items-center gap-1 text-sm font-medium">
              IC Number <span className="text-xs text-muted-foreground">(from MyDigitalID)</span>
              <span className="text-destructive ml-0.5">*</span>
            </Label>
            <Input
              value={isMalaysian ? "010415100169" : ""}
              readOnly={isMalaysian}
              className={isMalaysian ? "border-success/50 bg-success-bg/30" : ""}
              placeholder=""
            />
            <p className="mt-1 text-xs text-muted-foreground">12 digits IC number (e.g., 991231014567)</p>
          </div>

          {/* Visitor Type */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">
              Visitor Type <span className="text-destructive">*</span>
            </Label>
            {isMalaysian && (
              <div className="mb-2 rounded-md border border-info-border bg-info-bg px-3 py-2 text-xs text-primary">
                Visitor type has been pre-selected and cannot be changed.
              </div>
            )}
            <div className="flex gap-3">
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${isMalaysian || type === "malaysian" ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"}`}>
                <input
                  type="radio"
                  name="visitorType"
                  value="malaysian"
                  defaultChecked={isMalaysian}
                  disabled={isMalaysian}
                  className="accent-primary"
                />
                Malaysian Visitor
              </label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${type === "international" ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"}`}>
                <input
                  type="radio"
                  name="visitorType"
                  value="international"
                  defaultChecked={type === "international"}
                  disabled={isMalaysian}
                  className="accent-primary"
                />
                International Visitor
              </label>
            </div>
          </div>

          {/* Visit Purpose */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">
              Visit Purpose <span className="text-destructive">*</span>
            </Label>
            <select
              value={visitPurpose}
              onChange={(e) => setVisitPurpose(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select visit purpose</option>
              <option value="meeting">Meeting</option>
              <option value="training">Training</option>
              <option value="audit">Audit</option>
              <option value="delivery">Delivery</option>
              <option value="tour">Tour / Visit</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Host Email */}
          <div>
            <Label className="mb-1.5 text-sm font-medium">
              Host Email <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="host.email@mimos-services.my"
                value={hostEmail}
                onChange={(e) => setHostEmail(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="sm" className="px-4">
                Check
              </Button>
            </div>
          </div>

          {/* Is this a Group Visit? */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Is this a Group Visit?</p>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Select Yes if you are registering multiple visitors (5 or more) under the same visit purpose.
            </p>
            <div className="flex flex-col gap-2">
              {(["no", "yes"] as const).map((val) => (
                <label key={val} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="isGroupVisit"
                    value={val}
                    checked={isGroupVisit === val}
                    onChange={() => {
                      setIsGroupVisit(val);
                      if (val === "no") setGroupImportResult(null);
                    }}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm font-medium text-foreground capitalize">{val}</span>
                </label>
              ))}
            </div>

            {/* Upload Group Members button — shown only when Yes */}
            {isGroupVisit === "yes" && (
              <div className="pt-1">
                {groupImportResult ? (
                  <div className="flex items-center justify-between rounded-lg border border-[hsl(var(--success-border))] bg-[hsl(var(--success-bg))] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                      <p className="text-sm font-medium text-[hsl(var(--success))]">
                        {groupImportResult.members.length} members imported
                        {groupImportResult.isBusTransport && ` · Bus: ${groupImportResult.busPlateNumbers.join(", ")}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowWizard(true)}
                      className="text-xs text-primary underline hover:no-underline"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 w-full"
                    onClick={() => setShowWizard(true)}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Group Members
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* PDPA */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={pdpaAgreed}
              onChange={(e) => setPdpaAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <p className="text-sm text-foreground">
              I agree to the{" "}
              <a href="#" className="text-primary underline hover:no-underline">
                Personal Data Collection Notice
              </a>
              <span className="text-destructive ml-0.5">*</span>
            </p>
          </label>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={!pdpaAgreed || (isGroupVisit === "yes" && !groupImportResult)}
            onClick={() => {
              // In real app: submit PIC visit + group_visit_details + group_visit_members
              alert(isGroupVisit === "yes"
                ? `Group visit submitted with ${groupImportResult?.members.length} members!`
                : "Visit request submitted successfully!"
              );
            }}
          >
            {isGroupVisit === "yes" && !groupImportResult
              ? "Upload Group Members to Continue"
              : "Submit Visit Request"}
          </Button>
        </div>
      </div>

      {/* Bulk Import Wizard */}
      {showWizard && (
        <BulkImportWizard
          picName="MUHAMMAD AIZAT SYAHIR MOHD KHAIRI"
          onClose={() => setShowWizard(false)}
          onComplete={(result) => {
            setGroupImportResult(result);
            setShowWizard(false);
          }}
        />
      )}
    </div>
  );
}
