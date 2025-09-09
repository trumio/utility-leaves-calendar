import { populateHolidays, populateLeaves } from '@/actions/core-actions';
import { CoreStore } from '@/constraints/types/core-types';
import { create } from 'zustand';

const initialState = {
  isLeavesLoading: false,
  isHolidaysLoading: false,
  error: undefined,
  leaves: [],
  holidays: [],
};

export const useCoreStore = create<CoreStore>((set, get) => ({
  ...initialState,
  populateLeaves: (username: string, password: string, force?: boolean) =>
    populateLeaves(username, password, set, get, force),
  populateHolidays: (username: string, password: string, force?: boolean) =>
    populateHolidays(username, password, set, get, force),
  resetStore: () => set({ ...initialState }),
}));
