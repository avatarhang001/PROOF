/**
 * Authentication Service
 * Handles user authentication, sessions, and wallet connections
 */

import { api } from '../lib/api';
import type { User, AuthResponse } from '../types/api';

export interface NonceResponse {
  nonce: string;
  message: string;
  subject: string;
}

export interface OnboardingRequest {
  goal: string;
  level: string;
  minutesPerDay: number;
  interests?: string[];
}

export interface VerifyRequest {
  mode: 'demo' | 'nimiqpay' | 'hub';
  nonce: string;
  publicKey: string;
  signature: string;
  address?: string;
  username?: string;
}

export interface DemoWalletResponse {
  publicKey: string;
  privateKey: string;
  address: string;
  mode: 'demo';
  notice: string;
}

export const authService = {
  /**
   * Create onboarding user with demo account
   */
  async onboard(data: OnboardingRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/api/onboard', data);
  },

  /**
   * Request a nonce for wallet signature
   */
  async getNonce(subject?: string): Promise<NonceResponse> {
    return api.post<NonceResponse>('/api/auth/nonce', { subject });
  },

  /**
   * Verify wallet signature and create/login user
   */
  async verify(data: VerifyRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/api/auth/verify', data);
  },

  /**
   * Get current session
   */
  async getSession(): Promise<{ user: User | null }> {
    return api.get<{ user: User | null }>('/api/auth/session');
  },

  /**
   * Logout current user
   */
  async logout(): Promise<{ ok: boolean }> {
    return api.post<{ ok: boolean }>('/api/auth/logout');
  },

  /**
   * Create demo wallet (for testing)
   */
  async createDemoWallet(): Promise<DemoWalletResponse> {
    return api.post<DemoWalletResponse>('/api/wallet/demo');
  },

  /**
   * Sign message with demo wallet
   */
  async signDemoMessage(privateKey: string, message: string): Promise<{ signature: string }> {
    return api.post<{ signature: string }>('/api/wallet/demo/sign', {
      privateKey,
      message,
    });
  },
};
