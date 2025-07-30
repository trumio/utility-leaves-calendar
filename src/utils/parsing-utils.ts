import { Leave, PublicHoliday } from '@/constraints/types/core-types';
import { DateTime } from 'luxon';

export const parseLeaves = (leaves: any[]): Leave[] => {
  return leaves.map((leave, index: number) => ({
    id: index.toString(),
    name: leave.name,
    department: leave.department,
    role: leave.role,
    leaveReason: leave['reason for leave'],
    leaveType: leave['leave type'],
    leaveCategory: leave['leave category'],
    startDate: DateTime.fromISO(leave['leave start date']).toJSDate(),
    endDate: DateTime.fromISO(leave['leave end date']).toJSDate(),
  }));
};

export const parseHolidays = (holidays: any[]): PublicHoliday[] => {
  return holidays.map((holiday, index: number) => ({
    id: index.toString(),
    name: holiday.name,
    startDate: DateTime.fromISO(holiday['holiday start date']).toJSDate(),
    endDate: DateTime.fromISO(holiday['holiday end date']).toJSDate(),
  }));
};
