import { PILL } from "@/lib/utils";
import { ArrowRightIcon } from "./Icons";
import { Link } from "react-router-dom";

export function PanelHeader({
  title,
  subtitle,
  action,
  actionTo,
  onActionClick,
  id,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  actionTo?: string;
  onActionClick?: () => void;
  id?: string;
}) {
  return (
    <div className="mb-3.5 flex items-center justify-between gap-3">
      <div>
        <h2
          id={id}
          className="font-display text-[15.5px] font-bold tracking-[-0.01em] text-ink"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-ink/60">{subtitle}</p>
        )}
      </div>
      {action && actionTo ? (
        <Link to={actionTo} className={`${PILL} group`}>
          {action}
          <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      ) : action && onActionClick ? (
        <button type="button" onClick={onActionClick} className={`${PILL} group`}>
          {action}
          <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
        </button>
      ) : action ? (
        <button type="button" className={`${PILL} group`}>
          {action}
          <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
        </button>
      ) : null}
    </div>
  );
}
