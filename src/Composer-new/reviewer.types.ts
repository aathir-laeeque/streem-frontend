import { User } from '#store/users/types';

export enum ReviewerState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  DONE_WITH_CR = 'DONE_WITH_CR',
  SUBMITTED_FOR_CR = 'SUBMITTED_FOR_CR',
}

export type Reviewer = Pick<
  User,
  'id' | 'employeeId' | 'firstName' | 'lastName'
> & {
  state: ReviewerState;
};
