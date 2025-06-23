import { create } from "zustand";

type Room = {
  roomNumber: number;
  rollNo: string | null;
};

type RCStore = {
  rooms: Room[][];
  setRooms: (apiRooms: any[]) => void;
  resetRooms: () => void;
};

const useRCStore = create<RCStore>((set) => ({
  rooms: [],
  setRooms: (apiRooms) => {
    const maxFloor = Math.max(...apiRooms.map(r => r.floor));
    const mapped: Room[][] = Array.from({ length: maxFloor }, () => []);
    apiRooms.forEach(room => {
      const floorIdx = (room.floor || 1); 
      if (!mapped[floorIdx]) mapped[floorIdx] = [];
      mapped[floorIdx].push({
        roomNumber: room.roomNumber,
        rollNo: room.rollNo,
      });
    });
    set({ rooms: mapped });
  },
  resetRooms: () => set({ rooms: [] }),
}));

export default useRCStore;
