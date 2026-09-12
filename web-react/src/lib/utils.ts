import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared surface recipes so every panel stays visually identical. */
export const CARD = "rounded-2xl border border-line bg-card shadow-card";
export const SUB_CARD =
  "rounded-xl border border-line bg-card transition-[transform,box-shadow,border-color] duration-300";
export const PANEL_PAD = "p-4 sm:p-5";
export const PILL =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-[12.5px] font-medium text-ink-soft transition-colors duration-200 hover:border-line-strong hover:bg-elevated hover:text-ink";
export const CHIP = "rounded-md border border-line px-2 py-0.5 text-[11px] font-medium text-muted";
export const BADGE_GOLD =
  "inline-flex items-center rounded-lg bg-gold-soft px-3 py-1.5 font-display text-[12.5px] font-bold text-gold";

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
