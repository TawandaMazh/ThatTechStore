import type { ProductUnit } from "@/types";

interface PhoneUnitInfoProps {
  units: ProductUnit[];
  isPhone: boolean;
}

export function PhoneUnitInfo({ units, isPhone }: PhoneUnitInfoProps) {
  if (!isPhone || !units.length) return null;

  const best = [...units].sort(
    (a, b) => (b.batteryHealth ?? 0) - (a.batteryHealth ?? 0),
  )[0];

  const avgBattery =
    units.reduce((sum, u) => sum + (u.batteryHealth ?? 0), 0) /
    units.filter((u) => u.batteryHealth != null).length;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
      <p className="font-display text-sm font-semibold text-text">
        Phone unit details
      </p>
      <ul className="mt-3 space-y-2 text-sm text-text-muted">
        <li>
          <span className="text-text">Battery health:</span>{" "}
          {Number.isFinite(avgBattery)
            ? `~${Math.round(avgBattery)}% typical (units from ${best.batteryHealth ?? "—"}%)`
            : "Verified on unit"}
        </li>
        <li>
          <span className="text-text">IMEI:</span>{" "}
          {best.imeiChecked ? "Checked before sale" : "Pending check"}
          {best.serialOrImei
            ? ` · ends …${best.serialOrImei.slice(-4)}`
            : null}
        </li>
        <li>
          <span className="text-text">Warranty:</span>{" "}
          {best.warrantyMonths > 0
            ? `${best.warrantyMonths} months store warranty`
            : "Ask in-store"}
        </li>
        <li>
          <span className="text-text">Available units:</span> {units.length}
        </li>
      </ul>
    </div>
  );
}
