import { User } from '#store/users/types';
import { Comment } from './checklist.types';

export enum CollaboratorState {
  ILLEGAL = 'ILLEGAL',
  NOT_STARTED = 'NOT_STARTED',
  BEING_REVIEWED = 'BEING_REVIEWED',
  COMMENTED_OK = 'COMMENTED_OK',
  COMMENTED_CHANGES = 'COMMENTED_CHANGES',
  REQUESTED_CHANGES = 'REQUESTED_CHANGES',
  REQUESTED_NO_CHANGES = 'REQUESTED_NO_CHANGES',
  SIGNED = 'SIGNED',
}

export enum CollaboratorType {
  REVIEWER = 'REVIEWER',
  APPROVER = 'APPROVER',
}

export type Collaborator = Pick<
  User,
  'id' | 'employeeId' | 'firstName' | 'lastName' | 'email'
> &
  Pick<Comment, 'id' | 'comments' | 'commentedAt' | 'modifiedAt'> & {
    state: CollaboratorState;
    reviewCycle: number;
    type: CollaboratorType;
  };
