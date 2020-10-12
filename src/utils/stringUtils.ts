import { User } from '#store/users/types';

export const getInitials = (name: string) => {
  let initials: RegExpMatchArray | string = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFullName = ({
  firstName,
  lastName,
}: Pick<User, 'firstName' | 'lastName'>) => {
  return `${firstName} ${lastName}`;
};

export const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const removeUnderscore = (str: string) => {
  return str.replace(/_/g, ' ');
};
