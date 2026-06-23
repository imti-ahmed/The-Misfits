"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Warning, CheckCircle } from "@phosphor-icons/react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
}

export default function Toast({ message, type = "error", onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => closeRef.current(), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  const Icon = type === "success" ? CheckCircle : Warning;

  return createPortal(
    <div className={`${styles.toast} ${type === "success" ? styles.success : styles.error}`}>
      <Icon size={14} weight="fill" />
      {message}
    </div>,
    document.body
  );
}
