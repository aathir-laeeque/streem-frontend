import { ValidationRules } from 'react-hook-form';
export interface Pageable {
  page: number;
  pageSize: number;
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ResponseObj<T> {
  object: string;
  status: string;
  message: string;
  data: T & T[];
  pageable: Pageable | null;
  errors?: any;
}

export enum ACTIVITY_SELECTIONS {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export type ValidatorProps = Record<
  string,
  {
    functions: ValidationRules['validate'];
    messages: Record<string, string>;
  }
>;

// CHECKLIST_NOT_FOUND("E101", "Checklist Not Found"),

// TASK_INCOMPLETE("E201", "Task Incomplete"),
// TASK_NOT_FOUND("E202", "Task Not Found"),

// STAGE_INCOMPLETE("E301", "Stage Incomplete"),

// ACTIVITY_INCOMPLETE("E401", "Activity Incomplete"),

// MEDIA_NOT_FOUND("E501", "Media Not found"),

// USER_NOT_FOUND("E601", "User Not found"),

// JOB_NOT_FOUND("E701", "Job Not found"),
// JOB_IS_NOT_IN_PROGRESS("E702", "Job is not in progress"),
// JOB_ALREADY_COMPLETED("E703", "Job already completed"),

// USER_NOT_ASSIGNED_TO_EXECUTE_JOB("E801", "User not allowed to execute the job"),

// RESOURCE_ALREADY_EXIST("E901", "Resource already Exists"),

// NOT_AUTHORIZED("E1001", "Unauthorized"),
// ACCESS_DENIED("E1002", "Access Denied"),

// FILE_UPLOAD_LIMIT_EXCEEDED("E1101", "File upload size exceeded"),

// JAAS_SERVICE_ERROR("E1201", "Jaas service error");

// export enum ErrorCodesMessageMapping {
//   E101 = 'Checklist Not found',

//   E201 = 'Task Incomplete',
//   E202 = 'Task Not Found',

//   E301 = 'Stage Incomplete',

//   E401 = 'Activity Incomplete',

//   E501 = 'Media Not found',

//   E601 = 'User Not found',

//   E701 = 'Job Not found',
//   E702 = 'Job is not in progress',
//   E703 = 'Job already completed',

//   E801 = 'User not allowed to execute the job',

//   E901 = 'Resource already Exists',

//   E1001 = 'Unauthorized',
//   E1002 = 'Access Denied',

//   E1101 = 'File upload size exceeded',
//   E1201 = 'Jaas service error',
// }

export type Error = {
  id: number;
  code: string;
  message: string;
  type: string;
};

export type FileUploadData = {
  filename: string;
  link: string;
  type: string;
};
