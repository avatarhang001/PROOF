/**
 * Stockfish Chess Engine Service
 * 
 * Wrapper for Stockfish chess engine providing:
 * - Position evaluation (centipawn scores)
 * - Best move calculation
 * - Move validation and legality checking
 * - Game analysis
 * - Checkmate/stalemate detection
 * 
 * Uses chess.js for move generation and stockfish for evaluation.
 * For actual Stockfish integration, install: npm install stockfish chess.js
 */

import { Chess } from 'chess.js';

/**
 * Stockfish Engine Wrapper
 * 
 * Note: Native Stockfish can be attached in production. Until then, the
 * deterministic alpha-beta fallback below analyses legal continuations rather
 * than returning a mocked first legal move.
 *
 * For native Stockfish integration:
 * 1. Install: npm install stockfish chess.js
 * 2. Import: import Stockfish from 'stockfish'
 * 3. Use UCI protocol for communication
 */
class StockfishEngine {
  constructor() {
    this.engine = null;
    this.ready = false;
    this.analyzing = false;
    this.currentPosition = null;
  }

  /**
   * Initialize the engine
   * @returns {Promise<void>}
   */
  async init() {
    if (this.ready) return;
    
    try {
      // In production, initialize actual Stockfish engine:
      // this.engine = new Stockfish();
      // await this.setupEngine();
      
      // The built-in alpha-beta fallback is always available.
      this.ready = true;
      console.log('♟️  Stockfish engine initialized (stub mode)');
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
      throw error;
    }
  }

  /**
   * Setup engine with UCI commands
   * @private
   */
  async setupEngine() {
    // Send UCI initialization commands
    // this.send('uci');
    // this.send('setoption name Skill Level value 20');
    // this.send('isready');
    // Wait for 'readyok' response
  }

  /**
   * Send command to engine
   * @param {string} cmd - UCI command
   * @private
   */
  send(cmd) {
    if (this.engine && this.engine.postMessage) {
      this.engine.postMessage(cmd);
    }
  }

  /**
   * Evaluates a position and returns centipawn score
   * @param {string} fen - Position in FEN notation
   * @param {Object} options - { depth: 15, multiPV: 1 }
   * @returns {Promise<Object>} - { score, mate, bestMove, pv }
   */
  async evaluatePosition(fen, options = {}) {
    await this.init();
    
    const { depth = 15 } = options;
    
    // In production:
    // this.send(`position fen ${fen}`);
    // this.send(`go depth ${depth}`);
    // Wait for 'bestmove' and parse evaluation
    
    const chess = new Chess(fen);
    
    if (chess.isCheckmate()) {
      return {
        score: chess.turn() === 'w' ? -Infinity : Infinity,
        mate: chess.turn() === 'w' ? -1 : 1,
        bestMove: null,
        pv: [],
        depth,
      };
    }
    
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return {
        score: 0,
        mate: 0,
        bestMove: null,
        pv: [],
        depth,
      };
    }
    
    // Cap the portable fallback so the endpoint remains fast enough to use
    // after each board move. The selected move comes from searched lines.
    const searchDepth = Math.min(3, Math.max(1, Number(depth) || 1));
    const result = this.search(chess, searchDepth, -Infinity, Infinity, 0);
    const score = result.score;
    const bestMove = result.line[0] || moves[0].san;
    
    return {
      score,
      mate: null,
      bestMove,
      pv: result.line.length ? result.line : [bestMove],
      depth: searchDepth,
      fen,
    };
  }

  /**
   * Simple material-based evaluation
   * @param {Chess} chess - Chess.js instance
   * @returns {number} - Centipawn score (positive = white advantage)
   * @private
   */
  simpleEval(chess) {
    const board = chess.board();
    const values = { p: 100, n: 300, b: 300, r: 500, q: 900, k: 0 };
    let score = 0;
    
    for (const row of board) {
      for (const square of row) {
        if (square) {
          const value = values[square.type] || 0;
          score += square.color === 'w' ? value : -value;
        }
      }
    }
    
    return score;
  }

  /**
   * Portable alpha-beta fallback. Scores are from White's perspective, which
   * keeps the public API stable while choosing a move from legal variations.
   */
  search(chess, depth, alpha, beta, ply) {
    if (chess.isCheckmate()) {
      return { score: chess.turn() === 'w' ? -100000 + ply : 100000 - ply, line: [] };
    }
    if (chess.isDraw() || depth === 0) return { score: this.simpleEval(chess), line: [] };

    const maximizing = chess.turn() === 'w';
    const moves = chess.moves({ verbose: true }).sort((a, b) => this.moveOrder(b) - this.moveOrder(a));
    let best = maximizing ? -Infinity : Infinity;
    let line = [];

    for (const move of moves) {
      chess.move(move);
      const next = this.search(chess, depth - 1, alpha, beta, ply + 1);
      chess.undo();
      if ((maximizing && next.score > best) || (!maximizing && next.score < best)) {
        best = next.score;
        line = [move.san, ...next.line];
      }
      if (maximizing) alpha = Math.max(alpha, best);
      else beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return { score: best, line };
  }

  moveOrder(move) {
    const central = new Set(['d4', 'e4', 'd5', 'e5']);
    const nearCenter = new Set(['c3', 'f3', 'c6', 'f6', 'c4', 'f4', 'c5', 'f5']);
    return (move.captured ? 1000 : 0) + (move.san.includes('+') ? 80 : 0)
      + (central.has(move.to) ? 40 : 0) + (nearCenter.has(move.to) ? 20 : 0)
      + (move.piece === 'n' || move.piece === 'b' ? 5 : 0);
  }

  /**
   * Gets the best move for a position
   * @param {string} fen - Position in FEN notation
   * @param {number} depth - Search depth (default: 15)
   * @returns {Promise<string>} - Best move in algebraic notation
   */
  async getBestMove(fen, depth = 15) {
    const evaluation = await this.evaluatePosition(fen, { depth });
    return evaluation.bestMove;
  }

  /**
   * Analyzes a complete game
   * @param {string} pgn - Game in PGN format
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis with mistakes, blunders, etc.
   */
  async analyzeGame(pgn, options = {}) {
    await this.init();
    
    const { depth = 12, threshold = { blunder: 300, mistake: 100, inaccuracy: 50 } } = options;
    
    const chess = new Chess();
    chess.loadPgn(pgn);
    
    const moves = chess.history({ verbose: true });
    const analysis = {
      moves: [],
      mistakes: [],
      blunders: [],
      inaccuracies: [],
      goodMoves: [],
      bestMoves: [],
      accuracy: { white: 0, black: 0 },
    };
    
    // Reset to start
    chess.reset();
    let prevEval = 0;
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const fen = chess.fen();
      
      // Get evaluation before move
      const beforeEval = await this.evaluatePosition(fen, { depth });
      
      // Make the move
      chess.move(move);
      
      // Get evaluation after move
      const afterEval = await this.evaluatePosition(chess.fen(), { depth });
      
      // Calculate evaluation drop
      const turn = move.color === 'w' ? 1 : -1;
      const evalDrop = (afterEval.score * turn) - (beforeEval.score * turn);
      
      // Classify move
      let classification = 'good';
      if (evalDrop < -threshold.blunder) {
        classification = 'blunder';
        analysis.blunders.push({ moveNumber: i + 1, move: move.san, evalDrop });
      } else if (evalDrop < -threshold.mistake) {
        classification = 'mistake';
        analysis.mistakes.push({ moveNumber: i + 1, move: move.san, evalDrop });
      } else if (evalDrop < -threshold.inaccuracy) {
        classification = 'inaccuracy';
        analysis.inaccuracies.push({ moveNumber: i + 1, move: move.san, evalDrop });
      } else if (evalDrop >= 0) {
        classification = 'good';
        analysis.goodMoves.push({ moveNumber: i + 1, move: move.san });
      }
      
      if (move.san === beforeEval.bestMove) {
        classification = 'best';
        analysis.bestMoves.push({ moveNumber: i + 1, move: move.san });
      }
      
      analysis.moves.push({
        moveNumber: i + 1,
        move: move.san,
        fen,
        evaluation: beforeEval.score,
        bestMove: beforeEval.bestMove,
        classification,
        evalDrop,
      });
      
      prevEval = afterEval.score;
    }
    
    // Calculate accuracy percentages
    const whiteMoves = analysis.moves.filter(m => m.moveNumber % 2 === 1);
    const blackMoves = analysis.moves.filter(m => m.moveNumber % 2 === 0);
    
    analysis.accuracy.white = this.calculateAccuracy(whiteMoves);
    analysis.accuracy.black = this.calculateAccuracy(blackMoves);
    
    return analysis;
  }

  /**
   * Calculates accuracy percentage from moves
   * @param {Array} moves - Array of analyzed moves
   * @returns {number} - Accuracy percentage (0-100)
   * @private
   */
  calculateAccuracy(moves) {
    if (moves.length === 0) return 0;
    
    const weights = { best: 1, good: 0.9, inaccuracy: 0.6, mistake: 0.3, blunder: 0 };
    const totalWeight = moves.reduce((sum, m) => sum + (weights[m.classification] || 0.5), 0);
    
    return Math.round((totalWeight / moves.length) * 100);
  }

  /**
   * Validates if a move is legal
   * @param {string} fen - Current position
   * @param {string} move - Move in algebraic notation
   * @returns {Object} - { legal: boolean, newFen?: string, error?: string }
   */
  validateMove(fen, move) {
    try {
      const chess = new Chess(fen);
      const result = chess.move(move);
      
      if (result) {
        return {
          legal: true,
          newFen: chess.fen(),
          move: result,
        };
      } else {
        return {
          legal: false,
          error: 'Illegal move',
        };
      }
    } catch (error) {
      return {
        legal: false,
        error: error.message,
      };
    }
  }

  /**
   * Checks if position is checkmate
   * @param {string} fen - Position in FEN notation
   * @returns {boolean}
   */
  isCheckmate(fen) {
    try {
      const chess = new Chess(fen);
      return chess.isCheckmate();
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if position is stalemate
   * @param {string} fen - Position in FEN notation
   * @returns {boolean}
   */
  isStalemate(fen) {
    try {
      const chess = new Chess(fen);
      return chess.isStalemate();
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if position is draw
   * @param {string} fen - Position in FEN notation
   * @returns {Object} - { draw: boolean, reason?: string }
   */
  isDraw(fen) {
    try {
      const chess = new Chess(fen);
      
      if (chess.isStalemate()) {
        return { draw: true, reason: 'stalemate' };
      }
      if (chess.isThreefoldRepetition()) {
        return { draw: true, reason: 'threefold_repetition' };
      }
      if (chess.isInsufficientMaterial()) {
        return { draw: true, reason: 'insufficient_material' };
      }
      if (chess.isDraw()) {
        return { draw: true, reason: '50_move_rule' };
      }
      
      return { draw: false };
    } catch (error) {
      return { draw: false, error: error.message };
    }
  }

  /**
   * Checks if position is check
   * @param {string} fen - Position in FEN notation
   * @returns {boolean}
   */
  isCheck(fen) {
    try {
      const chess = new Chess(fen);
      return chess.isCheck();
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets all legal moves for a position
   * @param {string} fen - Position in FEN notation
   * @param {Object} options - { verbose: true, square: 'e2' }
   * @returns {Array} - Array of legal moves
   */
  getLegalMoves(fen, options = {}) {
    try {
      const chess = new Chess(fen);
      return chess.moves(options);
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets tactical hints for a position
   * @param {string} fen - Position in FEN notation
   * @returns {Promise<Object>} - Tactical hints
   */
  async getTacticalHints(fen) {
    await this.init();
    
    const chess = new Chess(fen);
    const evaluation = await this.evaluatePosition(fen, { depth: 18 });
    const hints = {
      bestMove: evaluation.bestMove,
      evaluation: evaluation.score,
      threats: [],
      tactics: [],
    };
    
    // Check for checks
    if (chess.isCheck()) {
      hints.threats.push('King is in check - must respond');
    }
    
    // Check if best move is a capture
    const moves = chess.moves({ verbose: true });
    const bestMoveDetails = moves.find(m => m.san === evaluation.bestMove);
    
    if (bestMoveDetails) {
      if (bestMoveDetails.captured) {
        hints.tactics.push('Look for a capture');
      }
      if (bestMoveDetails.promotion) {
        hints.tactics.push('Pawn promotion possible');
      }
      if (this.isCheck(chess.fen())) {
        hints.tactics.push('Check available');
      }
    }
    
    // Check for mate in N
    if (evaluation.mate !== null) {
      hints.tactics.push(`Mate in ${Math.abs(evaluation.mate)} available`);
    }
    
    return hints;
  }

  /**
   * Generates a puzzle from a position
   * @param {string} fen - Position in FEN notation
   * @returns {Promise<Object>} - Puzzle with solution
   */
  async generatePuzzle(fen) {
    await this.init();
    
    const evaluation = await this.evaluatePosition(fen, { depth: 20, multiPV: 3 });
    const chess = new Chess(fen);
    
    // Find tactical solution
    const solution = [evaluation.bestMove];
    chess.move(evaluation.bestMove);
    
    // Get opponent's best response
    const response = await this.getBestMove(chess.fen(), 20);
    if (response) {
      solution.push(response);
      chess.move(response);
    }
    
    // Get follow-up move
    const followUp = await this.getBestMove(chess.fen(), 20);
    if (followUp) {
      solution.push(followUp);
    }
    
    return {
      fen,
      solution,
      evaluation: evaluation.score,
      difficulty: this.estimateDifficulty(evaluation.score, solution.length),
    };
  }

  /**
   * Estimates puzzle difficulty
   * @param {number} evaluation - Centipawn evaluation
   * @param {number} moveCount - Number of moves in solution
   * @returns {string} - Difficulty level
   * @private
   */
  estimateDifficulty(evaluation, moveCount) {
    const absEval = Math.abs(evaluation);
    
    if (moveCount <= 2 && absEval > 500) return 'beginner';
    if (moveCount <= 3 && absEval > 300) return 'intermediate';
    if (moveCount <= 4 && absEval > 200) return 'intermediate';
    return 'advanced';
  }

  /**
   * Cleanup engine resources
   */
  async dispose() {
    if (this.engine) {
      this.send('quit');
      this.engine = null;
    }
    this.ready = false;
  }
}

// Singleton instance
let engineInstance = null;

/**
 * Get Stockfish engine singleton
 * @returns {StockfishEngine}
 */
export function getEngine() {
  if (!engineInstance) {
    engineInstance = new StockfishEngine();
  }
  return engineInstance;
}

/**
 * Convenience functions using singleton
 */

export async function evaluatePosition(fen, options) {
  const engine = getEngine();
  return engine.evaluatePosition(fen, options);
}

export async function getBestMove(fen, depth) {
  const engine = getEngine();
  return engine.getBestMove(fen, depth);
}

export async function analyzeGame(pgn, options) {
  const engine = getEngine();
  return engine.analyzeGame(pgn, options);
}

export function validateMove(fen, move) {
  const engine = getEngine();
  return engine.validateMove(fen, move);
}

export function isCheckmate(fen) {
  const engine = getEngine();
  return engine.isCheckmate(fen);
}

export function isStalemate(fen) {
  const engine = getEngine();
  return engine.isStalemate(fen);
}

export function isDraw(fen) {
  const engine = getEngine();
  return engine.isDraw(fen);
}

export function isCheck(fen) {
  const engine = getEngine();
  return engine.isCheck(fen);
}

export function getLegalMoves(fen, options) {
  const engine = getEngine();
  return engine.getLegalMoves(fen, options);
}

export async function getTacticalHints(fen) {
  const engine = getEngine();
  return engine.getTacticalHints(fen);
}

export async function generatePuzzle(fen) {
  const engine = getEngine();
  return engine.generatePuzzle(fen);
}

export default {
  getEngine,
  evaluatePosition,
  getBestMove,
  analyzeGame,
  validateMove,
  isCheckmate,
  isStalemate,
  isDraw,
  isCheck,
  getLegalMoves,
  getTacticalHints,
  generatePuzzle,
};
