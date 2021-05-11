import 'moment-duration-format';

import moment from 'moment';

export const formatDateTime = (time: number, format = 'DD-MM-YYYY HH:mm:ss') =>
  moment.unix(time).utcOffset('+05:30').format(format);

/**
 * TODO:Deprecate this function and use the one below this one.
 */
export const formatDuration = (duration: number) => {
  const time = moment.duration(duration, 'seconds');

  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  if (hours) {
    return hours
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
  moment
    .duration(duration, unit ?? 's')
    .format(format, { ...formatSettings, trim: 'all' });
