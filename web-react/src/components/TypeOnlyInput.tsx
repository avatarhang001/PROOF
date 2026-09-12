import { useState } from 'react';
import { usePasteBlocker } from '../utils/pasteBlocker';

export interface TypeOnlyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  className?: string;
  rows?: number;
  disabled?: boolean;
  onPasteAttempt?: () => void;
  showBlockedIndicator?: boolean;
}

/**
 * Input component that blocks pasting
 * Used for proof challenges where typing is required
 */
export function TypeOnlyInput({
  value,
  onChange,
  placeholder = 'Type here...',
  type = 'text',
  className = '',
  rows = 4,
  disabled = false,
  onPasteAttempt,
  showBlockedIndicator = true,
}: TypeOnlyInputProps) {
  const [pasteAttempts, setPasteAttempts] = useState(0);
  
  const pasteBlocker = usePasteBlocker({
    showWarning: true,
    warningMessage: '⚠️ Pasting is disabled. Type to prove your skills!',
    onPasteAttempt: () => {
      setPasteAttempts((prev) => prev + 1);
      onPasteAttempt?.();
    },
  });

  const baseClasses = `w-full rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted hover:border-brand/40 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  return (
    <div className="relative">
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...pasteBlocker}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={baseClasses}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...pasteBlocker}
          placeholder={placeholder}
          disabled={disabled}
          className={baseClasses}
        />
      )}
      
      {/* Paste Blocked Indicator */}
      {showBlockedIndicator && pasteAttempts > 0 && (
        <div className="absolute -top-2 right-3 rounded-full bg-warn px-2 py-0.5 text-xs font-bold text-white shadow-sm">
          {pasteAttempts} paste {pasteAttempts === 1 ? 'attempt' : 'attempts'} blocked
        </div>
      )}
      
      {/* Type-only badge */}
      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01" />
          <path d="M10 8h.01" />
          <path d="M14 8h.01" />
          <path d="M18 8h.01" />
          <path d="M8 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16 12h.01" />
          <path d="M7 16h10" />
        </svg>
        <span>Type-only input · Pasting disabled</span>
      </div>
    </div>
  );
}
