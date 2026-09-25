import { create } from "zustand";

interface SelectedAlunoStore {
  id: number;
  name: string;
  setSelectedAluno: (id: number, name: string) => void;
}

export const useSelectedAlunoStore = create<SelectedAlunoStore>((set) => ({
  id: 0,
  name: '',
  setSelectedAluno: (id: number, name: string) => set({ id, name }),
}));