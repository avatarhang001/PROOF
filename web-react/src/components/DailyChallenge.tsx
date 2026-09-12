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
    <div className="relative overflow-hidden rounded-2xl p-6 shadow-card" style={{ background: 'var(--grad-hero)' }}>
      {/* Background Accent */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 opacity-20"
        aria-hidden="true"
      >
        <StarIcon className="h-full w-full text-white" />
      </div>

      <div className="relative">
        {/* Badge */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-ok-deep shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-white/75">Live Challenge</span>
        </div>

        {/* Title */}
        <h3 className="mb-2.5 font-display text-[20px] font-bold leading-tight text-white">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="mb-5 text-[14px] leading-relaxed text-white/75">{challenge.description}</p>

        {/* Rewards */}
        <div className="mb-5 flex flex-wrap gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-[12.5px] font-bold text-white backdrop-blur-sm">
            <BoltIcon className="h-4 w-4 text-gold" />
            +{challenge.xp} XP
          </div>
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
          className="w-full rounded-xl bg-white py-4 font-display text-[15px] font-extrabold text-[#1F2763] shadow-[0_8px_24px_-6px_rgba(255,255,255,0.3)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Challenge
        </Link>
      </div>
    </div>
  );
}
