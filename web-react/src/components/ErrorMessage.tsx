import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  className 
}: ErrorMessageProps) {
  return (
    <div className={cn('rounded-2xl border border-bad bg-bad-soft p-8 text-center', className)}>
      <div className="mb-3 text-4xl">⚠️</div>
      <h3 className="text-lg font-semibold text-bad">{title}</h3>
      <p className="mt-2 text-sm text-bad">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-bad px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bad-deep"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-bad bg-bad-soft p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-bad">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-bad underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ 
  emoji, 
  title, 
  message, 
  action 
}: { 
  emoji: string; 
  title: string; 
  message: string; 
  action?: { label: string; onClick: () => void } 
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
      <div className="mb-3 text-4xl">{emoji}</div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
