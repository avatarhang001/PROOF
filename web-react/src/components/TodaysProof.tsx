import { Link } from "react-router-dom";
import type { DailyChallenge } from "@/types/api";
import { BADGE_GOLD, CARD, CHIP, PANEL_PAD } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { ArrowRightIcon, ClockIcon } from "./Icons";

export function TodaysProof({ id = "todays-proof", challenge }: { id?: string; challenge: DailyChallenge }) {
  return (
    <section aria-labelledby={id} className={`${CARD} ${PANEL_PAD} h-full`}>
      <PanelHeader id={id} title="Today's proof" action="View all" actionTo="/prove" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-ink-soft">Daily challenge</p>
          <h3 className="mt-1 font-display text-[16px] font-bold leading-snug tracking-[-0.015em] text-ink">
            {challenge.title}
          </h3>
        </div>
        <span className={`${BADGE_GOLD} shrink-0`}>+{challenge.rewardNim} NIM</span>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className={`${CHIP} inline-flex items-center gap-1.5 px-2.5 py-[3px]`}>
          <ClockIcon className="h-[13px] w-[13px] text-faint" />
          ~{challenge.timeMin} min
        </span>
        <span className="rounded-md bg-brand-soft px-2.5 py-[3px] text-[11px] font-semibold text-brand">
          {challenge.skillSlug}
        </span>
      </div>

      <Link
        to={`/prove/challenge/${challenge.id}`}
        className="group relative mt-[18px] flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#261c48] to-[#140f26] px-5 py-[15px] font-display text-[14.5px] font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_10px_22px_-16px_rgba(20,15,38,0.9)] transition-all duration-300 hover:-translate-y-[2px] hover:from-[#2e2255] hover:to-[#1a1332] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),0_20px_36px_-18px_rgba(38,28,72,0.95)] active:translate-y-0"
      >
        <span
          aria-hidden="true"
          className="anim-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="relative">Start proof</span>
        <ArrowRightIcon className="relative h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
