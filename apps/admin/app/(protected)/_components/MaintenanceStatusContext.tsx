"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const NOW_REFRESH_INTERVAL_MS = 30_000;

type MaintenanceStatusValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  windowStart: string;
  setWindowStart: (next: string) => void;
  windowEnd: string;
  setWindowEnd: (next: string) => void;
  isMaintenanceActive: boolean;
};

const MaintenanceStatusContext = createContext<MaintenanceStatusValue | null>(null);

export function MaintenanceStatusProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), NOW_REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const start = windowStart ? new Date(windowStart) : null;
  const end = windowEnd ? new Date(windowEnd) : null;
  const withinWindow = start !== null && end !== null && now >= start && now <= end;
  const isMaintenanceActive = enabled && withinWindow;

  return (
    <MaintenanceStatusContext.Provider
      value={{ enabled, setEnabled, windowStart, setWindowStart, windowEnd, setWindowEnd, isMaintenanceActive }}
    >
      {children}
    </MaintenanceStatusContext.Provider>
  );
}

export function useMaintenanceStatus() {
  const ctx = useContext(MaintenanceStatusContext);
  if (!ctx) {
    throw new Error("useMaintenanceStatus must be used within a MaintenanceStatusProvider");
  }
  return ctx;
}
