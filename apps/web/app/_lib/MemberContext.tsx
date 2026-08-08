"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentMemberInfo } from "../actions/members";

type MemberContextValue = {
  memberName: string | null;
  /** 代表者（owner）かつゲストファミリーではない場合のみtrue。ログアウトメニュー表示可否の判定に使う */
  canLogout: boolean;
  setMemberName: (name: string) => void;
};

const MemberContext = createContext<MemberContextValue>({
  memberName: null,
  canLogout: false,
  setMemberName: () => {},
});

export function MemberProvider({ children }: { children: ReactNode }) {
  const [memberName, setMemberName] = useState<string | null>(null);
  const [canLogout, setCanLogout] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCurrentMemberInfo().then((info) => {
      if (cancelled) return;
      setMemberName(info.name);
      setCanLogout(info.role === "owner" && !info.isGuest);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MemberContext.Provider value={{ memberName, canLogout, setMemberName }}>{children}</MemberContext.Provider>
  );
}

export function useCurrentMember() {
  return useContext(MemberContext);
}
