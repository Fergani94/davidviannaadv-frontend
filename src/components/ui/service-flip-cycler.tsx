"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const graphemeSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function segmentCharacters(text: string) {
  if (!graphemeSegmenter) return Array.from(text);
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

export interface ServiceFlipCyclerProps {
  /** The phrases cycled through, one at a time, looping forever. */
  words: string[];
  /** How long each phrase stays on screen before flipping to the next, in milliseconds. */
  interval?: number;
  /** Duration of each character flip in milliseconds. */
  duration?: number;
  /** Delay between neighboring character flips in milliseconds. */
  stagger?: number;
  /** Additional classes applied to the container. */
  className?: string;
  /** Inline styles applied to the container. */
  style?: CSSProperties;
}

export function ServiceFlipCycler({
  words,
  interval = 2200,
  duration = 400,
  stagger = 44,
  className,
  style,
}: ServiceFlipCyclerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const nextIndex = (index + 1) % words.length;

  useEffect(() => {
    if (words.length < 2) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const resolvedDuration = prefersReducedMotion
      ? 0
      : Math.max(180, duration) / 1000;
    const resolvedStagger = prefersReducedMotion
      ? 0
      : Math.max(0, stagger) / 1000;

    let timeoutId: number | undefined;

    const context = gsap.context(() => {
      const firstWord = gsap.utils.toArray<HTMLElement>(
        '[data-flip-word="first"]',
      );
      const secondWord = gsap.utils.toArray<HTMLElement>(
        '[data-flip-word="second"]',
      );

      gsap.set(firstWord, {
        rotationX: 0,
        opacity: 1,
        transformOrigin: "center top",
      });
      gsap.set(secondWord, {
        rotationX: -82,
        opacity: 0,
        transformOrigin: "center bottom",
      });

      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => setIndex((current) => (current + 1) % words.length),
      });
      timeline
        .to(firstWord, {
          rotationX: 82,
          opacity: 0,
          duration: resolvedDuration,
          stagger: resolvedStagger,
          ease: "power2.in",
        })
        .to(
          secondWord,
          {
            rotationX: 0,
            opacity: 1,
            duration: resolvedDuration,
            stagger: resolvedStagger,
            ease: "power2.out",
          },
          `<${resolvedDuration * 0.62}`,
        );

      timeoutId = window.setTimeout(
        () => timeline.play(),
        Math.max(600, interval),
      );
    }, containerRef);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      context.revert();
    };
  }, [index, words, duration, stagger, interval]);

  const renderCharacters = (text: string, layer: "first" | "second") =>
    segmentCharacters(text).map((character, charIndex) => (
      <span
        key={`${layer}-${charIndex}-${character}`}
        data-flip-word={layer}
        className="inline-block whitespace-pre [backface-visibility:hidden] [will-change:transform,opacity]"
      >
        {character === " " ? " " : character}
      </span>
    ));

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative inline-grid select-none align-baseline font-[inherit] leading-[inherit] tracking-[inherit] text-[inherit]",
        className,
      )}
      style={style}
      aria-label={words[index]}
    >
      <span className="col-start-1 row-start-1 inline-grid overflow-hidden [perspective:800px]">
        <span
          key={`current-${index}`}
          className="col-start-1 row-start-1 inline-flex items-baseline justify-center gap-[0.012em] whitespace-pre"
          aria-hidden="true"
        >
          {renderCharacters(words[index], "first")}
        </span>
        <span
          key={`next-${index}`}
          className="col-start-1 row-start-1 inline-flex items-baseline justify-center gap-[0.012em] whitespace-pre"
          aria-hidden="true"
        >
          {renderCharacters(words[nextIndex], "second")}
        </span>
      </span>
    </span>
  );
}
