import { ResponseError } from '@/constraints/enums/core-enums';
import { CoreStore } from '@/constraints/types/core-types';
import { getLeaves, getHolidays } from '@/services/leaves-service';

export const populateLeaves = async (
  username: string,
  password: string,
  set: (state: Partial<CoreStore>) => void,
  get: () => CoreStore,
  force: boolean = false,
) => {
  if (!force && get().leaves.length > 0) return;
  set({ isLeavesLoading: true });
  try {
    const leaves = await getLeaves(username, password);
    set({ leaves, isLeavesLoading: false });
  } catch (error: unknown) {
    set({ error: (error as { message: ResponseError }).message as ResponseError, isLeavesLoading: false });
  }
};

export const populateHolidays = async (
  username: string,
  password: string,
  set: (state: Partial<CoreStore>) => void,
  get: () => CoreStore,
  force: boolean = false,
) => {
  if (!force && get().holidays.length > 0) return;
  set({ isHolidaysLoading: true });
  const holidays = await getHolidays(username, password);
  set({ holidays, isHolidaysLoading: false });
};
