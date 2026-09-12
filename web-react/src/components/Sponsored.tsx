import type { SponsoredChallenge } from "@/types/api";
import { CARD, PANEL_PAD } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { ArrowRightIcon, SparkIcon } from "./Icons";
import { Link } from "react-router-dom";

export function Sponsored({ challenges = [] }: { challenges?: SponsoredChallenge[] }) {
  // Show the first sponsored challenge or a placeholder
  const sponsored = challenges[0];

  if (!sponsored) {
    // Fallback when no sponsored challenges
    return (
      <section aria-labelledby="sponsored" className={`${CARD} ${PANEL_PAD} h-full`}>
        <PanelHeader id="sponsored" title="Sponsored" action="View all" actionTo="/prove" />
        <div className="rounded-xl border border-line bg-surface p-4 text-center">
          <p className="text-sm text-muted">No sponsored challenges at this time</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="sponsored" className={`${CARD} ${PANEL_PAD} h-full`}>
      <PanelHeader id="sponsored" title="Sponsored" action="View all" actionTo="/prove" />

      <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-brand-soft via-card to-card p-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl"
        />
        <div className="relative flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand/15 bg-brand/12 text-2xl">
            {sponsored.emoji || '🏆'}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              <SparkIcon className="h-3.5 w-3.5" />
              {sponsored.sponsor}
            </p>
            <p className="mt-1.5 font-display text-[14px] font-bold leading-snug tracking-[-0.01em] text-ink">
              {sponsored.title}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{sponsored.description}</p>
          </div>
        </div>

        <div className="relative mt-3.5 flex items-center gap-3">
          <Link
            to={`/prove/sponsored/${sponsored.id}`}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#5b21b6] hover:shadow-[0_14px_26px_-14px_rgba(109,40,217,0.9)] dark:text-[#16102b]"
          >
            {sponsored.joined ? 'View Challenge' : 'Join Challenge'}
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-[11.5px] text-faint">
            {sponsored.poolNim} NIM pool · {sponsored.participants} joined
          </span>
        </div>
      </div>
    </section>
  );
}
