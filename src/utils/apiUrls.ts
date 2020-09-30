import { Task } from '#Composer/checklist.types';

import { Job } from '../views/Jobs/types';
import { fetchBaseUrl } from './constants';

const baseUrl = fetchBaseUrl();
//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: number) =>
  `${baseUrl}/checklists/${checklistId}`;

// Inbox
export const apiGetInbox = () => `${baseUrl}/jobs/assignee/me`;

// Job
export const apiGetJobs = () => `${baseUrl}/jobs`;

export const apiAssignUser = (jobId: string, userId: string | number) =>
  `${baseUrl}/jobs/${jobId}/users/${userId}`;

export const apiUnAssignUser = (jobId: string, userId: string | number) =>
  `${baseUrl}/jobs/${jobId}/users/${userId}`;

export const apiStartJob = (jobId: Job['id'], action: string) =>
  `${baseUrl}/jobs/${jobId}/${action}`;

export const apiPerformActionOnTask = (taskId: Task['id'], action: string) =>
  `${baseUrl}/tasks/${taskId}/${action}`;

export const apiCompleteJob = (withException: boolean, jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/${
    withException ? 'complete-with-exception' : 'complete'
  }`;

// Properties
export const apiGetProperties = () => `${baseUrl}/properties`;

// Facilities

export const apiGetFacilities = () => `${baseUrl}/facilities`;

//Users
export const apiGetUsers = () => `${baseUrl}/users`;

export const apiGetUser = (id: number | string) => `${baseUrl}/users/${id}`;

export const apiGetSelectedJob = (jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}`;

export const apiExecuteActivity = () => `${baseUrl}/activities/execute`;

export const apiFixActivity = () => `${baseUrl}/activities/error-correction`;

export const apiCompleteTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}`;

export const apiEnableTaskErrorCorrection = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/correction/start`;

export const apiCompleteTaskErrorCorrection = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/correction/complete`;

export const apiCancelTaskErrorCorrection = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/correction/cancel`;

// Signature / File
export const apiUploadFile = () => `${baseUrl}/files/`;

// Auth

export const apiCheckUsername = (username: string) =>
  `${baseUrl}/users/check-username?username=${username}`;

export const apiLogin = () => `${baseUrl}/auth/login`;

export const apiLogOut = () => `${baseUrl}/auth/logout`;

export const apiForgotPassword = () => `${baseUrl}/auth/reset-password`;

export const apiRefreshToken = () => `${baseUrl}/auth/refresh-token`;

export const apiResendInvite = (id: number | string) =>
  `${baseUrl}/users/${id}/resend-invite`;

export const apiArchiveUser = (id: number | string) =>
  `${baseUrl}/users/${id}/archive`;

export const apiUnArchiveUser = (id: number | string) =>
  `${baseUrl}/users/${id}/unarchive`;

export const apiRegister = () => `${baseUrl}/auth/register`;

export const apiResetPassword = () => `${baseUrl}/auth/update-password`;

export const apiGetSessionActivitys = () => `${baseUrl}/audits`;

// Task
export const apiAssignUsersToTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/assignments`;

export const apiAssignUsersToJob = () => `${baseUrl}/tasks/assignments`;
export const apiGetAssignedUsersForJob = (jobId: Job['id']) =>
  `${baseUrl}/tasks/assignments?jobId=${jobId}`;
