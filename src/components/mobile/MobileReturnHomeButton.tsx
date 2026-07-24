"use client";

import { sounds } from "@/lib/sounds";
import styles from "./MobileJoinButton.module.css";

interface MobileReturnHomeButtonProps {
  onGoBack: () => void;
}

export default function MobileReturnHomeButton({ onGoBack }: MobileReturnHomeButtonProps) {
  return (
    <button
      type="button"
      className={styles.link}
      onClick={() => { sounds.click(); onGoBack(); }}
      onMouseEnter={() => sounds.swoosh()}
    >
      Click Here
    </button>
  );
}
