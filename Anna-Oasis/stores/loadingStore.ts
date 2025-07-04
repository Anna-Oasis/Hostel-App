import { create } from 'zustand';

type LoadingStore = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  resetLoading: () => void;
};

const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  resetLoading: () => set({ isLoading: false }),
}));


export default useLoadingStore;
