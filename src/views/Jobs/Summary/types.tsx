import JobSummaryCWEIcon from '#assets/svg/JobSummaryCWEIcon';
import JobSummaryErrorCorrectionIcon from '#assets/svg/JobSummaryErrorCorrectionIcon';
import JobSummaryParameterIcon from '#assets/svg/JobSummaryParameterIcon';
import JobSummarySkippedIcon from '#assets/svg/JobSummarySkippedIcon';
import JobSummaryTimeIcon from '#assets/svg/JobSummaryTimeIcon';
import { Property } from '#store/properties/types';
import JobSummaryYesNoIcon from '#assets/svg/JobSummaryYesNoIcon';
import { User } from '#services/users';
import React from 'react';
import { CompletedJobStates, Job } from '../NewListView/types';

export enum Exceptions {
  'DURATION_EXCEPTION' = 'Duration Exception',
  'PARAMETER_DEVIATION' = 'Parameter Deviation',
  'COMPLETED_WITH_EXCEPTION' = 'Completed with Exception',
  'SKIPPED' = 'Skipped',
  'ERROR_CORRECTION' = 'Error Correction',
  'YES_NO' = 'Yes/No',
}

export const ExceptionsIconMapping = {
  ['DURATION_EXCEPTION']: <JobSummaryTimeIcon className="icon" />,
  ['PARAMETER_DEVIATION']: <JobSummaryParameterIcon className="icon" />,
  ['COMPLETED_WITH_EXCEPTION']: <JobSummaryCWEIcon className="icon" />,
  ['SKIPPED']: <JobSummarySkippedIcon className="icon" />,
  ['ERROR_CORRECTION']: <JobSummaryErrorCorrectionIcon className="icon" />,
  ['YES_NO']: <JobSummaryYesNoIcon className="icon" />,
};

/**
 * * See if createdAt, createdBy, startedAt, endedAt fields should be added to JOB interface and used form there
 */
export interface JobSummary {
  code: Job['code'];
  checklist: Checklist;
  completedBy: CompletedBy;
  createdAt: number;
  createdBy: CreatedBy;
  cweDetails: CWEDetails | null;
  endedAt: number;
  id: Job['id'];
  properties: Pick<Property, 'id' | 'name' | 'value' | 'label'>[];
  stages: Stage[];
  state: CompletedJobStates;
  startedAt: number | null;
  totalAssignees: number;
  totalDuration: number | null;
  totalStageDuration: number | null;
  totalTaskExceptions: number;
  timeStampFormat: string;
}

interface Checklist {
  id: string;
  name: string;
}

type CreatedBy = Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName'>;

type CompletedBy = Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName'>;

export interface Stage {
  averageTaskCompletionDuration: number;
  id: string;
  name: string;
  orderTree: number;
  tasks: Task[];
  totalDuration: number;
  totalTaskExceptions: number;
}

interface Task {
  exceptions: Exception[];
  id: string;
  name: string;
  orderTree: number;
}

type ExceptionType =
  | 'DURATION_EXCEPTION'
  | 'PARAMETER_DEVIATION'
  | 'COMPLETED_WITH_EXCEPTION'
  | 'SKIPPED'
  | 'ERROR_CORRECTION'
  | 'YES_NO';

export interface Exception {
  initiator: CompletedBy;
  parameterDeviation?: ParameterDeviation;
  remark: string;
  timer?: Timer;
  type: ExceptionType;
}

export interface ParameterDeviation {
  activity: Activity;
  userInput: number;
}

interface Activity {
  operator: string;
  parameter: string;
  type: string;
  uom: string;
  value: string;
}

export interface Timer {
  endedAt: number;
  maxPeriod: number;
  minPeriod: number;
  startedAt: number;
  timerOperator: string;
}

export interface CWEDetails {
  comment: string;
  medias: Media[];
  reason: string;
}

interface Media {
  archived: boolean;
  description: string | null;
  filename: string;
  id: string;
  link: string;
  name: string | null;
  type: string;
}
