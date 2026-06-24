"use client";

import { createContext, useContext } from "react";

export const MobileJoinContext = createContext<(() => void) | null>(null);

export function useMobileJoin() {
  return useContext(MobileJoinContext);
}
