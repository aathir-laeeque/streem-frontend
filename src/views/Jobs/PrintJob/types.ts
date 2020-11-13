import { RouteComponentProps } from '@reach/router';

export type PrintJobProps = RouteComponentProps<{
  jobId: string;
}>;

export enum InstructionTags {
  P = 'P',
  SPAN = 'SPAN',
  UL = 'UL',
  OL = 'OL',
  LI = 'LI',
  STRONG = 'STRONG',
  INS = 'INS',
  TEXT = '#text',
}
