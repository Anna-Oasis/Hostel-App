import { create } from "zustand";

interface RoomStoreState {
  academicYear: string;
  rooms: any[];
  setAcademicYear: (year: string) => void;
  setRooms: (rooms: any[]) => void;
}

const useRoomStore = create<RoomStoreState>((set) => ({
  academicYear: "",
  rooms: [],
  setAcademicYear: (year) => set({ academicYear: year }),
  setRooms: (rooms) => set({ rooms }),
}));

export default useRoomStore;
