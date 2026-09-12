import { useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type Replay = {
  label?: string;
  title: string;
  caption: string;
  initialFen?: string;
  moves: string[];
};

const LESSON_REPLAYS: Record<string, Replay> = {
  'board-basics': {
    title: 'Start from the board',
    caption: 'Step through a simple opening to see pawns open lines and knights develop.',
    moves: ['e4', 'e5', 'Nf3', 'Nc6'],
  },
  'special-moves': {
    title: 'Kingside castling',
    caption: 'Notice that both the king and rook move together when you step forward.',
    initialFen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    moves: ['O-O'],
  },
  'chess-notation': {
    title: 'A move written, then seen',
    caption: 'Read each notation token below, then watch that exact piece move on the board.',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O'],
  },
  'fundamental-tactics': {
    title: 'The pin in position',
    caption: 'The bishop targets the knight in front of Black’s king. Step through the tactical continuation.',
    initialFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
    moves: ['Bxf7+'],
  },
  'opening-principles': {
    title: 'A principled opening',
    caption: 'Center control, development, and castling arrive as visible moves—not a checklist.',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O'],
  },
  'basic-endgames': {
    title: 'Restrict the king',
    caption: 'Use the queen to reduce the enemy king’s space, then bring your king closer.',
    initialFen: '2k5/K7/8/8/Q7/8/8/8 w - - 0 1',
    moves: ['Qb5', 'Kd8', 'Qb7'],
  },
  'chess-thinking': {
    title: 'Calculate from the position',
    caption: 'Before the move, inspect the threats. After it, use the changed board to test the next idea.',
    initialFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4',
    moves: ['Nxe4'],
  },
  'opening-systems-e4': {
    title: 'Italian Game development',
    caption: 'Replay a compact Italian setup and watch each side claim space and develop.',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4'],
  },
  'opening-systems-d4': {
    title: 'Queen’s Gambit structure',
    caption: 'The center takes shape move by move in this Queen’s Gambit Declined line.',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5'],
  },
  'pawn-structure': {
    title: 'The center forms a structure',
    caption: 'Step through the pawn exchanges that create long-term strengths and weaknesses.',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5'],
  },
  'elementary-endgames': {
    title: 'Opposition on the board',
    caption: 'With kings facing each other, every tempo changes who must give way.',
    initialFen: '8/8/4k3/8/4K3/8/8/8 b - - 0 1',
    moves: ['Kd6', 'Kf5'],
  },
  'complex-endgames': {
    title: 'Build the bridge',
    caption: 'A rook endgame is easier to understand when the defensive checks and king route are visible.',
    initialFen: '4k3/4P1K1/8/8/8/8/4r3/3R4 w - - 0 1',
    moves: ['Rf1'],
  },
};

const SPECIAL_MOVE_REPLAYS: Replay[] = [
  {
    label: 'Castling',
    title: 'Castling moves two pieces',
    caption: 'The king moves two squares toward its rook, then the rook crosses to the square beside it.',
    initialFen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    moves: ['O-O'],
  },
  {
    label: 'En passant',
    title: 'En passant is immediate',
    caption: 'White captures the pawn as though it advanced only one square. This right disappears after the next move.',
    initialFen: 'rnbqkbnr/pppp1ppp/8/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 3',
    moves: ['dxe6'],
  },
  {
    label: 'Promotion',
    title: 'Promotion can finish the game',
    caption: 'Promote g7 to a queen. The new queen is protected, so Black has no escape: checkmate.',
    initialFen: '7k/5KP1/8/8/8/8/8/8 w - - 0 1',
    moves: ['g8=Q#'],
  },
];

function replaysFor(topic: string, exampleFen?: string): Replay[] {
  if (topic === 'special-moves') return SPECIAL_MOVE_REPLAYS;
  return [LESSON_REPLAYS[topic] || {
    title: 'See the position change',
    caption: 'Replay a short developing line, then connect the visual position to the lesson’s ideas.',
    initialFen: exampleFen || STARTING_FEN,
    moves: exampleFen ? [] : ['e4', 'e5', 'Nf3', 'Nc6'],
  }];
}

export function ChessLessonReplay({ topic, exampleFen }: { topic: string; exampleFen?: string }) {
  const replays = useMemo(() => replaysFor(topic, exampleFen), [topic, exampleFen]);
  const [replayIndex, setReplayIndex] = useState(0);
  const replay = replays[Math.min(replayIndex, replays.length - 1)];
  const frames = useMemo(() => {
    let game: Chess;
    try {
      game = new Chess(replay.initialFen || STARTING_FEN);
    } catch {
      game = new Chess(STARTING_FEN);
    }
    const next = [{ fen: game.fen(), move: null as string | null }];
    for (const move of replay.moves) {
      try {
        const played = game.move(move, { strict: true });
        if (!played) break;
        next.push({ fen: game.fen(), move: played.san });
      } catch {
        break;
      }
    }
    return next;
  }, [replay]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setReplayIndex(0);
    setStep(0);
  }, [topic, exampleFen]);

  useEffect(() => setStep(0), [replayIndex, replay.initialFen]);

  const current = frames[Math.min(step, frames.length - 1)];
  const visibleMoves = frames.slice(1).map((frame) => frame.move).filter(Boolean) as string[];

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-elevated/60">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4">
        <div>
          <h3 className="text-lg font-bold text-ink">{replay.title}</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{replay.caption}</p>
        </div>
        <span className="rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          Move {step} of {visibleMoves.length}
        </span>
      </div>

      {replays.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-line bg-surface px-5 py-3" aria-label="Special move demonstrations">
          {replays.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setReplayIndex(index)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${replayIndex === index ? 'bg-ink text-surface' : 'bg-elevated text-muted hover:bg-brand-soft hover:text-ink'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid items-start gap-5 p-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="min-w-0">
          <ChessBoard initialFen={current.fen} disabled showCoordinates />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-bold text-ink">{step === 0 ? 'Starting position' : `Move played: ${current.move}`}</p>
            <p className="mt-1 text-sm text-muted">Use the controls to move through the line one position at a time.</p>
          </div>

          {topic === 'special-moves' && (
            <div className="border-t border-line pt-4">
              <h4 className="text-sm font-bold text-ink">Read the board state</h4>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="font-semibold text-brand">Check</dt><dd className="mt-1 text-muted">The king is attacked and must respond.</dd></div>
                <div><dt className="font-semibold text-bad">Checkmate</dt><dd className="mt-1 text-muted">The king is checked with no legal escape.</dd></div>
                <div><dt className="font-semibold text-warn">Stalemate</dt><dd className="mt-1 text-muted">No legal move, but no check: a draw.</dd></div>
              </dl>
            </div>
          )}

          {visibleMoves.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-label="Replay moves">
              {visibleMoves.map((move, index) => (
                <button
                  key={`${move}-${index}`}
                  type="button"
                  onClick={() => setStep(index + 1)}
                  className={`rounded-lg px-3 py-2 font-mono text-sm font-semibold transition-colors ${step === index + 1 ? 'bg-ink text-surface' : 'border border-line bg-surface text-muted hover:border-brand/35 hover:text-ink'}`}
                  aria-label={`Show move ${index + 1}: ${move}`}
                >
                  {index + 1}. {move}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-brand/20 bg-brand-soft/60 p-3 text-sm text-brand">Explore this diagram with the lesson text, then use its proof board to make your own legal line.</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))} disabled={step === 0} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-45">
              <ChevronLeftIcon className="h-4 w-4" /> Previous
            </button>
            <button type="button" onClick={() => setStep((currentStep) => Math.min(frames.length - 1, currentStep + 1))} disabled={step === frames.length - 1} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-bold text-surface transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-45">
              Next <ChevronRightIcon className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setStep(0)} disabled={step === 0} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-45">
              <ArrowPathIcon className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
