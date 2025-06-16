import { create } from "zustand";

export interface User {
    id: string;
    role: string;
}

type UserStore = {
  user: User | null;
  userId: number | null;
  setUser: (user: User) => void;
  setUserId: (userId: number | null) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    userId: null,
    setUser: (user) => set({ user, userId: user ? parseInt(user.id) : null }),
    setUserId: (userId) => set({ userId }),
    resetUser: () => set({ user: null, userId: null }),
}));
