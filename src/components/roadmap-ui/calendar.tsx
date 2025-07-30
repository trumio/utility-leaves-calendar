'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getDay, getDaysInMonth } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, Gift } from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import AdditionalInfoModal from '../core/modals/AdditionalInfoModal';
import { stringToColour } from '@/utils/miscellaneous-utils';
import { Leave } from '@/constraints/types/core-types';
import { isHoliday } from '@/utils/core-utils';
import { useCoreStore } from '@/stores/core-store';

export type CalendarState = {
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  year: number;
  setMonth: (month: CalendarState['month']) => void;
  setYear: (year: CalendarState['year']) => void;
};

export const useCalendar = create<CalendarState>()(
  devtools((set) => ({
    month: new Date().getMonth() as CalendarState['month'],
    year: new Date().getFullYear(),
    setMonth: (month: CalendarState['month']) => set(() => ({ month })),
    setYear: (year: CalendarState['year']) => set(() => ({ year })),
  })),
);

type CalendarContextProps = {
  locale: Intl.LocalesArgument;
  startDay: number;
};

const CalendarContext = createContext<CalendarContextProps>({
  locale: 'en-US',
  startDay: 0,
});

type ComboboxProps = {
  value: string;
  setValue: (value: string) => void;
  data: {
    value: string;
    label: string;
  }[];
  labels: {
    button: string;
    empty: string;
    search: string;
  };
  className?: string;
};

export const monthsForLocale = (
  localeName: Intl.LocalesArgument,
  monthFormat: Intl.DateTimeFormatOptions['month'] = 'long',
) => {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat }).format;
  return [...new Array(12).keys()].map((m) => format(new Date(Date.UTC(2021, m % 12))));
};

export const daysForLocale = (locale: Intl.LocalesArgument, startDay: number) => {
  const weekdays: string[] = [];
  const baseDate = new Date(2024, 0, startDay);

  for (let i = 0; i < 7; i++) {
    weekdays.push(new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(baseDate));
    baseDate.setDate(baseDate.getDate() + 1);
  }

  return weekdays;
};

const Combobox = ({ value, setValue, data, labels, className }: ComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn('w-[120px] sm:w-40 justify-between capitalize text-sm', className)}
        >
          {value ? data.find((item) => item.value === value)?.label : labels.button}
          <ChevronsUpDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] sm:w-40 p-0">
        <Command
          filter={(value, search) => {
            const label = data.find((item) => item.value === value)?.label;
            return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={labels.search} className="text-sm" />
          <CommandList>
            <CommandEmpty>{labels.empty}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className="capitalize text-sm"
                >
                  <Check
                    className={cn('mr-2 h-3 w-3 sm:h-4 sm:w-4', value === item.value ? 'opacity-100' : 'opacity-0')}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

type OutOfBoundsDayProps = {
  day: number;
};

const OutOfBoundsDay = ({ day }: OutOfBoundsDayProps) => (
  <div className="relative h-full w-full bg-zinc-50/50 p-1 text-zinc-400 text-[10px] sm:text-xs dark:bg-zinc-800/50 dark:text-zinc-500">
    {day}
  </div>
);

export type CalendarBodyProps = {
  leaves: Leave[];
  children: (props: { leave: Leave }) => ReactNode;
};

export const CalendarBody = ({ leaves, children }: CalendarBodyProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { month, year } = useCalendar();
  const { startDay } = useContext(CalendarContext);
  const daysInMonth = getDaysInMonth(new Date(year, month, 1));
  const firstDay = (getDay(new Date(year, month, 1)) - startDay + 7) % 7;
  const days: ReactNode[] = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
  const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (_, i) => i + 1);

  const holidays = useCoreStore((state) => state.holidays);

  const openModal = (date: Date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  function getLeavesForDay(day: number): Leave[];
  function getLeavesForDay(day: Date): Leave[];
  function getLeavesForDay(day: number | Date): Leave[] {
    const targetDate = typeof day === 'number' ? new Date(year, month, day) : day;

    return leaves.filter((leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return targetDate >= leaveStart && targetDate <= leaveEnd;
    });
  }

  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDaysArray[prevMonthDays - firstDay + i];
    if (day) {
      days.push(<OutOfBoundsDay key={`prev-${i}`} day={day} />);
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const leavesForDay = getLeavesForDay(day);
    const isToday =
      new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
    const holidayName = isHoliday(new Date(year, month, day), holidays);

    days.push(
      <div
        key={day}
        className={cn(
          'relative flex h-full w-full flex-col p-1.5 sm:p-3 text-xs sm:text-sm transition-colors',
          'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer',
          isToday && 'bg-blue-50/50 dark:bg-blue-900/10',
        )}
        onClick={() => openModal(new Date(year, month, day))}
      >
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <span
            className={cn(
              'font-medium',
              isToday ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100',
            )}
          >
            {day}
          </span>
          {isToday && (
            <span className="text-[8px] sm:text-[10px] font-medium text-blue-600 dark:text-blue-400">Today</span>
          )}
        </div>

        {holidayName && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full bg-gradient-to-br from-amber-100/90 via-amber-50/80 to-amber-100/90 dark:from-amber-900/30 dark:via-amber-800/25 dark:to-amber-900/30 px-2 py-2 rounded-lg border border-amber-200/60 dark:border-amber-700/40 shadow-sm">
              <div className="flex items-center justify-center gap-1 text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold text-amber-600/90 dark:text-amber-400/90 text-center mb-0.5">
                <Gift size={12} className="text-amber-600/90 dark:text-amber-400/90" />
                Holiday
              </div>
              <div className="text-[9px] sm:text-[11px] font-medium text-amber-800 dark:text-amber-200 text-center leading-tight">
                {holidayName}
              </div>
            </div>
          </div>
        )}

        {!holidayName && (
          <div className="space-y-0.5 sm:space-y-1">{leavesForDay.slice(0, 2).map((leave) => children({ leave }))}</div>
        )}

        {!holidayName && leavesForDay.length > 2 && (
          <span className="mt-0.5 sm:mt-1 block text-[8px] sm:text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
            +{leavesForDay.length - 2} more
          </span>
        )}
      </div>,
    );
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
  const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, i) => i + 1);

  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthDaysArray[i];
      if (day) {
        days.push(<OutOfBoundsDay key={`next-${i}`} day={day} />);
      }
    }
  }

  return (
    <div className="grid flex-grow grid-cols-7 border-l border-zinc-200 dark:border-zinc-800">
      {days.map((day, index) => (
        <div
          key={index}
          className={cn(
            'relative aspect-square overflow-hidden border-t border-r border-zinc-200 dark:border-zinc-800',
            index % 7 === 6 && 'border-r-0',
          )}
        >
          {day}
        </div>
      ))}
      <AdditionalInfoModal
        leaves={selectedDate ? getLeavesForDay(selectedDate) : []}
        leavesDate={selectedDate}
        isOpen={!!selectedDate}
        onClose={closeModal}
      />
    </div>
  );
};

export type CalendarDatePickerProps = {
  className?: string;
  children: ReactNode;
};

export const CalendarDatePicker = ({ className, children }: CalendarDatePickerProps) => (
  <div className={cn('flex flex-wrap sm:flex-nowrap items-center gap-1 sm:gap-2', className)}>{children}</div>
);

export type CalendarMonthPickerProps = {
  className?: string;
};

export const CalendarMonthPicker = ({ className }: CalendarMonthPickerProps) => {
  const { month, setMonth } = useCalendar();
  const { locale } = useContext(CalendarContext);

  return (
    <Combobox
      className={className}
      value={month.toString()}
      setValue={(value) => setMonth(Number.parseInt(value) as CalendarState['month'])}
      data={monthsForLocale(locale).map((month, index) => ({
        value: index.toString(),
        label: month,
      }))}
      labels={{
        button: 'Month',
        empty: 'No month found',
        search: 'Search month',
      }}
    />
  );
};

export type CalendarYearPickerProps = {
  className?: string;
  start: number;
  end: number;
};

export const CalendarYearPicker = ({ className, start, end }: CalendarYearPickerProps) => {
  const { year, setYear } = useCalendar();

  return (
    <Combobox
      className={className}
      value={year.toString()}
      setValue={(value) => setYear(Number.parseInt(value))}
      data={Array.from({ length: end - start + 1 }, (_, i) => ({
        value: (start + i).toString(),
        label: (start + i).toString(),
      }))}
      labels={{
        button: 'Year',
        empty: 'No year found',
        search: 'Search year',
      }}
    />
  );
};

export type CalendarDatePaginationProps = {
  className?: string;
};

export const CalendarDatePagination = ({ className }: CalendarDatePaginationProps) => {
  const { month, year, setMonth, setYear } = useCalendar();

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth((month - 1) as CalendarState['month']);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth((month + 1) as CalendarState['month']);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button onClick={handlePreviousMonth} variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
        <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Button onClick={handleNextMonth} variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

export type CalendarDateProps = {
  children: ReactNode;
};

export const CalendarDate = ({ children }: CalendarDateProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3">{children}</div>
);

export type CalendarHeaderProps = {
  className?: string;
};

export const CalendarHeader = ({ className }: CalendarHeaderProps) => {
  const { locale, startDay } = useContext(CalendarContext);

  return (
    <div className={cn('grid flex-grow grid-cols-7', className)}>
      {daysForLocale(locale, startDay).map((day) => (
        <div
          key={day}
          className="p-2 sm:p-3 text-center sm:text-right text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export type CalendarItemProps = {
  leave: Leave;
  className?: string;
};

export const CalendarItem = ({ leave, className }: CalendarItemProps) => (
  <div
    className={cn(
      'flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm text-[10px] sm:text-xs font-medium',
      'bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800',
      'border border-zinc-200/50 dark:border-zinc-700/50',
      'transition-colors duration-200',
      className,
    )}
    key={leave.id}
  >
    <div
      className="hidden sm:block h-2 w-2 shrink-0 rounded-full"
      style={{
        backgroundColor: stringToColour(leave.department),
      }}
    />
    <span
      className="truncate text-zinc-700 dark:text-zinc-300 sm:text-inherit"
      style={{
        color: window.matchMedia('(max-width: 640px)').matches ? stringToColour(leave.department) : 'inherit',
      }}
    >
      {leave.name}
    </span>
  </div>
);

export type CalendarProviderProps = {
  locale?: Intl.LocalesArgument;
  startDay?: number;
  children: ReactNode;
  className?: string;
};

export const CalendarProvider = ({ locale = 'en-US', startDay = 0, children, className }: CalendarProviderProps) => (
  <CalendarContext.Provider value={{ locale, startDay }}>
    <div
      className={cn(
        'relative flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
        className,
      )}
    >
      {children}
    </div>
  </CalendarContext.Provider>
);
