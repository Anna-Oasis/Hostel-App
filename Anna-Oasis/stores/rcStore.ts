import { create } from "zustand";

type Room = {
  roomNumber: number;
  rollNo: string | null;
};

type RCStore = {
  rooms: Room[][];
  hostelBlock: string | null;
  setRooms: (apiRooms: any[]) => void;
  setHostelBlock: (block: string | null) => void;
  resetRooms: () => void;
};

const useRCStore = create<RCStore>((set) => ({
  rooms: [],
  hostelBlock: null,
  setRooms: (apiRooms) => {
    const maxFloor = Math.max(...apiRooms.map(r => r.floor));
    const mapped: Room[][] = Array.from({ length: maxFloor }, () => []);
    apiRooms.forEach(room => {
      const floorIdx = (room.floor || 0); 
      if (!mapped[floorIdx]) mapped[floorIdx] = [];
      mapped[floorIdx].push({
        roomNumber: room.roomNumber,
        rollNo: room.rollNo,
      });
    });
    set({
      rooms: mapped,
      hostelBlock: apiRooms.length > 0 ? apiRooms[0].hostelBlock ?? null : null,
    });
  },
  setHostelBlock: (block) => set({ hostelBlock: block }),
  resetRooms: () => set({ rooms: [], hostelBlock: null }),
}));

export default useRCStore;
