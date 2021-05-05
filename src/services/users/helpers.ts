import { User } from './types';

type getUserNameArgs = {
  user: Pick<User, 'employeeId' | 'firstName' | 'lastName'>;
  withEmployeeId?: boolean;
};

export const getUserName = ({
  user: { firstName, lastName, employeeId },
  withEmployeeId = false,
}: getUserNameArgs) =>
  `${firstName} ${lastName}${withEmployeeId ? ` ID: ${employeeId}` : ''}`;
