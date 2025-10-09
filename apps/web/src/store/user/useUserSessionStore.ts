import { Session } from "next-auth";
import { create } from "zustand";

interface UserSessionStoreType {
  session: Session | null;
  setSession: (data: Session | null) => void;
}

export const useUserSessionStore = create<UserSessionStoreType>((set) => ({
  session: null,
  setSession: (data: Session | null) => set({ session: data }),
}));
