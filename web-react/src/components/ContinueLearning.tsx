import type { LearningPath } from "@/types/api";
import { CARD, PANEL_PAD } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { BookOpenIcon, CleanStarIcon, PlayIcon } from "./Icons";
import { useInView } from "./Reveal";

export function ContinueLearning({ path }: { path: LearningPath }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const nextItem = path.days.flatMap((day) => day.items).find((item) => !item.lessonDone || !item.practiceDone);
  const lesson = nextItem?.title || 'Path complete — review your progress';

  return (
    <section aria-labelledby="continue-learning" className={`${CARD} ${PANEL_PAD}`}>
      <PanelHeader id="continue-learning" title="Continue learning" action="View path" actionTo={`/learn/path/${path.id}`} />

      <div className="group cursor-pointer rounded-xl border border-line bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover">
        <div className="flex gap-3.5">
          <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[11px] bg-[#1a1330] ring-1 ring-black/5 sm:h-[88px] sm:w-[88px]">
            <img
              src="/course-webdev.jpg"
              alt="Course illustration"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
              {path.title}
            </h3>
            <p className="mt-1 truncate text-[13px] text-muted">{lesson}</p>

            <div className="mt-3.5 flex items-center gap-3">
              <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-track" ref={ref}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#6d28d9] to-[#4c1d95] transition-[width] duration-[1200ms] ease-out"
                  style={{ width: inView ? `${path.percent}%` : "0%" }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-[12px] font-semibold text-muted tabular-nums">
                {path.percent}%
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-3 divide-x divide-line border-t border-line pt-2.5">
          {[
            { id: 'time', label: `${path.minutesPerDay} min/day`, icon: PlayIcon },
            { id: 'days', label: `${path.days.length} days`, icon: BookOpenIcon },
            { id: 'reward', label: `${path.rewardNim} NIM`, icon: CleanStarIcon },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-center gap-2 px-1">
                <Icon className="h-[15px] w-[15px] shrink-0 text-faint" />
                <dd className="truncate text-[12.5px] font-medium text-muted">{item.label}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
