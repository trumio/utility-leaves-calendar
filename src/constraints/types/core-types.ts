import { LeaveType } from '../enums/core-enums';

import { LeaveCategory } from '../enums/core-enums';

export type Leave = {
  id: string;
  name: string;
  department: string;
  role: string;
  leaveReason: string;
  leaveType: LeaveType;
  leaveCategory: LeaveCategory;
  startDate: Date;
  endDate: Date;
};

export type PublicHoliday = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type CoreStore = {
  isLeavesLoading: boolean;
  isHolidaysLoading: boolean;
  leaves: Leave[];
  holidays: PublicHoliday[];
  populateLeaves: (username: string, password: string, force?: boolean) => Promise<void>;
  populateHolidays: (username: string, password: string, force?: boolean) => Promise<void>;
};
