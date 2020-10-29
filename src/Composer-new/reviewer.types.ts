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

export enum CollaboratorStateContent {
  ILLEGAL = 'ILLEGAL',
  NOT_STARTED = 'Not Started',
  BEING_REVIEWED = 'In Progress',
  COMMENTED_OK = 'In Progress',
  COMMENTED_CHANGES = 'In Progress',
  REQUESTED_CHANGES = 'Completed',
  REQUESTED_NO_CHANGES = 'Completed',
  SIGNED = 'Signed',
}

export enum CollaboratorStateColors {
  ILLEGAL = '#1d84ff',
  NOT_STARTED = '#5aa700',
  BEING_REVIEWED = '#f7b500',
  COMMENTED_OK = '#f7b500',
  COMMENTED_CHANGES = '#f7b500',
  REQUESTED_CHANGES = '#5aa700',
  REQUESTED_NO_CHANGES = '#5aa700',
  SIGNED = '#5aa700',
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
