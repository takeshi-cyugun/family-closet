"use client";

import { useEffect } from "react";
import { checkFamilyIdAvailability } from "../../actions/registerFamily";
import type { RegisterDictionary } from "../_lib/i18n";

const FAMILY_ID_PATTERN = /^[a-zA-Z0-9-]{3,32}$/;

export type FamilyIdStatus = "idle" | "invalid" | "checking" | "available" | "taken";

type FamilyIdFieldProps = {
  value: string;
  onChange: (value: string) => void;
  status: FamilyIdStatus;
  onStatusChange: (status: FamilyIdStatus) => void;
  t: RegisterDictionary["familyId"];
};

const STATUS_CLASS: Record<FamilyIdStatus, string> = {
  idle: "text-ink-soft",
  invalid: "text-red-600 dark:text-red-400",
  checking: "text-ink-soft",
  available: "text-emerald-600 dark:text-emerald-400",
  taken: "text-red-600 dark:text-red-400",
};

export function FamilyIdField({ value, onChange, status, onStatusChange, t }: FamilyIdFieldProps) {
  useEffect(() => {
    if (value === "") {
      onStatusChange("idle");
      return;
    }
    if (!FAMILY_ID_PATTERN.test(value)) {
      onStatusChange("invalid");
      return;
    }

    onStatusChange("checking");
    let cancelled = false;
    const timer = setTimeout(async () => {
      const available = await checkFamilyIdAvailability(value);
      if (!cancelled) onStatusChange(available ? "available" : "taken");
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const statusText: Record<FamilyIdStatus, string> = {
    idle: "",
    invalid: t.status.invalid,
    checking: t.status.checking,
    available: t.status.available,
    taken: t.status.taken,
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="familyId" className="text-sm font-medium text-ink">
        {t.label}
      </label>
      <input
        id="familyId"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.placeholder}
        autoComplete="off"
        className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
      />
      {status !== "idle" && <p className={`text-xs ${STATUS_CLASS[status]}`}>{statusText[status]}</p>}
    </div>
  );
}
