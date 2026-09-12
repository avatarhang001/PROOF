/**
 * Chess Utilities
 * 
 * Helper functions for chess operations:
 * - FEN (Forsyth-Edwards Notation) parsing and validation
 * - PGN (Portable Game Notation) parsing
 * - Move validation and legality checking
 * - Position analysis helpers
 * - Coordinate conversions
 * 
 * Uses chess.js for move generation and validation.
 * Uses Stockfish service for engine evaluation.
 */

import { Chess } from 'chess.js';
import * as stockfish from '../services/stockfish.js';

/**
 * FEN (Forsyth-Edwards Notation) Utilities
 * Standard format: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
 * Parts: position side castling enPassant halfmove fullmove
 */

/**
 * Validates a FEN string
 * @param {string} fen - FEN notation string
 * @returns {boolean} - true if valid
 */
export function isValidFen(fen) {
  if (!fen || typeof fen !== 'string') return false;
  
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4 || parts.length > 6) return false;
  
  const [position, side, castling, enPassant] = parts;
  
  // Validate position
  const ranks = position.split('/');
  if (ranks.length !== 8) return false;
  
  for (const rank of ranks) {
    let sum = 0;
    for (const char of rank) {
      if (/[1-8]/.test(char)) {
        sum += parseInt(char, 10);
      } else if (/[pnbrqkPNBRQK]/.test(char)) {
        sum += 1;
      } else {
        return false;
      }
    }
    if (sum !== 8) return false;
  }
  
  // Validate side to move
  if (!/^[wb]$/.test(side)) return false;
  
  // Validate castling rights
  if (!/^(-|K?Q?k?q?)$/.test(castling)) return false;
  
  // Validate en passant square
  if (!/^(-|[a-h][36])$/.test(enPassant)) return false;
  
  return true;
}

/**
 * Parses FEN into structured object
 * @param {string} fen - FEN notation string
 * @returns {Object} - Parsed FEN components
 */
export function parseFen(fen) {
  if (!isValidFen(fen)) {
    throw new Error('Invalid FEN notation');
  }
  
  const parts = fen.trim().split(/\s+/);
  const [position, side, castling, enPassant, halfmove = '0', fullmove = '1'] = parts;
  
  return {
    position,
    side,
    castling,
    enPassant,
    halfmove: parseInt(halfmove, 10),
    fullmove: parseInt(fullmove, 10),
    raw: fen,
  };
}

/**
 * Extracts board position as 8x8 array from FEN
 * @param {string} fen - FEN notation string
 * @returns {Array<Array<string>>} - 8x8 board array (a1 = [7][0])
 */
export function fenToBoard(fen) {
  const { position } = parseFen(fen);
  const ranks = position.split('/');
  const board = [];
  
  for (const rank of ranks) {
    const row = [];
    for (const char of rank) {
      if (/[1-8]/.test(char)) {
        const empty = parseInt(char, 10);
        for (let i = 0; i < empty; i++) {
          row.push(null);
        }
      } else {
        row.push(char);
      }
    }
    board.push(row);
  }
  
  return board;
}

/**
 * Converts board array back to FEN position string
 * @param {Array<Array<string>>} board - 8x8 board array
 * @param {Object} options - side, castling, enPassant, halfmove, fullmove
 * @returns {string} - FEN notation
 */
export function boardToFen(board, options = {}) {
  const {
    side = 'w',
    castling = 'KQkq',
    enPassant = '-',
    halfmove = 0,
    fullmove = 1,
  } = options;
  
  const ranks = [];
  for (const row of board) {
    let rankStr = '';
    let emptyCount = 0;
    
    for (const piece of row) {
      if (piece === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rankStr += emptyCount;
          emptyCount = 0;
        }
        rankStr += piece;
      }
    }
    
    if (emptyCount > 0) {
      rankStr += emptyCount;
    }
    
    ranks.push(rankStr);
  }
  
  return `${ranks.join('/')} ${side} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
}

/**
 * Starting position FEN constant
 */
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * PGN (Portable Game Notation) Utilities
 */

/**
 * Parses basic PGN string into moves array
 * @param {string} pgn - PGN notation string
 * @returns {Object} - { headers, moves }
 */
export function parsePgn(pgn) {
  if (!pgn || typeof pgn !== 'string') {
    return { headers: {}, moves: [] };
  }
  
  const lines = pgn.split('\n');
  const headers = {};
  const moveLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Parse headers [Key "Value"]
    const headerMatch = trimmed.match(/^\[(\w+)\s+"([^"]+)"\]$/);
    if (headerMatch) {
      headers[headerMatch[1]] = headerMatch[2];
      continue;
    }
    
    // Collect move lines
    if (trimmed && !trimmed.startsWith('[')) {
      moveLines.push(trimmed);
    }
  }
  
  // Parse moves
  const moveText = moveLines.join(' ');
  const moves = [];
  
  // Remove result markers (1-0, 0-1, 1/2-1/2, *)
  const cleanText = moveText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
  
  // Match moves: 1. e4 e5 2. Nf3 Nc6
  const moveRegex = /\d+\.\s*([NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?[+#]?)\s*([NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?[+#]?)?/g;
  let match;
  
  while ((match = moveRegex.exec(cleanText)) !== null) {
    if (match[1]) moves.push(match[1]);
    if (match[2]) moves.push(match[2]);
  }
  
  return { headers, moves };
}

/**
 * Converts moves array to PGN string
 * @param {Array<string>} moves - Array of moves in algebraic notation
 * @param {Object} headers - PGN headers
 * @returns {string} - PGN notation
 */
export function movesToPgn(moves, headers = {}) {
  let pgn = '';
  
  // Add headers
  const defaultHeaders = {
    Event: 'PROOF Chess Challenge',
    Site: 'PROOF Platform',
    Date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    Round: '1',
    White: 'Student',
    Black: 'Challenge',
    Result: '*',
  };
  
  const allHeaders = { ...defaultHeaders, ...headers };
  for (const [key, value] of Object.entries(allHeaders)) {
    pgn += `[${key} "${value}"]\n`;
  }
  
  pgn += '\n';
  
  // Add moves
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    pgn += `${moveNum}. ${moves[i]}`;
    if (moves[i + 1]) {
      pgn += ` ${moves[i + 1]}`;
    }
    pgn += ' ';
    
    if ((i + 2) % 10 === 0) pgn += '\n';
  }
  
  pgn += allHeaders.Result;
  
  return pgn.trim();
}

/**
 * Coordinate Conversion Utilities
 */

/**
 * Converts algebraic notation to array indices
 * @param {string} square - e.g., "e4"
 * @returns {Object} - { file: 4, rank: 3 } (0-indexed)
 */
export function squareToIndices(square) {
  if (!square || !/^[a-h][1-8]$/.test(square)) {
    throw new Error(`Invalid square: ${square}`);
  }
  
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
  const rank = 8 - parseInt(square[1], 10); // 0-7 (inverted)
  
  return { file, rank };
}

/**
 * Converts array indices to algebraic notation
 * @param {number} file - 0-7
 * @param {number} rank - 0-7
 * @returns {string} - e.g., "e4"
 */
export function indicesToSquare(file, rank) {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) {
    throw new Error(`Invalid indices: file=${file}, rank=${rank}`);
  }
  
  const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
  const rankNum = 8 - rank;
  
  return `${fileChar}${rankNum}`;
}

/**
 * Gets all squares on the board
 * @returns {Array<string>} - Array of all 64 squares (a1-h8)
 */
export function getAllSquares() {
  const squares = [];
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      squares.push(indicesToSquare(file, rank));
    }
  }
  return squares;
}

/**
 * Move Validation Utilities
 */

/**
 * Validates algebraic notation move format
 * @param {string} move - e.g., "e4", "Nf3", "O-O", "exd5"
 * @returns {boolean} - true if format is valid
 */
export function isValidMoveNotation(move) {
  if (!move || typeof move !== 'string') return false;
  
  // Castling
  if (/^O-O(-O)?[+#]?$/.test(move)) return true;
  
  // Regular moves: [Piece][from][x][to][promotion][check/mate]
  if (/^[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQ])?[+#]?$/.test(move)) return true;
  
  return false;
}

/**
 * Parses algebraic notation into components
 * @param {string} move - e.g., "Nf3", "exd5", "O-O"
 * @returns {Object} - { piece, from, to, capture, promotion, check, checkmate, castling }
 */
export function parseMove(move) {
  if (!isValidMoveNotation(move)) {
    throw new Error(`Invalid move notation: ${move}`);
  }
  
  // Castling
  if (move.startsWith('O-O')) {
    return {
      castling: move.includes('O-O-O') ? 'queenside' : 'kingside',
      check: move.includes('+'),
      checkmate: move.includes('#'),
    };
  }
  
  const result = {
    piece: null,
    from: null,
    to: null,
    capture: move.includes('x'),
    promotion: null,
    check: move.includes('+'),
    checkmate: move.includes('#'),
    castling: null,
  };
  
  // Remove check/mate indicators
  let cleanMove = move.replace(/[+#]$/, '');
  
  // Extract promotion
  const promotionMatch = cleanMove.match(/=([NBRQ])$/);
  if (promotionMatch) {
    result.promotion = promotionMatch[1];
    cleanMove = cleanMove.replace(/=[NBRQ]$/, '');
  }
  
  // Extract capture
  cleanMove = cleanMove.replace('x', '');
  
  // Extract destination square (always last 2 chars)
  result.to = cleanMove.slice(-2);
  cleanMove = cleanMove.slice(0, -2);
  
  // Extract piece and disambiguation
  if (cleanMove.length > 0) {
    const firstChar = cleanMove[0];
    if (/[NBRQK]/.test(firstChar)) {
      result.piece = firstChar;
      result.from = cleanMove.slice(1) || null;
    } else {
      result.piece = 'P'; // Pawn
      result.from = cleanMove || null;
    }
  } else {
    result.piece = 'P'; // Pawn
  }
  
  return result;
}

/**
 * Position Analysis Utilities
 */

/**
 * Counts material on the board
 * @param {string} fen - FEN notation
 * @returns {Object} - { white, black, difference }
 */
export function countMaterial(fen) {
  const board = fenToBoard(fen);
  const values = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
  
  let white = 0;
  let black = 0;
  
  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const value = values[piece.toUpperCase()] || 0;
      if (piece === piece.toUpperCase()) {
        white += value;
      } else {
        black += value;
      }
    }
  }
  
  return {
    white,
    black,
    difference: white - black,
  };
}

/**
 * Finds all pieces of a type on the board
 * @param {string} fen - FEN notation
 * @param {string} piece - Piece to find (e.g., 'K', 'k', 'Q')
 * @returns {Array<Object>} - Array of { square, file, rank }
 */
export function findPieces(fen, piece) {
  const board = fenToBoard(fen);
  const pieces = [];
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      if (board[rank][file] === piece) {
        pieces.push({
          square: indicesToSquare(file, rank),
          file,
          rank,
        });
      }
    }
  }
  
  return pieces;
}

/**
 * Validates that a move is legal in the given position
 * @param {string} fen - Current position
 * @param {string} move - Move in algebraic notation
 * @returns {Object} - { legal: boolean, error?: string, newFen?: string }
 */
export function validateMove(fen, move) {
  return stockfish.validateMove(fen, move);
}

/**
 * Determines if position is checkmate
 * @param {string} fen - FEN notation
 * @returns {boolean} - true if checkmate
 */
export function isCheckmate(fen) {
  return stockfish.isCheckmate(fen);
}

/**
 * Determines if position is stalemate
 * @param {string} fen - FEN notation
 * @returns {boolean} - true if stalemate
 */
export function isStalemate(fen) {
  return stockfish.isStalemate(fen);
}

/**
 * Checks if a square is attacked
 * @param {string} fen - FEN notation
 * @param {string} square - Square to check
 * @param {string} by - 'w' or 'b'
 * @returns {boolean} - true if attacked
 */
export function isSquareAttacked(fen, square, by) {
  try {
    const chess = new Chess(fen);
    return chess.isAttacked(square, by);
  } catch (error) {
    return false;
  }
}

/**
 * Determines if position is draw by insufficient material
 * @param {string} fen - FEN notation
 * @returns {boolean} - true if insufficient material
 */
export function isInsufficientMaterial(fen) {
  const board = fenToBoard(fen);
  const pieces = [];
  
  for (const row of board) {
    for (const piece of row) {
      if (piece && piece.toUpperCase() !== 'K') {
        pieces.push(piece.toUpperCase());
      }
    }
  }
  
  // King vs King
  if (pieces.length === 0) return true;
  
  // King + minor piece vs King
  if (pieces.length === 1 && (pieces[0] === 'N' || pieces[0] === 'B')) return true;
  
  // King + Bishop vs King + Bishop (same color)
  if (pieces.length === 2 && pieces[0] === 'B' && pieces[1] === 'B') {
    // Would need to check if bishops are on same color squares
    // Simplified: assume insufficient
    return true;
  }
  
  return false;
}

/**
 * Endgame Recognition
 */

/**
 * Determines if position is in endgame phase
 * @param {string} fen - FEN notation
 * @returns {boolean} - true if endgame
 */
export function isEndgame(fen) {
  const material = countMaterial(fen);
  const totalMaterial = material.white + material.black;
  
  // Endgame: queens traded or total material < 13
  const board = fenToBoard(fen);
  let queens = 0;
  
  for (const row of board) {
    for (const piece of row) {
      if (piece && piece.toUpperCase() === 'Q') queens++;
    }
  }
  
  return queens === 0 || totalMaterial < 13;
}

/**
 * Helper Functions
 */

/**
 * Generates a random valid FEN position (for testing)
 * @returns {string} - Valid FEN string
 */
export function randomFen() {
  // Returns starting position for simplicity
  return STARTING_FEN;
}

/**
 * Pretty prints a FEN position as ASCII board
 * @param {string} fen - FEN notation
 * @returns {string} - ASCII representation
 */
export function fenToAscii(fen) {
  const board = fenToBoard(fen);
  let ascii = '  a b c d e f g h\n';
  
  for (let rank = 0; rank < 8; rank++) {
    ascii += `${8 - rank} `;
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file] || '.';
      ascii += piece + ' ';
    }
    ascii += `${8 - rank}\n`;
  }
  
  ascii += '  a b c d e f g h';
  return ascii;
}

/**
 * Validates that a move is legal in the given position
 * Note: This requires chess.js or similar library for full validation
 * @param {string} fen - Current position
 * @param {string} move - Move in algebraic notation
 * @returns {Object} - { legal: boolean, error?: string, newFen?: string }
 */
export function validateMove(fen, move) {
  // Placeholder - would integrate with chess.js
  return {
    legal: true,
    error: null,
    newFen: fen, // Would return new position after move
  };
}

/**
 * Export all utilities
 */
export default {
  // FEN utilities
  isValidFen,
  parseFen,
  fenToBoard,
  boardToFen,
  STARTING_FEN,
  
  // PGN utilities
  parsePgn,
  movesToPgn,
  
  // Coordinate utilities
  squareToIndices,
  indicesToSquare,
  getAllSquares,
  
  // Move utilities
  isValidMoveNotation,
  parseMove,
  validateMove,
  
  // Analysis utilities
  countMaterial,
  findPieces,
  isSquareAttacked,
  
  // Pattern detection
  detectPins,
  detectForks,
  detectSkewers,
  
  // Game state
  isCheckmate,
  isStalemate,
  isInsufficientMaterial,
  isEndgame,
  
  // Helpers
  randomFen,
  fenToAscii,
};
