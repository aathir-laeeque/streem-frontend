export enum ReviewerState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  DONE_WITH_CR = 'DONE_WITH_CR',
}

export type Reviewer = {
  employeeId: string;
  firstName: string;
  id: number;
  lastName: string;
  state: ReviewerState;
};
