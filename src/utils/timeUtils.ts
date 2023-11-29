import {
  differenceInDays,
  differenceInMilliseconds,
  format,
  formatDistanceStrict,
  formatDistanceToNowStrict,
  fromUnixTime,
  startOfDay,
  isBefore,
  isAfter,
  hoursToSeconds,
  minutesToSeconds,
  weeksToDays,
  yearsToMonths,
} from 'date-fns';
import { InputTypes } from './globalTypes';

export const formatDateTime = ({
  value,
  type = InputTypes.DATE_TIME,
  format: _format,
}: {
  value: number | string;
  type?: InputTypes;
  format?: string;
}) => {
  if (value) {
    const time = typeof value === 'string' ? parseInt(value) : value;
    if (_format) {
      return format(fromUnixTime(time), _format);
    }
    const {
      auth: { selectedFacility },
      facilityWiseConstants,
    } = window.store.getState();
    const { dateAndTimeStampFormat, dateFormat, timeFormat } =
      facilityWiseConstants[selectedFacility!.id];
    return format(
      fromUnixTime(time),
      type === InputTypes.DATE_TIME
        ? dateAndTimeStampFormat
        : type === InputTypes.DATE
        ? dateFormat
        : timeFormat,
    );
  } else {
    return '-';
  }
};

export const formatDuration = (seconds: number) => {
  const { hours, minutes, seconds: remainingSeconds } = convertSecondsToTime(seconds);
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const convertSecondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
};

export const formatDateTimeToHumanReadable = (value: number) => {
  const epochDate = fromUnixTime(value);
  const now = new Date();
  let dateText: string | undefined = formatDistanceToNowStrict(epochDate, { addSuffix: true });
  const startOfDate = startOfDay(epochDate);
  const startOfToday = startOfDay(now);
  const daysDiff = differenceInDays(startOfDate, startOfToday);
  const days: any = {
    '0': 'Today',
    '-1': 'Yesterday',
    '1': 'Tomorrow',
  };
  if (Math.abs(daysDiff) <= 1) {
    dateText = days[daysDiff.toString()];
  } else {
    dateText = undefined;
  }
  if (dateText) {
    return `${dateText}, ${formatDateTime({ value, type: InputTypes.TIME })}`;
  }
  return formatDateTime({ value });
};

export const getOverDueByEpoch = (epoch: number) => {
  const epochDate = fromUnixTime(epoch);
  const now = new Date();
  if (differenceInMilliseconds(now, epochDate) < 1) {
    return `Overdue by ${formatDistanceToNowStrict(epochDate)}`;
  }
};

export const getDelayBetweenEpoch = (expected: number, actual: number) => {
  const actualDate = fromUnixTime(actual);
  const expectedDate = fromUnixTime(expected);
  if (differenceInMilliseconds(expectedDate, actualDate) > 1) {
    return `Delayed by ${formatDistanceStrict(actualDate, expectedDate)}`;
  }
};

export const checkJobExecutionDelay = (actual: number, expected: number) => {
  const actualDate = fromUnixTime(actual);
  const expectedDate = fromUnixTime(expected);
  const difference = differenceInMilliseconds(actualDate, expectedDate);
  if (difference > 0) {
    return true;
  } else {
    return false;
  }
};

export const getLocalTimeOffset = () => {
  const date = new Date();
  const localTimeOffsetMinutes = -date.getTimezoneOffset();
  //We need to negate above because it represents the number of minutes you need to subtract from the current local time to get to Coordinated Universal Time (UTC).
  const hours = Math.floor(Math.abs(localTimeOffsetMinutes) / 60);
  const minutes = Math.abs(localTimeOffsetMinutes) % 60;
  const sign = localTimeOffsetMinutes < 0 ? '-' : '+';
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const localTimeOffset = `${sign}${formattedHours}:${formattedMinutes}`;
  return localTimeOffset;
};

export const getEpochTimeDifference = (epoch: number) => {
  const current = new Date();
  const expectedTime = fromUnixTime(epoch);

  if (isBefore(current, expectedTime)) {
    return 'EARLY';
  } else if (isAfter(current, expectedTime)) {
    return 'LATE';
  } else {
    return 'ON TIME';
  }
};

export const calculateSecondsFromDuration = (duration: Record<string, number>) => {
  let durationSeconds = 0;
  Object.entries(duration).forEach(([key, value]: any) => {
    if (value) {
      switch (key) {
        case 'year':
          durationSeconds += hoursToSeconds(yearsToMonths(value) * 30 * 24);
          break;
        case 'month':
          durationSeconds += hoursToSeconds(value * 30 * 24);
          break;
        case 'week':
          durationSeconds += hoursToSeconds(weeksToDays(value) * 24);
          break;
        case 'day':
          durationSeconds += hoursToSeconds(value * 24);
          break;
        case 'hour':
          durationSeconds += hoursToSeconds(value);
          break;
        case 'minute':
          durationSeconds += minutesToSeconds(value);
          break;
        default:
          break;
      }
    }
  });
  return durationSeconds;
};
