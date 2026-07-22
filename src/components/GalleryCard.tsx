"use client";

import { useState } from "react";
import MemberLink from "@/components/MemberLink";
import styles from "./GalleryCard.module.css";

const HOVER_COLORS = ["yellow", "purple", "green", "blue", "pink"] as const;

interface GalleryCardProps {
  name: string;
  imageSrc: string;
  href: string;
}

export default function GalleryCard({ name, imageSrc, href }: GalleryCardProps) {
  const [hoverColor, setHoverColor] = useState<string | null>(null);

  return (
    <div
      className={styles.card}
      data-transition-group="card"
      onMouseEnter={() => setHoverColor(HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)])}
      onMouseLeave={() => setHoverColor(null)}
    >
      <MemberLink href={href} className={styles.link}>
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.image} src={imageSrc} alt={`${name}'s site`} />
        </div>

        <div className={`${styles.nameTag} ${hoverColor ? styles[hoverColor] : ""}`}>
          <p className={styles.nameLabel}>{name}</p>
        </div>
      </MemberLink>
    </div>
  );
}
