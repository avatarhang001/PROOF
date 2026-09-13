import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challengesService } from '../services/challenges.service';
import type { DailyChallenge as DailyChallengeType } from '../types/api';
import { BoltIcon, StarIcon } from './Icons';

export function DailyChallenge() {
  const [challenge, setChallenge] = useState<DailyChallengeType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const response = await challengesService.getTodayDaily();
      setChallenge(response.challenge as DailyChallengeType);
    } catch (err) {
      console.error('Failed to load daily challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl p-12" style={{ background: 'var(--grad-hero)' }}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="text-sm text-muted">No daily challenge available right now</p>
      </div>
    );
  }

  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl p-4 shadow-card sm:p-6" style={{ background: 'var(--grad-hero)' }}>
      {/* Background Accent */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 opacity-20"
        aria-hidden="true"
      >
        <StarIcon className="h-full w-full text-white" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="h-2 w-2 shrink-0 rounded-full bg-ok-deep shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-white/75 sm:text-[12px]">Live Challenge</span>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0 flex-1 pr-1">
            <h3 className="break-words font-display text-[18px] font-bold leading-tight text-white sm:text-[20px]">
              {challenge.title}
            </h3>
          </div>

          <div className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-[#FFF5CC]/12 px-2.5 py-1.5 text-[11px] font-bold text-[#FFE79A] backdrop-blur-sm sm:text-[12.5px]">
            <BoltIcon className="h-3.5 w-3.5 text-[#FFD76A] sm:h-4 sm:w-4" />
            <span>+{challenge.xp} XP</span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 max-w-[65ch] break-words text-[13px] leading-relaxed text-white/75 sm:text-[14px]">{challenge.description}</p>

        {/* Rewards */}
        <div className="mb-5 flex flex-wrap gap-2.5">
          {challenge.badge && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[12.5px] font-semibold text-gold">
              🏆 {challenge.badge}
            </div>
          )}
          {challenge.timeLimit && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[12.5px] font-medium text-white/80">
              ⏱️ {challenge.timeLimit}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link
          to={`/prove/challenge/${challenge.id}`}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-center font-display text-[15px] font-extrabold text-[#1F2763] shadow-[0_8px_24px_-6px_rgba(255,255,255,0.3)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Challenge
        </Link>
      </div>
    </div>
  );
}
