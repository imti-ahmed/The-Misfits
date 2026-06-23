"use client";

import { useEffect } from "react";

export default function ViewTracker() {
  useEffect(() => {
    fetch("/api/views", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
