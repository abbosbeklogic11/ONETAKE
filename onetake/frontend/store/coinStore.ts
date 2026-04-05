import { create } from 'zustand';

interface CoinState {
  balance: number;
  fetchBalance: () => void;
  addOptimisticCoins: (amount: number) => void;
}

export const useCoinStore = create<CoinState>((set) => ({
  balance: 0,
  fetchBalance: () => {
    // API mock
  },
  addOptimisticCoins: (amount) => set((state) => ({ balance: state.balance + amount })),
}));
