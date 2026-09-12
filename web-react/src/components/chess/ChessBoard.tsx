/**
 * ChessBoard Component
 * 
 * Interactive chessboard using react-chessboard library.
 * Supports move validation, position display, and interactive play.
 */

import React, { useState, useEffect, useLayoutEffect, useCallback, useId, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square as ChessSquare } from 'chess.js';
import type { ChessBoardProps } from '../../types/chess';
import './chess.css';

export const ChessBoard: React.FC<ChessBoardProps> = ({
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onMove,
  orientation = 'white',
  highlightSquares = [],
  disabled = false,
  showCoordinates = true,
  animationDuration = 300,
  theme = 'classic',
}) => {
  const [game, setGame] = useState<Chess>(() => new Chess(initialFen));
  const [position, setPosition] = useState(initialFen);
  const [moveFrom, setMoveFrom] = useState<ChessSquare | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, { backgroundColor: string }>>({});
  const [optionSquares, setOptionSquares] = useState<Record<string, { background: string; borderRadius?: string }>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boardId = useId();
  const [boardWidth, setBoardWidth] = useState(0);

  // Keep a replayed FEN and the rules engine in lockstep before the browser paints.
  // This avoids a frame where pieces animate from a previous lesson position.
  useLayoutEffect(() => {
    const newGame = new Chess(initialFen);
    setGame(newGame);
    setPosition(initialFen);
    setMoveFrom(null);
    setOptionSquares({});
  }, [initialFen]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const resize = () => {
      // Never let the internal board become wider than its visible container.
      // Scaling a larger board with CSS makes react-chessboard's square coordinates
      // disagree with the rendered pieces, especially on narrow lesson panels.
      const measuredWidth = Math.floor(wrapper.getBoundingClientRect().width);
      const nextWidth = Math.min(500, Math.max(0, measuredWidth));
      setBoardWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Get possible moves for a square
  const getMoveOptions = useCallback((square: ChessSquare) => {
    const moves = game.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, { background: string; borderRadius?: string }> = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to)!.color !== game.get(square)!.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }, [game]);

  // Handle square click
  const onSquareClick = useCallback(
    (square: ChessSquare) => {
      if (disabled) return;

      // If no piece is selected, try to select this square
      if (!moveFrom) {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setMoveFrom(square);
          getMoveOptions(square);
        }
        return;
      }

      // Try to make a move
      try {
        const moves = game.moves({
          square: moveFrom,
          verbose: true,
        });
        const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

        if (foundMove) {
          const gameCopy = new Chess(game.fen());
          const move = gameCopy.move({
            from: moveFrom,
            to: square,
            promotion: 'q', // Always promote to queen for simplicity
          });

          if (move) {
            setGame(gameCopy);
            setPosition(gameCopy.fen());
            onMove?.(move, gameCopy.fen());
          }
        }
      } catch (error) {
        console.error('Invalid move:', error);
      }

      // Clear selection
      setMoveFrom(null);
      setOptionSquares({});
    },
    [disabled, moveFrom, game, getMoveOptions, onMove]
  );

  // Handle piece drop (drag and drop)
  const onPieceDrop = useCallback(
    (sourceSquare: ChessSquare, targetSquare: ChessSquare): boolean => {
      if (disabled) return false;

      try {
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // Always promote to queen
        });

        if (move === null) return false;

        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveFrom(null);
        setOptionSquares({});
        onMove?.(move, gameCopy.fen());
        return true;
      } catch (error) {
        console.error('Invalid move:', error);
        return false;
      }
    },
    [disabled, game, onMove]
  );

  // Handle right click for annotations
  const onSquareRightClick = useCallback((square: ChessSquare) => {
    const color = 'rgba(255, 0, 0, 0.5)';
    setRightClickedSquares((prev) => {
      const newSquares = { ...prev };
      if (newSquares[square]) {
        delete newSquares[square];
      } else {
        newSquares[square] = { backgroundColor: color };
      }
      return newSquares;
    });
  }, []);

  // Combine all custom square styles
  const customSquareStyles = {
    ...optionSquares,
    ...rightClickedSquares,
    ...highlightSquares.reduce((acc, square) => ({
      ...acc,
      [square]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    }), {}),
  };

  return (
    <div ref={wrapperRef} className={`chess-board-wrapper theme-${theme} w-full min-w-0 max-w-[500px]`}>
      {boardWidth > 0 && (
        <Chessboard
          id={boardId}
          // Disabled boards are controlled directly by their FEN, so replay frames
          // cannot briefly render a stale position while local state is synchronised.
          position={disabled ? initialFen : position}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          boardOrientation={orientation}
          customSquareStyles={customSquareStyles}
          arePiecesDraggable={!disabled}
          animationDuration={animationDuration}
          boardWidth={boardWidth}
          showBoardNotation={showCoordinates}
          customBoardStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#b58863' }}
          customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        />
      )}
      
      {/* Game status indicator */}
      <div className="chess-status">
        {game.isCheckmate() && (
          <div className="status-message checkmate">
            Checkmate! {game.turn() === 'w' ? 'Black' : 'White'} wins!
          </div>
        )}
        {game.isStalemate() && (
          <div className="status-message stalemate">
            Stalemate! Draw by stalemate.
          </div>
        )}
        {game.isDraw() && (
          <div className="status-message draw">
            Draw!
          </div>
        )}
        {game.isCheck() && !game.isCheckmate() && (
          <div className="status-message check">
            Check!
          </div>
        )}
        {!game.isGameOver() && (
          <div className="status-turn">
            {game.turn() === 'w' ? 'White' : 'Black'} to move
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
