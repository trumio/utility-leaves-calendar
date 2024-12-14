import { LeaveCategory } from '@/constraints/enums/core-enums';
import { LeaveType } from '@/constraints/enums/core-enums';
import { DateTime } from 'luxon';

export const exampleLeaves = [
  {
    id: '1',
    name: 'John Smith',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 2 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 6 }).toJSDate(),
    department: 'Engineering',
    role: 'Software Engineer',
    leaveReason: 'Family vacation',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 10 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 10 }).toJSDate(),
    department: 'Marketing',
    role: 'Marketing Manager',
    leaveReason: 'Doctor appointment',
    leaveType: LeaveType.HalfDay,
    leaveCategory: LeaveCategory.SickLeave,
  },
  {
    id: '3',
    name: 'Emily Davis',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 15 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2025, month: 3, day: 15 }).toJSDate(),
    department: 'Human Resources',
    role: 'HR Manager',
    leaveReason: 'Maternity leave',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.MaternityLeave,
  },
  {
    id: '4',
    name: 'Michael Wilson',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 20 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    department: 'Sales',
    role: 'Sales Representative',
    leaveReason: 'Christmas holiday',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '5',
    name: 'David Brown',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 26 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 26 }).toJSDate(),
    department: 'Finance',
    role: 'Financial Analyst',
    leaveReason: 'Personal matters',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.Other,
  },
  {
    id: '6',
    name: 'Jessica Taylor',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 27 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2025, month: 1, day: 3 }).toJSDate(),
    department: 'Engineering',
    role: 'QA Engineer',
    leaveReason: 'New Year vacation',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '7',
    name: 'Robert Martinez',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 13 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 27 }).toJSDate(),
    department: 'Operations',
    role: 'Operations Manager',
    leaveReason: 'Parental leave',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.ParentalLeave,
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    department: 'Customer Support',
    role: 'Support Specialist',
    leaveReason: 'Christmas Eve',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '9',
    name: 'Kevin Thomas',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 23 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    department: 'Product',
    role: 'Product Manager',
    leaveReason: 'Family event',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '10',
    name: 'Amanda White',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 30 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 31 }).toJSDate(),
    department: 'Design',
    role: 'UI/UX Designer',
    leaveReason: 'Year-end break',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '11',
    name: 'James Wilson',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    department: 'Engineering',
    role: 'DevOps Engineer',
    leaveReason: 'Christmas Eve',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
  {
    id: '12',
    name: 'Emma Clark',
    startAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    endAt: DateTime.fromObject({ year: 2024, month: 12, day: 24 }).toJSDate(),
    department: 'Marketing',
    role: 'Content Writer',
    leaveReason: 'Christmas Eve',
    leaveType: LeaveType.FullDay,
    leaveCategory: LeaveCategory.VacationLeave,
  },
];
