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

  return moment
    .unix(time)
    .utcOffset('+05:30')
    .format(format || dateAndTimeStampFormat);
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
      .concat(' hr : ')
      .concat(minutes.toString().padStart(2, '0').concat(' min : '))
      .concat(seconds.toString().padStart(2, '0').concat(' sec'));
  } else if (minutes) {
    return minutes
      .toString()
      .padStart(2, '0')
      .concat(' min : ')
      .concat(seconds.toString().padStart(2, '0').concat(' sec'));
  } else {
    return seconds.toString().padStart(2, '0').concat(' sec');
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
  const castedValue = typeof value === 'string' ? parseInt(value) : value;
  return inputType === InputTypes.DATE
    ? formatDateTime(castedValue, format || 'YYYY-MM-DD')
    : inputType === InputTypes.TIME
    ? formatDateTime(castedValue, format || 'h:mm')
    : formatDateTime(castedValue, format || 'YYYY-MM-DDThh:mm');
};
