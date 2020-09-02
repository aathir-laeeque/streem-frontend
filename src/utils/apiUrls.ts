import { Task } from '../views/Checklists/ChecklistComposer/TaskList/TaskView/types';
import { Job } from '../views/Jobs/types';
import { fetchBaseUrl } from './constants';

const baseUrl = fetchBaseUrl();
//Checklist
export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: number) =>
  `${baseUrl}/checklists/${checklistId}`;

// Job
export const apiGetJobs = () => `${baseUrl}/jobs`;

export const apiAssignUser = (jobId: string, userId: string | number) =>
  `${baseUrl}/jobs/${jobId}/users/${userId}`;

export const apiUnAssignUser = (jobId: string, userId: string | number) =>
  `${baseUrl}/jobs/${jobId}/users/${userId}`;

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

export const apiCompleteTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}`;

// Signature / File
export const apiUploadFile = () => `${baseUrl}/files/`;

// Auth
export const apiLogin = () => `${baseUrl}/auth/login`;

export const apiLogOut = () => `${baseUrl}/auth/logout`;

export const apiForgotPassword = () => `${baseUrl}/auth/reset-password`;

export const apiRefreshToken = () => `${baseUrl}/auth/refresh-token`;

export const apiResendInvite = (id: number | string) =>
  `${baseUrl}/users/${id}/resend-invite`;

export const apiArchiveUser = (id: number | string) =>
  `${baseUrl}/users/${id}/archive`;

export const apiUnArchiveUser = (id: number | string) =>
  `${baseUrl}/users/${id}/restore`;

export const apiRegister = () => `${baseUrl}/auth/register`;

export const apiResetPassword = () => `${baseUrl}/auth/update-password`;
