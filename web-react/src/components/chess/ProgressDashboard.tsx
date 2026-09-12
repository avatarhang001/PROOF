/**
 * ProgressDashboard Component
 * 
 * Display user chess statistics, progress, and performance metrics.
 * Shows overall stats, theme strengths/weaknesses, and recent attempts.
 */

import React, { useState, useEffect } from 'react';
import { progressApi } from '../../services/chess';
import type {
  ChessUserProgress,
  ChessPuzzleAttempt,
  ThemeStats,
  ProgressDashboardProps,
} from '../../types/chess';
import { THEME_LABELS } from '../../types/chess';

export const ProgressDashboard: React.FC<ProgressDashboardProps> = () => {
  const [progress, setProgress] = useState<ChessUserProgress | null>(null);
  const [themes, setThemes] = useState<ThemeStats[]>([]);
  const [history, setHistory] = useState<ChessPuzzleAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyLimit, setHistoryLimit] = useState(10);

  // Load all progress data
  useEffect(() => {
    loadProgress();
  }, [historyLimit]);

  const loadProgress = async () => {
    setLoading(true);
    setError(null);

    try {
      const [progressData, themesData, historyData] = await Promise.all([
        progressApi.getOverall(),
        progressApi.getByTheme(),
        progressApi.getHistory(historyLimit),
      ]);

      setProgress(progressData);
      setThemes(themesData);
      setHistory(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
      console.error('Progress load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format time duration
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="progress-dashboard loading">
        <div className="loading-spinner">Loading progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-dashboard error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
        <button className="btn btn-retry" onClick={loadProgress}>
          Retry
        </button>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-dashboard empty">
        <p>No progress data available. Start solving puzzles to track your progress!</p>
      </div>
    );
  }

  // Sort themes by accuracy
  const sortedThemes = [...themes].sort((a, b) => b.accuracy - a.accuracy);
  const strongThemes = sortedThemes.filter((t) => t.accuracy >= 70);
  const weakThemes = sortedThemes.filter((t) => t.accuracy < 70);

  return (
    <div className="progress-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Chess Progress</h2>
        <button className="btn btn-refresh" onClick={loadProgress}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Puzzle Rating"
          value={progress.puzzleRating.toString()}
          icon="⭐"
          color="#fbbf24"
        />
        <StatCard
          title="Puzzles Solved"
          value={progress.puzzlesSolved.toString()}
          icon="✅"
          color="#4ade80"
        />
        <StatCard
          title="Average Accuracy"
          value={`${progress.averageAccuracy}%`}
          icon="🎯"
          color="#3b82f6"
        />
        <StatCard
          title="Current Streak"
          value={progress.currentStreak.toString()}
          icon="🔥"
          color="#ef4444"
        />
      </div>

      {/* Themes Section */}
      {sortedThemes.length > 0 && (
        <div className="themes-section">
          <h3>Tactical Themes</h3>
          
          {/* Strong Themes */}
          {strongThemes.length > 0 && (
            <div className="themes-group">
              <h4 className="themes-group-title">
                <span className="strength-icon">💪</span>
                Strengths
              </h4>
              <div className="themes-grid">
                {strongThemes.map((theme) => (
                  <ThemeCard key={theme.theme} theme={theme} isStrong />
                ))}
              </div>
            </div>
          )}

          {/* Weak Themes */}
          {weakThemes.length > 0 && (
            <div className="themes-group">
              <h4 className="themes-group-title">
                <span className="weakness-icon">📚</span>
                Areas to Improve
              </h4>
              <div className="themes-grid">
                {weakThemes.map((theme) => (
                  <ThemeCard key={theme.theme} theme={theme} isStrong={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Attempts */}
      <div className="history-section">
        <div className="history-header">
          <h3>Recent Attempts</h3>
          <select
            value={historyLimit}
            onChange={(e) => setHistoryLimit(parseInt(e.target.value))}
            className="history-limit-select"
          >
            <option value="10">Last 10</option>
            <option value="20">Last 20</option>
            <option value="50">Last 50</option>
          </select>
        </div>

        {history.length === 0 ? (
          <p className="no-history">No recent attempts yet.</p>
        ) : (
          <div className="attempts-list">
            {history.map((attempt) => (
              <AttemptItem
                key={attempt.id}
                attempt={attempt}
                formatTime={formatTime}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="stat-card" style={{ borderTopColor: color }}>
    <div className="stat-icon" style={{ color }}>
      {icon}
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
  </div>
);

interface ThemeCardProps {
  theme: ThemeStats;
  isStrong: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isStrong }) => (
  <div className={`theme-card ${isStrong ? 'strong' : 'weak'}`}>
    <div className="theme-name">{THEME_LABELS[theme.theme]}</div>
    <div className="theme-accuracy">
      <span className="accuracy-value">{theme.accuracy}%</span>
      <div className="accuracy-bar">
        <div
          className="accuracy-fill"
          style={{ width: `${theme.accuracy}%` }}
        />
      </div>
    </div>
    <div className="theme-stats">
      <span className="theme-correct">{theme.correct}</span>
      <span className="theme-separator">/</span>
      <span className="theme-total">{theme.total}</span>
    </div>
  </div>
);

interface AttemptItemProps {
  attempt: ChessPuzzleAttempt;
  formatTime: (ms: number) => string;
  formatDate: (date: string) => string;
}

const AttemptItem: React.FC<AttemptItemProps> = ({
  attempt,
  formatTime,
  formatDate,
}) => (
  <div className={`attempt-item ${attempt.correct ? 'correct' : 'incorrect'}`}>
    <div className="attempt-status">
      <span className="attempt-icon">
        {attempt.correct ? '✅' : '❌'}
      </span>
    </div>
    <div className="attempt-details">
      <div className="attempt-score">
        Score: <strong>{attempt.score}</strong>
        {attempt.hintsUsed > 0 && (
          <span className="hints-used">
            ({attempt.hintsUsed} hint{attempt.hintsUsed !== 1 ? 's' : ''})
          </span>
        )}
      </div>
      <div className="attempt-meta">
        <span className="attempt-time">{formatTime(attempt.timeSpentMs)}</span>
        <span className="attempt-separator">•</span>
        <span className="attempt-date">{formatDate(attempt.createdAt)}</span>
      </div>
    </div>
    <div className="attempt-moves">
      {attempt.moves.length} move{attempt.moves.length !== 1 ? 's' : ''}
    </div>
  </div>
);

export default ProgressDashboard;
