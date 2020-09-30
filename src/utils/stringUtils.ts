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
