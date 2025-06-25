import { create } from "zustand";

export interface User {
    id: string;
    role: string;
}

type UserStore = {
  user: User | null;
  userId: number | null;
  details: any | null;
  setUser: (user: User) => void;
  setUserId: (userId: number | null) => void;
  setDetails: (details: any) => void;
  resetUser: () => void;
};

const useUserStore = create<UserStore>((set) => ({
    user: null,
    userId: null,
    details: null,
    setUser: (user) => set({ user, userId: user ? parseInt(user.id) : null }),
    setUserId: (userId) => set({ userId }),
    setDetails: (details) => set({ details }),
    resetUser: () => set({ user: null, userId: null, details: null }),
}));

export default useUserStore;
