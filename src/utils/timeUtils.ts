import {
  differenceInDays,
  differenceInMilliseconds,
  format,
  formatDistanceStrict,
  formatDistanceToNowStrict,
  fromUnixTime,
  intervalToDuration,
  startOfDay,
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
};

export const formatDuration = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const zeroPad = (num?: number) => String(num).padStart(2, '0');
  const formatted = [duration.hours, duration.minutes, duration.seconds]
    .filter(Boolean)
    .map(zeroPad)
    .join(':');

  return formatted;
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
  const localTimeOffsetMinutes = date.getTimezoneOffset();
  const hours = Math.floor(Math.abs(localTimeOffsetMinutes) / 60);
  const minutes = Math.abs(localTimeOffsetMinutes) % 60;
  const sign = localTimeOffsetMinutes < 0 ? '-' : '+';
  const localTimeOffset = `${sign}${hours}:${minutes}`;
  return localTimeOffset;
};
