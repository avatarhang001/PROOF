/**
 * PositionAnalyzer Component
 * 
 * Analyze chess positions with Stockfish engine.
 * Provides evaluation, best move suggestions, and tactical hints.
 */

import React, { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { analysisApi } from '../../services/chess';
import type { PositionAnalyzerProps, PositionAnalysisResponse } from '../../types/chess';

export const PositionAnalyzer: React.FC<PositionAnalyzerProps> = ({
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onAnalysisComplete,
}) => {
  const [fen, setFen] = useState(initialFen);
  // @ts-ignore - game state reserved for future use
  const [game] = useState(() => new Chess(initialFen));
  const [analysis, setAnalysis] = useState<PositionAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(15);

  // Handle move
  const handleMove = useCallback((move: any, newFen: string) => {
    setFen(newFen);
    setAnalysis(null); // Clear previous analysis
    // Note: game state is managed internally by ChessBoard
    console.log('Move played:', move);
  }, []);

  // Analyze current position
  const analyzePosition = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analysisApi.analyzePosition({ fen, depth });
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [fen, depth, onAnalysisComplete]);

  // Format score for display
  const formatScore = (score: number): string => {
    if (score === Infinity) return '+M';
    if (score === -Infinity) return '-M';
    const pawn = (score / 100).toFixed(2);
    return score > 0 ? `+${pawn}` : pawn;
  };

  // Get evaluation bar percentage
  const getEvalBarPercentage = (score: number): number => {
    if (score === Infinity) return 100;
    if (score === -Infinity) return 0;
    // Convert centipawns to percentage (clamped between 0-100)
    const normalized = (score / 1000) * 50 + 50;
    return Math.max(0, Math.min(100, normalized));
  };

  const evalBarPercentage = analysis ? getEvalBarPercentage(analysis.evaluation.score) : 50;

  return (
    <div className="position-analyzer">
      <div className="analyzer-header">
        <h3>Position Analysis</h3>
        <div className="analyzer-controls-header">
          <label>
            Depth:
            <input
              type="number"
              min="5"
              max="25"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      <div className="analyzer-content">
        {/* Chessboard */}
        <div className="analyzer-board">
          <ChessBoard
            initialFen={fen}
            onMove={handleMove}
            highlightSquares={
              analysis?.evaluation.bestMove
                ? [
                    analysis.evaluation.bestMove.substring(0, 2),
                    analysis.evaluation.bestMove.substring(2, 4),
                  ]
                : []
            }
          />
        </div>

        {/* Evaluation bar */}
        {analysis && (
          <div className="eval-bar-container">
            <div className="eval-bar">
              <div
                className="eval-bar-black"
                style={{ height: `${100 - evalBarPercentage}%` }}
              />
              <div
                className="eval-bar-white"
                style={{ height: `${evalBarPercentage}%` }}
              />
            </div>
            <div className="eval-score">
              {formatScore(analysis.evaluation.score)}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="analyzer-controls">
        <button
          className="btn btn-primary btn-analyze"
          onClick={analyzePosition}
          disabled={loading}
        >
          {loading ? (
            <>⚙️ Analyzing...</>
          ) : (
            <>🔍 Analyze Position</>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="analyzer-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Analysis results */}
      {analysis && !loading && (
        <div className="analysis-results">
          <div className="analysis-section">
            <h4>Evaluation</h4>
            <div className="analysis-grid">
              <div className="analysis-item">
                <span className="analysis-label">Score:</span>
                <span className="analysis-value score">
                  {formatScore(analysis.evaluation.score)}
                </span>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Best Move:</span>
                <span className="analysis-value best-move">
                  {analysis.evaluation.bestMove || 'None'}
                </span>
              </div>
              {analysis.evaluation.mate !== null && (
                <div className="analysis-item">
                  <span className="analysis-label">Mate in:</span>
                  <span className="analysis-value mate">
                    {Math.abs(analysis.evaluation.mate)}
                  </span>
                </div>
              )}
              <div className="analysis-item">
                <span className="analysis-label">Depth:</span>
                <span className="analysis-value">{analysis.evaluation.depth}</span>
              </div>
            </div>
          </div>

          {/* Principal Variation */}
          {analysis.evaluation.pv && analysis.evaluation.pv.length > 0 && (
            <div className="analysis-section">
              <h4>Principal Variation</h4>
              <div className="pv-moves">
                {analysis.evaluation.pv.map((move, i) => (
                  <span key={i} className="pv-move">
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tactical hints */}
          {analysis.hints.tactics.length > 0 && (
            <div className="analysis-section">
              <h4>Tactical Themes</h4>
              <ul className="tactical-hints">
                {analysis.hints.tactics.map((tactic, i) => (
                  <li key={i} className="tactical-hint">
                    <span className="hint-icon">💡</span>
                    {tactic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Threats */}
          {analysis.hints.threats.length > 0 && (
            <div className="analysis-section">
              <h4>Threats</h4>
              <ul className="threats-list">
                {analysis.hints.threats.map((threat, i) => (
                  <li key={i} className="threat-item">
                    <span className="threat-icon">⚠️</span>
                    {threat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PositionAnalyzer;
