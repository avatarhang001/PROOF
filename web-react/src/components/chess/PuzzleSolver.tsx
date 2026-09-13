/**
 * PuzzleSolver Component
 * 
 * Interactive chess puzzle solver with hints, scoring, and feedback.
 * Tracks user moves and compares against the solution.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { puzzleApi } from '../../services/chess';
import type { PuzzleSolverProps, ChessStatus } from '../../types/chess';
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS, THEME_LABELS } from '../../types/chess';

export const PuzzleSolver: React.FC<PuzzleSolverProps> = ({
  puzzle,
  onComplete,
  onGiveUp,
}) => {
  const [game, setGame] = useState<Chess>(() => new Chess(puzzle.position?.fen || puzzle.positionId));
  const [moves, setMoves] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [status, setStatus] = useState<ChessStatus>('solving');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [boardVersion, setBoardVersion] = useState(0);

  // Reset when puzzle changes
  useEffect(() => {
    const newGame = new Chess(puzzle.position?.fen || puzzle.positionId);
    setGame(newGame);
    setMoves([]);
    setHints([]);
    setHintsUsed(0);
    setStatus('solving');
    setFeedback('');
  }, [puzzle]);

  // Handle move
  const handleMove = useCallback(
    async (move: any, newFen: string) => {
      const newMoves = [...moves, move.san];
      const newGame = new Chess(newFen);
      setGame(newGame);
      setMoves(newMoves);

      // Check if move matches solution
      const solutionIndex = newMoves.length - 1;
      if (puzzle.solution[solutionIndex] !== move.san) {
        setStatus('incorrect');
        setFeedback("That's not the right move. Try again!");
        
        // Reset the board after a delay
        setTimeout(() => {
          const resetGame = new Chess(puzzle.position?.fen || puzzle.positionId);
          setGame(resetGame);
          setBoardVersion((version) => version + 1);
          setMoves([]);
          setStatus('solving');
          setFeedback('');
        }, 1500);
        return;
      }

      // Check if puzzle is complete
      if (newMoves.length === puzzle.solution.length) {
        const timeSpent = Date.now() - startTime;
        setStatus('correct');
        setFeedback('Correct! Well done!');
        
        // Submit attempt
        try {
          const result = await puzzleApi.submitAttempt(puzzle.id, {
            moves: newMoves,
            timeSpentMs: timeSpent,
            hintsUsed,
          });
          setFeedback(`Correct! Score: ${result.score}/100`);
          onComplete?.(result);
        } catch (error) {
          console.error('Failed to submit puzzle:', error);
        }
      } else {
        // Make opponent's response
        const opponentMove = puzzle.solution[newMoves.length];
        setTimeout(() => {
          const gameCopy = new Chess(newFen);
          gameCopy.move(opponentMove);
          setGame(gameCopy);
          setMoves([...newMoves, opponentMove]);
        }, 500);
      }
    },
    [moves, puzzle, startTime, hintsUsed, onComplete]
  );

  // Request hint
  const requestHint = useCallback(async () => {
    if (status !== 'solving') return;
    
    setLoading(true);
    try {
      const response = await puzzleApi.getHint(puzzle.id, hintsUsed + 1);
      setHints([...hints, response.hint]);
      setHintsUsed(hintsUsed + 1);
    } catch (error) {
      console.error('Failed to get hint:', error);
      setFeedback('Failed to load hint. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [puzzle.id, hints, hintsUsed, status]);

  // Reset puzzle
  const resetPuzzle = useCallback(() => {
    const newGame = new Chess(puzzle.position?.fen || puzzle.positionId);
    setGame(newGame);
    setBoardVersion((version) => version + 1);
    setMoves([]);
    setStatus('solving');
    setFeedback('');
  }, [puzzle]);

  // Calculate moves remaining
  const movesRemaining = puzzle.solution.length - moves.length;
  const progress = (moves.length / puzzle.solution.length) * 100;

  return (
    <div className="puzzle-solver">
      {/* Header */}
      <div className="puzzle-header">
        <h3 className="puzzle-title">{puzzle.title}</h3>
        <div className="puzzle-meta">
          <span
            className="puzzle-difficulty"
            style={{ backgroundColor: DIFFICULTY_COLORS[puzzle.difficulty] }}
          >
            {DIFFICULTY_LABELS[puzzle.difficulty]}
          </span>
          <span className="puzzle-rating">⭐ {puzzle.rating}</span>
        </div>
        <div className="puzzle-themes">
          {puzzle.themes.map((theme) => (
            <span key={theme} className="puzzle-theme">
              {THEME_LABELS[theme]}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {status === 'solving' && movesRemaining > 0 && (
        <div className="puzzle-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            {movesRemaining} move{movesRemaining !== 1 ? 's' : ''} remaining
          </div>
        </div>
      )}

      {/* Chessboard */}
      <div className="puzzle-board">
        <ChessBoard
          key={`${game.fen()}-${boardVersion}`}
          initialFen={game.fen()}
          onMove={handleMove}
          disabled={status !== 'solving'}
          orientation={game.turn() === 'w' ? 'white' : 'black'}
        />
      </div>

      {/* Controls */}
      <div className="puzzle-controls">
        <button
          className="btn btn-hint"
          onClick={requestHint}
          disabled={status !== 'solving' || loading || hintsUsed >= puzzle.hints.length}
        >
          💡 Hint {hintsUsed > 0 && `(${hintsUsed})`}
        </button>
        <button
          className="btn btn-reset"
          onClick={resetPuzzle}
          disabled={status !== 'solving'}
        >
          🔄 Reset
        </button>
        {onGiveUp && (
          <button
            className="btn btn-give-up"
            onClick={onGiveUp}
            disabled={status !== 'solving'}
          >
            Show Solution
          </button>
        )}
      </div>

      {/* Hints panel */}
      {hints.length > 0 && (
        <div className="puzzle-hints">
          {hints.map((hint, i) => (
            <div key={i} className="hint-item">
              <span className="hint-icon">💡</span>
              <span className="hint-text">{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`puzzle-feedback ${status}`}>
          {status === 'correct' && <span className="feedback-icon">✅</span>}
          {status === 'incorrect' && <span className="feedback-icon">❌</span>}
          <span className="feedback-text">{feedback}</span>
        </div>
      )}

      {/* Solution explanation (shown after completion) */}
      {status === 'correct' && (
        <div className="puzzle-explanation">
          <h4>Explanation</h4>
          <p>{puzzle.solutionExplanation}</p>
          <div className="solution-moves">
            <strong>Solution:</strong> {puzzle.solution.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleSolver;
