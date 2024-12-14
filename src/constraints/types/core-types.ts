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
  startAt: Date;
  endAt: Date;
};
