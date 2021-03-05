import { Task } from '#JobComposer/checklist.types';
import { AddNewActivityType } from '#PrototypeComposer/Activity/types';
import { Activity, Checklist, Stage } from '#PrototypeComposer/checklist.types';
import { AddNewTaskType, MediaDetails } from '#PrototypeComposer/Tasks/types';
import { User } from '#store/users/types';
import { Job } from '#views/Jobs/NewListView/types';

import { fetchBaseUrl } from './constants';

const baseUrl = fetchBaseUrl();

export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: Checklist['id']) =>
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

export const apiGetStageData = (jobId: Job['id'], stageId: Stage['id']) =>
  `${baseUrl}/jobs/${jobId}/stages/state?stageId=${stageId}`;

export const apiPerformActionOnTask = (taskId: Task['id'], action: string) =>
  `${baseUrl}/tasks/${taskId}/${action}`;

export const apiCompleteJob = (withException: boolean, jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/${
    withException ? 'complete-with-exception' : 'complete'
  }`;

export const apiGetProperties = () => `${baseUrl}/properties`;

export const apiGetFacilities = () => `${baseUrl}/facilities`;

export const apiGetUsers = (type = '') =>
  `${baseUrl}/users${type ? `/${type}` : ''}`;

export const apiGetUser = (id: User['id']) => `${baseUrl}/users/${id}`;

export const apiUpdateUserBasic = (id: User['id']) =>
  `${baseUrl}/users/${id}/basic`;

export const apiUpdatePassword = (id: User['id']) =>
  `${baseUrl}/users/${id}/password`;

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
  `${baseUrl}/users/username/check?username=${username}`;

export const apiCheckEmail = (email: string) =>
  `${baseUrl}/users/email/check?email=${email}`;

export const apiCheckEmployeeId = (employeeId: string) =>
  `${baseUrl}/users/employee-id/check?employeeId=${employeeId}`;

export const apiCheckTokenExpiry = () => `${baseUrl}/auth/token/validate`;

export const apiLogin = () => `${baseUrl}/auth/login`;

export const apiLogOut = () => `${baseUrl}/auth/logout`;

export const apiForgotPassword = () => `${baseUrl}/auth/password/reset`;

export const apiRefreshToken = () => `${baseUrl}/auth/token/refresh`;

export const apiResendInvite = (id: User['id']) =>
  `${baseUrl}/users/${id}/invite/resend`;

export const apiCancelInvite = (id: User['id']) =>
  `${baseUrl}/users/${id}/invite/cancel`;

export const apiArchiveUser = (id: User['id']) =>
  `${baseUrl}/users/${id}/archive`;

export const apiUnArchiveUser = (id: User['id']) =>
  `${baseUrl}/users/${id}/unarchive`;

export const apiUnLockUser = (id: User['id']) =>
  `${baseUrl}/users/${id}/unblock`;

export const apiRegister = () => `${baseUrl}/auth/register`;

export const apiResetPassword = () => `${baseUrl}/auth/password`;

export const apiGetSessionActivities = () => `${baseUrl}/users/audits`;

export const apiGetJobActivity = (jobId: Job['id']) =>
  `${baseUrl}/audits/jobs/${jobId}`;

// Task
export const apiAssignUsersToTask = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/assignments`;

export const apiAssignUsersToJob = () => `${baseUrl}/tasks/assignments`;

export const apiGetAssignedUsersForJob = (jobId: Job['id']) =>
  `${baseUrl}/tasks/assignments?jobId=${jobId}`;

export const apiCreateNewPrototype = () => `${baseUrl}/checklists`;

export const apiCreateRevisionPrototype = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/revision`;

export const apiCreateStage = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/stages`;

export const apiDeleteStage = (stageId: Stage['id']) =>
  `${baseUrl}/stages/${stageId}/archive`;

export const apiUpdateStage = (stageId: Stage['id']) =>
  `${baseUrl}/stages/${stageId}`;

export const apiCreateTask = ({ checklistId, stageId }: AddNewTaskType) =>
  `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks`;

export const apiDeleteTask = (taskId: string) =>
  `${baseUrl}/tasks/${taskId}/archive`;

export const apiAddNewActivity = ({
  checklistId,
  stageId,
  taskId,
}: Omit<AddNewActivityType, 'activityType' | 'orderTree'>) =>
  `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks/${taskId}/activities`;

export const apiDeleteActivity = (activityId: Activity['id']) =>
  `${baseUrl}/activities/${activityId}/archive`;

// REVIEWER
export const apiGetReviewersForChecklist = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/reviewers`;

export const apiGetApproversForChecklist = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/sign-off-users`;

export const apiAssignReviewersToChecklist = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/reviewers/assignments`;

export const apiStartChecklistReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/start`;

export const apiSubmitChecklistReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/ok`;

export const apiSubmitChecklistReviewWithCR = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/changes`;

export const apiSubmitChecklistForReview = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/submit`;

export const apiSendReviewToCr = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/submit-back`;

export const apiInitiateSignOff = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/sign-off/initiate`;

export const apiSignOffOrder = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/sign-off/order`;

export const apiPrototypeSignOff = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/sign-off`;

export const apiPrototypeRelease = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/publish`;

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

export const apiUpdateTaskMedia = (
  taskId: Task['id'],
  mediaId: MediaDetails['id'],
) => `${baseUrl}/tasks/${taskId}/medias/${mediaId}`;

export const apiValidatePrototype = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/validate`;

export const apiUpdatePrototype = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}`;

export const apiValidatePassword = () => `${baseUrl}/auth/credentials/validate`;

export const apiTaskSignOff = () => `${baseUrl}/tasks/sign-off`;

export const apiApproveActivity = () => `${baseUrl}/activities/approve`;

export const apiRejectActivity = () => `${baseUrl}/activities/reject`;

export const apiArchiveChecklist = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/archive`;

export const apiArchiveValidate = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/archive/validate`;

export const apiUnarchiveChecklist = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/unarchive`;

export const apiGetChecklistInfo = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/info`;

export const apiGetJobCweDetails = (id: Job['id']) =>
  `${baseUrl}/jobs/${id}/cwe-details`;

export const apiRemoveTaskMedia = ({
  taskId,
  mediaId,
}: {
  taskId: string;
  mediaId: string;
}) => `${baseUrl}/tasks/${taskId}/medias/${mediaId}`;

export const apiReorderStages = () => `${baseUrl}/stages/reorder`;

export const apiReorderTasks = () => `${baseUrl}/tasks/reorder`;
