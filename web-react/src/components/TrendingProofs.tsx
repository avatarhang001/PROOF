import type { SkillCatalog } from "@/types/api";
import { BADGE_GOLD, CARD, PANEL_PAD } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { ChevronRightIcon } from "./Icons";

export function TrendingProofs({ skills }: { skills: SkillCatalog[] }) {
  return (
    <section aria-labelledby="trending-proofs" className={`${CARD} ${PANEL_PAD}`}>
      <PanelHeader id="trending-proofs" title="Trending proofs" action="View all" actionTo="/prove" />

      <ul className="divide-y divide-line/70">
        {skills.slice(0, 3).map((item, index) => (
          <li key={item.slug} className="-mx-2 rounded-lg px-2 transition-colors duration-200 hover:bg-elevated">
            <div className="group flex cursor-pointer items-center gap-3 py-[10px]">
              <span className="w-4 shrink-0 font-display text-[12px] font-bold text-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-brand-soft text-xl ring-1 ring-black/5">
                {item.emoji}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="mt-0.5 truncate text-[12px] text-muted">{item.description}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className={`${BADGE_GOLD} px-2.5 py-1 text-[11.5px]`}>{item.learners || 0} learners</span>
                <ChevronRightIcon className="h-4 w-4 -translate-x-1 text-faint opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
