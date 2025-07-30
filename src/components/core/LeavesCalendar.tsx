'use client';

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@/components/roadmap-ui/calendar';
import type { FC } from 'react';
import { useEffect } from 'react';
import Spinner from './Spinner';
import { useCoreStore } from '@/stores/core-store';

const LeavesCalendar: FC = () => {
  const leaves = useCoreStore((state) => state.leaves);
  // const holidays = useCoreStore((state) => state.holidays);
  const isLeavesLoading = useCoreStore((state) => state.isLeavesLoading);
  const isHolidaysLoading = useCoreStore((state) => state.isHolidaysLoading);
  const populateLeaves = useCoreStore((state) => state.populateLeaves);
  const populateHolidays = useCoreStore((state) => state.populateHolidays);

  const earliestYear =
    leaves
      .map((leave) => leave.startDate.getFullYear())
      .sort()
      .at(0) ?? new Date().getFullYear();

  const latestYear =
    leaves
      .map((leave) => leave.endDate.getFullYear())
      .sort()
      .at(-1) ?? new Date().getFullYear();

  useEffect(() => {
    const fetchLeaves = async () => {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        throw new Error('No username or password found');
      }

      try {
        populateLeaves(username, password);
        populateHolidays(username, password);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };
    fetchLeaves();
  }, []);

  if (isLeavesLoading || isHolidaysLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="size-10">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <CalendarProvider>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker start={earliestYear} end={latestYear} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody leaves={leaves}>{({ leave }) => <CalendarItem key={leave.id} leave={leave} />}</CalendarBody>
    </CalendarProvider>
  );
};

export default LeavesCalendar;
