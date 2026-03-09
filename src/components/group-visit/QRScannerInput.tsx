import { useEffect, useRef, useState } from "react";
import { ScanLine, Keyboard, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QRScannerInputProps {
  onScan: (value: string) => void;
  disabled?: boolean;
}

type Mode = "camera" | "manual";

export function QRScannerInput({ onScan, disabled }: QRScannerInputProps) {
  const [mode, setMode] = useState<Mode>("camera");
  const [manualValue, setManualValue] = useState("");
  const [buffer, setBuffer] = useState("");
  const bufferTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // USB / keyboard wedge scanner listener — captures rapid keystrokes ending with Enter
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is inside the manual input
      if (document.activeElement === inputRef.current) return;

      if (e.key === "Enter") {
        if (buffer.length > 4) {
          onScan(buffer.trim());
        }
        setBuffer("");
        if (bufferTimer.current) clearTimeout(bufferTimer.current);
        return;
      }

      if (e.key.length === 1) {
        setBuffer((prev) => prev + e.key);

        if (bufferTimer.current) clearTimeout(bufferTimer.current);
        bufferTimer.current = setTimeout(() => setBuffer(""), 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (bufferTimer.current) clearTimeout(bufferTimer.current);
    };
  }, [buffer, disabled, onScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = manualValue.trim();
    if (val.length > 3) {
      onScan(val);
      setManualValue("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Mode switcher */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 self-end">
        <button
          onClick={() => setMode("camera")}
          disabled={disabled}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "camera"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          Camera
        </button>
        <button
          onClick={() => setMode("manual")}
          disabled={disabled}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "manual"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Keyboard className="h-3.5 w-3.5" />
          Manual
        </button>
      </div>

      {mode === "camera" ? (
        <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden border-2 border-dashed border-primary/40 bg-muted/50 flex flex-col items-center justify-center gap-3">
          {/* Animated scan line */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Corner brackets */}
              <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-sm" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-sm" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-sm" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-sm" />

              {/* Scanning line animation */}
              <div
                className="absolute left-2 right-2 h-0.5 bg-primary/70 rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.7)]"
                style={{ animation: "scan-line 2s ease-in-out infinite" }}
              />
            </div>
          </div>

          <ScanLine className="h-10 w-10 text-primary/30 z-10" />
          <p className="text-xs text-muted-foreground text-center px-4 z-10">
            Position QR code inside the frame
          </p>
          <p className="text-[10px] text-muted-foreground/60 z-10">
            USB scanner also supported
          </p>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="w-full max-w-xs flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Enter QR Token / Visitor ID
            </label>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                placeholder="e.g. VIS-20240310-001"
                disabled={disabled}
                className="flex-1 font-mono text-sm"
              />
              <Button
                type="submit"
                disabled={disabled || manualValue.trim().length < 4}
                size="sm"
              >
                Check In
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-center">
            USB barcode / QR scanner also automatically inputs here
          </p>
        </form>
      )}
    </div>
  );
}
