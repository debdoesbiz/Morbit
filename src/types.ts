/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  siteOrWork: string;
  description: string;
  date: string; // ISO string
  type: 'earning' | 'loss';
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
}

export interface AppState {
  transactions: Transaction[];
  profile: UserProfile;
  baseCurrency: Currency;
}
