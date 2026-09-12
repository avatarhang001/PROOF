/**
 * ThemeSelector Component
 * 
 * Allow users to choose their preferred chessboard color theme.
 */

import React from 'react';
import type { ChessBoardTheme } from '../../types/chess';

interface ThemeSelectorProps {
  currentTheme: ChessBoardTheme;
  onThemeChange: (theme: ChessBoardTheme) => void;
  compact?: boolean;
}

const THEMES: Array<{ id: ChessBoardTheme; name: string; light: string; dark: string; emoji: string }> = [
  { id: 'classic', name: 'Classic Brown', light: '#f0d9b5', dark: '#b58863', emoji: '♟️' },
  { id: 'blue', name: 'Blue', light: '#dee3e6', dark: '#8ca2ad', emoji: '🔵' },
  { id: 'green', name: 'Green', light: '#ffffdd', dark: '#86a666', emoji: '🟢' },
  { id: 'purple', name: 'Purple', light: '#e8d4f2', dark: '#9f5f9f', emoji: '🟣' },
  { id: 'red', name: 'Red', light: '#ffd4d4', dark: '#c14949', emoji: '🔴' },
  { id: 'gray', name: 'Modern Gray', light: '#e8e8e8', dark: '#6b7280', emoji: '⚫' },
  { id: 'ocean', name: 'Ocean', light: '#d0e8f2', dark: '#4a7fa0', emoji: '🌊' },
  { id: 'wood', name: 'Wood', light: '#dfc99c', dark: '#a67c52', emoji: '🪵' },
  { id: 'ice', name: 'Ice', light: '#e0f4ff', dark: '#7cb8d9', emoji: '🧊' },
  { id: 'coral', name: 'Coral', light: '#ffe4e6', dark: '#f87171', emoji: '🪸' },
  { id: 'emerald', name: 'Emerald', light: '#d1fae5', dark: '#059669', emoji: '💎' },
  { id: 'amber', name: 'Amber', light: '#fef3c7', dark: '#d97706', emoji: '🟡' },
  { id: 'tournament', name: 'Tournament', light: '#ffffff', dark: '#333333', emoji: '🏆' },
  { id: 'neon', name: 'Neon', light: '#fef08a', dark: '#8b5cf6', emoji: '✨' },
  { id: 'marble', name: 'Marble', light: '#f8fafc', dark: '#94a3b8', emoji: '🗿' },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="theme-selector-compact">
        <label htmlFor="theme-select" className="theme-label">
          Board Theme:
        </label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={(e) => onThemeChange(e.target.value as ChessBoardTheme)}
          className="theme-select"
        >
          {THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.emoji} {theme.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="theme-selector">
      <h4 className="theme-selector-title">Board Theme</h4>
      <div className="theme-grid">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            className={`theme-option ${currentTheme === theme.id ? 'selected' : ''}`}
            onClick={() => onThemeChange(theme.id)}
            title={theme.name}
          >
            <div className="theme-preview">
              <div
                className="theme-square light"
                style={{ backgroundColor: theme.light }}
              />
              <div
                className="theme-square dark"
                style={{ backgroundColor: theme.dark }}
              />
              <div
                className="theme-square dark"
                style={{ backgroundColor: theme.dark }}
              />
              <div
                className="theme-square light"
                style={{ backgroundColor: theme.light }}
              />
            </div>
            <span className="theme-emoji">{theme.emoji}</span>
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
