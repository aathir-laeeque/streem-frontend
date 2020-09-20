import moment from 'moment';

export const formatDateTime = (time: number, format = 'DD-MM-YYYY HH:mm:ss') =>
  moment.unix(time).utcOffset('+05:30').format(format);

export const formatDuration = (duration: number) => {
  const time = moment.duration(duration);

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
