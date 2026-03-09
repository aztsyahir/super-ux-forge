import { CheckCircle2, User, Building2, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export interface GroupMember {
  id: string;
  name: string;
  id_number: string;
  pass_number?: string;
  status: "checked_in" | "pending" | "rejected" | "approved";
}

export interface CheckinResult {
  pic_name: string;
  host_name: string;
  department: string;
  group_size: number;
  checkin_time: string;
  members: GroupMember[];
}

interface CheckinResultCardProps {
  result: CheckinResult;
}

const STATUS_CONFIG: Record<
  GroupMember["status"],
  { label: string; className: string }
> = {
  checked_in: {
    label: "Checked In",
    className:
      "bg-[hsl(var(--badge-checked-in-bg))] text-[hsl(var(--badge-checked-in-text))] border-[hsl(var(--success-border))]",
  },
  approved: {
    label: "Approved",
    className:
      "bg-[hsl(var(--badge-approved-bg))] text-[hsl(var(--badge-approved-text))] border-[hsl(var(--success-border))]",
  },
  pending: {
    label: "Pending",
    className:
      "bg-[hsl(var(--badge-pending-bg))] text-[hsl(var(--badge-pending-text))] border-[hsl(var(--warning-border))]",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export function CheckinResultCard({ result }: CheckinResultCardProps) {
  const checkedInCount = result.members.filter(
    (m) => m.status === "checked_in"
  ).length;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Success Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-[hsl(var(--success-border))] bg-[hsl(var(--success-bg))] p-4">
        <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))] mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-[hsl(var(--success))] text-base">
            Group Check-in Successful
          </p>
          <p className="text-sm text-[hsl(var(--success))]/80 mt-0.5">
            {checkedInCount} of {result.group_size} members checked in
          </p>
        </div>
      </div>

      {/* Visit Summary */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            <InfoItem icon={<User className="h-4 w-4" />} label="PIC Name" value={result.pic_name} />
            <InfoItem icon={<Building2 className="h-4 w-4" />} label="Host / Department" value={`${result.host_name} — ${result.department}`} />
            <InfoItem icon={<Users className="h-4 w-4" />} label="Group Size" value={`${result.group_size} Visitors`} />
            <InfoItem icon={<Clock className="h-4 w-4" />} label="Check-in Time" value={result.checkin_time} />
          </div>
        </CardContent>
      </Card>

      {/* Member Status Table */}
      <Card>
        <CardContent className="pt-5 px-0 pb-0">
          <p className="px-5 pb-3 text-sm font-semibold text-foreground">
            Member Status Preview
          </p>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Pass No.</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.members.map((member, idx) => {
                  const cfg = STATUS_CONFIG[member.status];
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="pl-5 text-muted-foreground text-xs">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {member.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {member.id_number}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {member.pass_number ?? "—"}
                      </TableCell>
                      <TableCell className="pr-5">
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${cfg.className}`}
                        >
                          {cfg.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="h-4" />
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
