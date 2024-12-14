'use client';

import { exampleLeaves } from '@/lib/content';
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
import { useEffect, useState } from 'react';
import { Leave } from '@/constraints/types/core-types';
import Spinner from './Spinner';
import { getLeaves } from '@/services/leaves-service';

const LeavesCalendar: FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const earliestYear =
    exampleLeaves
      .map((leave) => leave.startAt.getFullYear())
      .sort()
      .at(0) ?? new Date().getFullYear();

  const latestYear =
    exampleLeaves
      .map((leave) => leave.endAt.getFullYear())
      .sort()
      .at(-1) ?? new Date().getFullYear();

  useEffect(() => {
    const fetchLeaves = async () => {
      setIsLoading(true);
      try {
        const formattedLeaves = await getLeaves();
        setLeaves(formattedLeaves);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  if (isLoading) {
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
