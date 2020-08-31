import { Activity } from '../checklist.types';

export type ActivityListProps = {
  activities: Activity[];
};

export type ActivityProps = {
  activity: Activity;
};

export enum Selections {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}
