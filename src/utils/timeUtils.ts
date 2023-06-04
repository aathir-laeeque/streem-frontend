import 'moment-duration-format';
import moment from 'moment';
import { store } from '../App';
import { InputTypes } from './globalTypes';

export const formatDateTime = (time: number, format?: string) => {
  const {
    auth: { selectedFacility },
    facilityWiseConstants,
  } = store.getState();
  const { dateAndTimeStampFormat } = facilityWiseConstants[selectedFacility!.id];

  return moment.unix(time).format(format || dateAndTimeStampFormat);
};

// TODO:Deprecate this function and use the one below this one.
export const formatDuration = (duration: number) => {
  const time = moment.duration(duration, 'seconds');

  const days = time.days();
  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  if (days || hours) {
    return (days * 24 + hours)
      .toString()
      .padStart(2, '0')
      .concat(' : ')
      .concat(minutes.toString().padStart(2, '0').concat(' : '))
      .concat(seconds.toString().padStart(2, '0'));
  } else if (minutes) {
    return minutes
      .toString()
      .padStart(2, '0')
      .concat(' : ')
      .concat(seconds.toString().padStart(2, '0'));
  } else {
    return seconds.toString().padStart(2, '0');
  }
};

/**
 * TODO: rename this function to formatDuration once the above function is deprecated
 */
type formatDurationArgs = {
  duration: number;
  format?: string;
  unit?: moment.unitOfTime.DurationConstructor;
  formatSettings?: moment.DurationFormatSettings;
};

export const formatDuration1 = ({
  duration,
  format = 'DDD [day] : HH [hr] : mm [min] : ss [sec]',
  unit,
  formatSettings = {},
}: formatDurationArgs) =>
  moment.duration(duration, unit ?? 's').format(format, { ...formatSettings, trim: 'all' });

export const formatDateByInputType = (
  inputType: InputTypes,
  value: string | number,
  format?: string,
) => {
  const {
    auth: { selectedFacility },
    facilityWiseConstants,
  } = store.getState();
  const { dateAndTimeStampFormat, timeFormat, dateFormat } =
    facilityWiseConstants[selectedFacility!.id];
  const castedValue = typeof value === 'string' ? parseInt(value) : value;
  return inputType === InputTypes.DATE
    ? formatDateTime(castedValue, format || dateFormat)
    : inputType === InputTypes.TIME
    ? formatDateTime(castedValue, format || timeFormat)
    : formatDateTime(castedValue, format || dateAndTimeStampFormat);
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
