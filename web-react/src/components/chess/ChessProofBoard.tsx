import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { analysisApi } from '../../services/chess';
import type { Challenge, ChessChallengePosition } from '../../types/api';
import type { PositionAnalysisResponse } from '../../types/chess';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type ChessProofPayload = {
  positions: Array<{ positionKey: number; initialFen: string; moves: string[] }>;
};

type MoveRecord = ChessProofPayload['positions'][number];

function playEngineMove(fen: string, notation: string | null) {
  if (!notation) return null;

  try {
    const game = new Chess(fen);
    const move = game.move(notation, { strict: true });
    return move ? { fen: game.fen(), san: move.san } : null;
  } catch {
    try {
      const game = new Chess(fen);
      const uci = notation.trim().match(/^([a-h][1-8])([a-h][1-8])([qrbn])?$/i);
      if (!uci) return null;
      const move = game.move({ from: uci[1], to: uci[2], promotion: uci[3]?.toLowerCase() as 'q' | 'r' | 'b' | 'n' | undefined });
      return move ? { fen: game.fen(), san: move.san } : null;
    } catch {
      return null;
    }
  }
}

export function ChessProofBoard({ challenge, disabled = false, onChange }: {
  challenge: Challenge;
  disabled?: boolean;
  onChange: (payload: ChessProofPayload) => void;
}) {
  const positions = useMemo<ChessChallengePosition[]>(() => {
    const chess = challenge.chess;
    const configured = [...(chess?.scenarios || []), ...(chess?.positions || []), ...(chess?.puzzles || [])]
      .filter((position) => position.fen);
    return configured.length ? configured : [{
      name: 'Analysis board',
      fen: chess?.fen || STARTING_FEN,
      task: chess?.tasks?.join(' • ') || challenge.brief || 'Play a legal line and review every position with the AI coach.',
      hint: 'The AI coach evaluates the current FEN after each move.',
    }];
  }, [challenge]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [records, setRecords] = useState<MoveRecord[]>([]);
  const [boardVersion, setBoardVersion] = useState(0);
  const [currentFen, setCurrentFen] = useState('');
  const [analysis, setAnalysis] = useState<PositionAnalysisResponse | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const analysisRequest = useRef(0);
  const active = positions[activeIndex] || positions[0];
  const activeRecord = records.find((record) => record.positionKey === activeIndex);
  const boardStatus = useMemo(() => {
    try {
      const game = new Chess(currentFen || active.fen);
      if (game.isCheckmate()) return { label: 'Checkmate', description: 'The checked king has no legal escape.', tone: 'bg-bad-soft text-bad' };
      if (game.isStalemate()) return { label: 'Stalemate', description: 'No legal move, but the king is not in check: draw.', tone: 'bg-warn-soft text-warn' };
      if (game.isCheck()) return { label: 'Check', description: 'The king is attacked and must respond.', tone: 'bg-brand-soft text-brand' };
      return { label: 'In play', description: 'No check, checkmate, or stalemate.', tone: 'bg-elevated text-muted' };
    } catch {
      return { label: 'Position unavailable', description: 'Make a legal move to update the board state.', tone: 'bg-elevated text-muted' };
    }
  }, [active.fen, currentFen]);

  useEffect(() => {
    onChange({ positions: records.filter((record) => record.moves.length) });
  }, [records, onChange]);

  const analyse = async (fen: string): Promise<PositionAnalysisResponse | null> => {
    const requestId = ++analysisRequest.current;
    try {
      setAnalysing(true);
      setAnalysisError(null);
      const nextAnalysis = await analysisApi.analyzePosition({ fen, depth: 15 });
      if (requestId === analysisRequest.current) {
        setAnalysis(nextAnalysis);
        return nextAnalysis;
      }
      return null;
    } catch (error) {
      if (requestId === analysisRequest.current) {
        setAnalysisError(error instanceof Error ? error.message : 'AI analysis is unavailable right now.');
      }
      return null;
    } finally {
      if (requestId === analysisRequest.current) {
        setAnalysing(false);
      }
    }
  };

  useEffect(() => {
    analysisRequest.current += 1;
    setAnalysis(null);
    setAnalysisError(null);
    setCurrentFen(active.fen);
    setAiThinking(false);
  }, [active.fen, activeIndex, boardVersion]);

  const resetLine = () => {
    setRecords((current) => current.filter((record) => record.positionKey !== activeIndex));
    setBoardVersion((version) => version + 1);
  };

  const score = analysis?.evaluation.score;
  const scoreLabel = typeof score === 'number'
    ? `${score > 0 ? '+' : ''}${(score / 100).toFixed(2)} for White`
    : 'Position evaluated';

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-elevated/60">
      <div className="border-b border-line bg-surface px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Interactive FEN board</p>
            <h2 className="mt-1 text-lg font-bold text-ink">Solve the position with the AI coach.</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">Make a legal move, watch the AI reply, then review the analysis of the resulting position.</p>
          </div>
          <span className="rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {records.length}/{positions.length} line{positions.length === 1 ? '' : 's'} recorded
          </span>
        </div>
      </div>

      {positions.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-line bg-surface px-4 py-3" aria-label="Chess positions">
          {positions.map((position, index) => {
            const complete = records.some((record) => record.positionKey === index && record.moves.length);
            return (
              <button
                key={`${position.fen}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${activeIndex === index ? 'bg-ink text-surface' : 'border border-line bg-elevated text-muted hover:text-ink'}`}
              >
                {complete ? '✓ ' : ''}{position.name || `Position ${index + 1}`}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)]">
        <div className="min-w-0">
          <ChessBoard
            key={`${active.fen}-${boardVersion}`}
            initialFen={currentFen || active.fen}
            disabled={disabled || aiThinking}
            onMove={(move, finalFen) => {
              setAiThinking(true);
              setRecords((current) => {
                const prior = current.find((record) => record.positionKey === activeIndex);
                const next = { positionKey: activeIndex, initialFen: active.fen, moves: [...(prior?.moves || []), move.san] };
                return [...current.filter((record) => record.positionKey !== activeIndex), next];
              });
              setCurrentFen(finalFen);
              setAnalysis(null);
              void (async () => {
                const playerAnalysis = await analyse(finalFen);
                if (!playerAnalysis) {
                  setAiThinking(false);
                  return;
                }

                const engineMove = playEngineMove(finalFen, playerAnalysis.evaluation.bestMove);
                if (!engineMove) {
                  setAiThinking(false);
                  return;
                }

                setAnalysis(null);
                setCurrentFen(engineMove.fen);
                setRecords((current) => {
                  const prior = current.find((record) => record.positionKey === activeIndex);
                  const next = { positionKey: activeIndex, initialFen: active.fen, moves: [...(prior?.moves || []), engineMove.san] };
                  return [...current.filter((record) => record.positionKey !== activeIndex), next];
                });

                await analyse(engineMove.fen);
                setAiThinking(false);
              })();
            }}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="border-b border-line pb-4">
            <p className="text-sm font-bold text-ink">{active.name || `Position ${activeIndex + 1}`}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{active.task || 'Choose a legal continuation and inspect the AI evaluation.'}</p>
            {active.hint && <p className="mt-2 rounded-lg border border-brand/15 bg-brand-soft/60 px-3 py-2 text-xs leading-relaxed text-brand">Coach hint: {active.hint}</p>}
            <div className={`mt-3 rounded-lg px-3 py-2 ${boardStatus.tone}`}>
              <p className="text-xs font-bold">Board state: {boardStatus.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed">{boardStatus.description}</p>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Recorded line</p>
              <button type="button" onClick={resetLine} disabled={disabled || !activeRecord} className="text-xs font-semibold text-brand hover:text-brand-deep disabled:cursor-not-allowed disabled:opacity-40">Reset line</button>
            </div>
              <p className="mt-2 min-h-5 break-words font-mono text-sm text-ink">{activeRecord?.moves.length ? activeRecord.moves.join('  ') : 'Your move starts the puzzle line.'}</p>
          </div>

          <div className="rounded-xl border border-brand/20 bg-brand-soft/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">AI position check</p>
                <p className="mt-0.5 text-xs text-muted">Analyses the current FEN, not a written answer.</p>
              </div>
              <button type="button" onClick={() => void analyse(currentFen || active.fen)} disabled={disabled || aiThinking || analysing} className="rounded-lg bg-ink px-3 py-2 text-xs font-bold text-surface transition-colors hover:bg-brand disabled:opacity-50">
                {analysing ? 'Analysing…' : 'Analyse position'}
              </button>
            </div>
            {analysing && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-brand/15 bg-surface px-3 py-2 text-sm text-brand" role="status">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <span>{aiThinking ? 'AI is replying to your move…' : 'AI is reviewing the position…'}</span>
              </div>
            )}
            {analysis && !analysing && <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p className="sm:col-span-2 font-semibold text-brand">AI response to the latest position</p>
              <p><span className="text-muted">Evaluation </span><span className="font-semibold text-ink">{scoreLabel}</span></p>
              <p><span className="text-muted">Best move </span><span className="font-semibold text-ink">{analysis.evaluation.bestMove || 'No legal move'}</span></p>
              {analysis.hints.tactics.length > 0 && <p className="sm:col-span-2 text-muted">{analysis.hints.tactics.join(' · ')}</p>}
              {analysis.hints.threats.length > 0 && <p className="sm:col-span-2 text-muted">{analysis.hints.threats.join(' · ')}</p>}
            </div>}
            {analysisError && <p className="mt-3 text-xs text-bad">{analysisError}</p>}
          </div>

          <p className="break-all rounded-lg border border-line bg-surface px-3 py-2 font-mono text-[11px] leading-relaxed text-muted">FEN: {currentFen || active.fen}</p>
        </div>
      </div>
    </section>
  );
}
