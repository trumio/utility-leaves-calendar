import { populateHolidays, populateLeaves } from '@/actions/core-actions';
import { CoreStore } from '@/constraints/types/core-types';
import { create } from 'zustand';

export const useCoreStore = create<CoreStore>((set, get) => ({
  isLeavesLoading: false,
  isHolidaysLoading: false,
  leaves: [],
  holidays: [],
  populateLeaves: (username: string, password: string, force?: boolean) =>
    populateLeaves(username, password, set, get, force),
  populateHolidays: (username: string, password: string, force?: boolean) =>
    populateHolidays(username, password, set, get, force),
}));
