/**
 * ChessBoardWithThemes Component
 * 
 * Example component showing ChessBoard with theme selector.
 * Use this as a reference for implementing themed boards.
 */

import React, { useState } from 'react';
import { ChessBoard } from './ChessBoard';
import { ThemeSelector } from './ThemeSelector';
import type { ChessBoardTheme } from '../../types/chess';

interface ChessBoardWithThemesProps {
  initialFen?: string;
  onMove?: (move: any, newFen: string) => void;
  showThemeSelector?: boolean;
  compactThemeSelector?: boolean;
}

export const ChessBoardWithThemes: React.FC<ChessBoardWithThemesProps> = ({
  initialFen,
  onMove,
  showThemeSelector = true,
  compactThemeSelector = false,
}) => {
  const [theme, setTheme] = useState<ChessBoardTheme>('classic');

  return (
    <div className="chess-board-with-themes">
      {showThemeSelector && (
        <ThemeSelector
          currentTheme={theme}
          onThemeChange={setTheme}
          compact={compactThemeSelector}
        />
      )}
      <ChessBoard
        initialFen={initialFen}
        onMove={onMove}
        theme={theme}
      />
    </div>
  );
};

export default ChessBoardWithThemes;
