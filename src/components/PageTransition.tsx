"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

const EXIT_DURATION = 0.1;
const HEADER_ENTER_DURATION = 0.3;
const CARD_ENTER_DURATION = 0.32;
const CARD_STAGGER = 0.045;
const CARDS_START_AT = 0.08; // seconds into the enter timeline — overlaps the header's own animation

function headerGroups(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-transition-group="header"]'));
}

function cardGroups(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-transition-group="card"]'));
}

// DOM order follows the column layout (left column fully, then center, then
// right) — sort by actual on-screen position instead so cards enter in a
// top-to-bottom wave across the whole page, not column by column.
function sortedTopToBottom(elements: HTMLElement[]): HTMLElement[] {
  return [...elements].sort((a, b) => {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    return ra.top - rb.top || ra.left - rb.left;
  });
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const isEnteringRef = useRef(false);

  // Runs once the new route has actually mounted (pathname changed for real).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isEnteringRef.current) return;
    isEnteringRef.current = false;

    const hGroups = headerGroups(el);
    const cGroups = cardGroups(el);
    const allGroups = [...hGroups, ...cGroups];
    gsap.killTweensOf(allGroups.length > 0 ? allGroups : el);

    const tl = gsap.timeline();

    if (allGroups.length === 0) {
      // No tagged groups on this page — fall back to animating the whole thing at once.
      tl.fromTo(el, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: CARD_ENTER_DURATION, ease: "back.out(2.2)" });
      return;
    }

    if (hGroups.length > 0) {
      tl.fromTo(
        hGroups,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: HEADER_ENTER_DURATION, ease: "back.out(2.2)", clearProps: "transform,opacity" },
        0
      );
    }

    if (cGroups.length > 0) {
      tl.fromTo(
        sortedTopToBottom(cGroups),
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: CARD_ENTER_DURATION,
          ease: "back.out(2.2)",
          stagger: CARD_STAGGER,
          clearProps: "transform,opacity",
        },
        CARDS_START_AT
      );
    }
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      const el = wrapperRef.current;
      if (!el) return; // let the browser navigate normally

      e.preventDefault();

      const groups = [...headerGroups(el), ...cardGroups(el)];
      const targets = groups.length > 0 ? groups : el;

      // Exit is instant and uniform — everything fades out together, no stagger.
      gsap.killTweensOf(targets);
      gsap.to(targets, {
        opacity: 0,
        scale: 0.97,
        duration: EXIT_DURATION,
        ease: "power1.in",
        onComplete: () => {
          isEnteringRef.current = true;
          router.push(href);
        },
      });
    }

    // Capture phase so this runs before next/link's own bubble-phase click
    // handler, which would otherwise navigate immediately.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [router]);

  return <div ref={wrapperRef}>{children}</div>;
}
