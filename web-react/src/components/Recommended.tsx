import type { RecommendedSkill } from "@/types/api";
import { CARD, PANEL_PAD, SUB_CARD } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { StarSolidIcon } from "./Icons";

export function Recommended({ skills }: { skills: RecommendedSkill[] }) {
  return (
    <section aria-labelledby="recommended" className={`${CARD} ${PANEL_PAD}`}>
      <PanelHeader id="recommended" title="Recommended for you" action="View all" actionTo="/learn" />

      <ul className="grid gap-2.5 sm:grid-cols-3">
        {skills.slice(0, 3).map((item) => (
          <li
            key={item.slug}
            className={`${SUB_CARD} group flex cursor-pointer flex-col p-3.5 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover`}
          >
            <h3 className="font-display text-[13.5px] font-bold tracking-[-0.01em] text-ink">{item.name}</h3>
            <p className="mt-1 text-[12.5px] leading-snug text-muted">{item.reason}</p>

            <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
              <span className="text-[11.5px] font-medium text-muted">Suggested next</span>
              <span className="flex items-center gap-1 text-[11.5px] font-semibold text-ink-soft" aria-label="Recommended">
                <StarSolidIcon className="h-[13px] w-[13px] text-amber-400" />
                For you
              </span>
            </div>

            <span className="mt-3 inline-flex w-fit rounded-md border border-line px-2 py-[3px] text-[11px] font-medium text-muted transition-colors duration-200 group-hover:border-brand/35 group-hover:bg-brand-soft group-hover:text-brand">
              {item.emoji} {item.slug}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
