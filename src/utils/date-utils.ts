import { DateTime } from 'luxon';

/**
 * Utility to convert a Date object to epoch time (milliseconds since 1970-01-01)
 * @param date - The Date object to be converted.
 * @returns The epoch time as a number.
 */
export function dateToEpoch(date: Date): number {
  if (!(date instanceof Date)) {
    throw new TypeError('Expected a Date object');
  }
  return DateTime.fromJSDate(date).toMillis();
}

/**
 * Utility to convert epoch time to a Date object
 * @param epoch - The epoch time (milliseconds since 1970-01-01).
 * @returns A Date object representing the epoch time.
 */
export function epochToDate(epoch: number): Date {
  if (typeof epoch !== 'number') {
    throw new TypeError('Expected a number');
  }
  return DateTime.fromMillis(epoch).toJSDate();
}

/**
 * Utility to calculate the difference in days between two epoch times.
 * @param epoch1 - The first epoch time (in milliseconds).
 * @param epoch2 - The second epoch time (in milliseconds).
 * @returns The number of days of difference as an integer.
 */
export function epochDifferenceInDays(epoch1: number, epoch2: number): number {
  if (typeof epoch1 !== 'number' || typeof epoch2 !== 'number') {
    throw new TypeError('Expected numbers');
  }
  const dt1 = DateTime.fromMillis(epoch1);
  const dt2 = DateTime.fromMillis(epoch2);
  return Math.floor(Math.abs(dt2.diff(dt1, 'days').days));
}

/**
 * Function to add a specified number of days to an epoch time.
 * @param epoch - The original epoch time (in milliseconds).
 * @param days - The number of days to add.
 * @returns The new epoch time (in milliseconds) after adding the specified days.
 */
export function addDaysToEpoch(epoch: number, days: number): number {
  return DateTime.fromMillis(epoch).plus({ days }).toMillis();
}

/**
 * Converts epoch time to a human-readable date format with ordinal suffixes (st, nd, rd, th).
 * @param epoch - The epoch time in milliseconds since 1970-01-01.
 * @param truncateYear - Optional. If true, displays year in 2-digit format with a leading apostrophe. Default is false.
 * @param includeTime - Optional. If true, includes time in the output. Default is false.
 * @param timezone - Optional. IANA timezone string. If not provided, uses local timezone.
 * @returns A formatted date string (e.g., "Sep 30th, 2024" or "Sep 30th, '24" if truncateYear is true).
 * @throws {TypeError} If epoch is not a number.
 */
export function formatEpochToHumanReadable(
  epoch: number,
  truncateYear = false,
  includeTime = false,
  timezone?: string,
): string {
  if (typeof epoch !== 'number') {
    throw new TypeError('Expected a number for epoch');
  }

  const dt = timezone ? DateTime.fromMillis(epoch).setZone(timezone) : DateTime.fromMillis(epoch);

  // Helper to get ordinal suffix
  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  const day = dt.day;
  const ordinal = getOrdinalSuffix(day);
  const month = dt.toFormat('MMM');
  let year: string;
  if (truncateYear) {
    year = `'${dt.toFormat('yy')}`;
  } else {
    year = dt.toFormat('yyyy');
  }

  let dateStr = `${day}${ordinal} ${month}, ${year}`;

  if (includeTime) {
    const timeStr = dt.toFormat('hh:mm a');
    dateStr += `, ${timeStr}`;
  }

  return dateStr;
}

/**
 * Utility to get today's date as a Date object.
 * @returns A Date object representing today's date at 00:00:00 hours.
 */
export function getTodayDate(timezone: string = 'Asia/Kolkata'): Date {
  return DateTime.now().setZone(timezone).startOf('day').toJSDate();
}

/**
 * Calculates the number of days left between current timestamp and a reference timestamp
 * Returns positive days if reference is in future, negative if in past
 * Returns 1 for 0-24 hours, 2 for 24-48 hours, and so on
 * @param currentEpoch - Current timestamp in milliseconds
 * @param referenceEpoch - Reference timestamp in milliseconds to compare against
 * @returns Number of days left (can be negative if reference is in past)
 */
export function getDaysLeft(currentEpoch: number, referenceEpoch: number): number {
  if (typeof currentEpoch !== 'number' || typeof referenceEpoch !== 'number') {
    throw new TypeError('Expected numbers for timestamps');
  }

  const current = DateTime.fromMillis(currentEpoch);
  const reference = DateTime.fromMillis(referenceEpoch);
  const diffInDays = reference.diff(current, 'days').days;

  return diffInDays > 0 ? Math.ceil(diffInDays) : Math.floor(diffInDays);
}

/**
 * Converts milliseconds to a human readable duration string
 * @param epoch - Duration in milliseconds
 * @returns A formatted duration string (e.g., "2 days 3 hours 30 minutes" or "45 minutes").
 * Does not include months or years in the output.
 * @throws {TypeError} If epoch is not a number
 */
export function formatEpochToDuration(epoch: number): string {
  if (typeof epoch !== 'number') {
    throw new TypeError('Expected a number for epoch');
  }

  const duration = DateTime.fromMillis(epoch).diff(DateTime.fromMillis(0), ['days', 'hours', 'minutes']);
  const { days, hours, minutes } = duration.toObject();

  const parts = [];
  if (days && days > 0) {
    parts.push(`${Math.floor(days)} d`);
  }
  if (hours && hours > 0) {
    parts.push(`${Math.floor(hours)} hr`);
  }
  if (minutes && minutes > 0) {
    parts.push(`${Math.floor(minutes)} min`);
  }

  return parts.join(' ');
}
/**
 * Checks if a given epoch time is within the next 24 hours and returns remaining time
 * @param epoch - The epoch time to check (in milliseconds)
 * @returns Object with hours, minutes and seconds left if within 24 hours, undefined otherwise
 */
export function getTimeLeftIfWithin24Hours(
  epoch: number,
): { hours: number; minutes: number; seconds: number } | undefined {
  if (typeof epoch !== 'number') {
    throw new TypeError('Expected a number for epoch');
  }

  const now = DateTime.now();
  const target = DateTime.fromMillis(epoch);
  const diff = target.diff(now, ['hours', 'minutes', 'seconds']);
  const { hours, minutes, seconds } = diff.toObject();

  // Return undefined if target is in the past or more than 24 hours away
  if (hours == null || minutes == null || seconds == null || hours < 0 || minutes < 0 || seconds < 0 || hours >= 24) {
    return undefined;
  }

  return {
    hours: Math.floor(hours),
    minutes: Math.floor(minutes),
    seconds: Math.floor(seconds),
  };
}
/**
 * Converts a Date object to a different timezone
 * @param date - The Date object to convert
 * @param timezone - The IANA timezone string to convert to (e.g. 'America/New_York')
 * @returns A new Date object in the specified timezone
 * @throws {TypeError} If date is not a Date object or timezone is invalid
 */
export function convertDateToTimezone(date: Date, timezone: string): Date {
  if (!(date instanceof Date)) {
    throw new TypeError('Expected a Date object');
  }
  return DateTime.fromJSDate(date).setZone(timezone).toJSDate();
}

/**
 * Converts an epoch timestamp to a time string in the specified timezone
 * @param epoch - The epoch timestamp in milliseconds
 * @param timezone - Optional IANA timezone string (e.g. 'America/New_York'). Defaults to local timezone if not specified
 * @returns A formatted time string in the specified timezone
 * @throws {TypeError} If epoch is not a number
 */
export function formatEpochToTimeInTimezone(epoch: number, timezone?: string): string {
  if (typeof epoch !== 'number') {
    throw new TypeError('Expected a number for epoch');
  }
  const dt = DateTime.fromMillis(epoch);
  return timezone ? dt.setZone(timezone).toFormat('h:mm a') : dt.toFormat('h:mm a');
}
