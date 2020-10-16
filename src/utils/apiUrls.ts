import { Checklist, Stage, Activity } from '#Composer-new/checklist.types';
import { AddNewTaskArgs } from '#Composer-new/Tasks/types';
import { Task } from '#Composer/checklist.types';

import { Job } from '../views/Jobs/types';
import { fetchBaseUrl } from './constants';
import { AddNewActivityArgs } from '../Composer-new/Activity/types';

const baseUrl = fetchBaseUrl();

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

export const apiGetProperties = () => `${baseUrl}/properties`;

export const apiGetFacilities = () => `${baseUrl}/facilities`;

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

export const apiUploadFile = () => `${baseUrl}/files/`;

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

export const apiCreateNewPrototype = () => `${baseUrl}/checklists`;

export const apiCreateStage = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/stages`;

export const apiDeleteStage = (stageId: Stage['id']) =>
  `${baseUrl}/stages/${stageId}/archive`;

export const apiUpdateStage = (stageId: Stage['id']) =>
  `${baseUrl}/stages/${stageId}`;

export const apiCreateTask = ({ checklistId, stageId }: AddNewTaskArgs) =>
  `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks`;

export const apiDeleteTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/archive`;

export const apiAddNewActivity = ({
  checklistId,
  stageId,
  taskId,
}: Omit<AddNewActivityArgs, 'activityType' | 'orderTree'>) =>
  `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks/${taskId}/activities`;

export const apiDeleteActivity = (activityId: Activity['id']) =>
  `${baseUrl}/activities/${activityId}/archive`;

// REVIEWER
export const apiGetReviewersForChecklist = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/reviewers`;

export const apiAssignReviewersToChecklist = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/reviewers/assignments`;

export const apiStartChecklistReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/start`;

export const apiSubmitChecklistReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/complete`;

export const apiSubmitChecklistReviewWithCR = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/complete-with-cr`;

export const apiSubmitChecklistForReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/submit`;

export const apiContinueChecklistReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/continue`;

export const apiUpdateActivity = (activityId: Activity['id']) =>
  `${baseUrl}/activities/${activityId}`;

export const apiAddStop = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/stop/add`;

export const apiRemoveStop = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/stop/remove`;

export const apiUpdateTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}`;

export const apiSetTaskTimer = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/timer/set`;

export const apiRemoveTaskTimer = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/timer/unset`;

export const apiAddMediaToTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/medias`;

export const apiValidatePrototype = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/validate`;

export const apiUpdatePrototype = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}`;
