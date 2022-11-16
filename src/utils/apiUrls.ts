import { Task } from '#JobComposer/checklist.types';
import { AddNewActivityType } from '#PrototypeComposer/Activity/types';
import { Activity, Checklist, Stage } from '#PrototypeComposer/checklist.types';
import { AddNewTaskType, MediaDetails } from '#PrototypeComposer/Tasks/types';
import { User } from '#store/users/types';
import { Job } from '#views/Jobs/ListView/types';
import { Object } from '#views/Ontology/types';

import { fetchBaseUrl } from './constants';

export const baseUrl = fetchBaseUrl();

export const apiGetActivitiesForCalc = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/activities-for-calculation`;

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
  `${baseUrl}/jobs/${jobId}/${withException ? 'complete-with-exception' : 'complete'}`;

export const apiGetProperties = () => `${baseUrl}/properties`;

export const apiGetFacilities = () => `${baseUrl}/facilities`;

export const apiGetUsers = (type = '') => `${baseUrl}/users${type ? `/${type}` : ''}`;

export const apiGetUser = (id: User['id']) => `${baseUrl}/users/${id}`;

export const apiUpdatePassword = (id: User['id']) => `${baseUrl}/users/${id}/password`;

export const apiGetSelectedJob = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}`;

export const apiExecuteActivity = () => `${baseUrl}/activities/execute`;

export const apiFixActivity = () => `${baseUrl}/activities/error-correction`;

export const apiCompleteTask = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}`;

export const apiEnableTaskErrorCorrection = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/correction/start`;

export const apiCompleteTaskErrorCorrection = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/correction/complete`;

export const apiCancelTaskErrorCorrection = (taskId: Task['id']) =>
  `${baseUrl}/tasks/${taskId}/correction/cancel`;

export const apiUploadFile = () => `${baseUrl}/medias/upload`;

export const apiCheckUsername = () => `${baseUrl}/users/username/check`;

export const apiCheckEmail = () => `${baseUrl}/users/email/check`;

export const apiCheckEmployeeId = () => `${baseUrl}/users/employee-id/check`;

export const apiCheckTokenExpiry = () => `${baseUrl}/auth/token/validate`;

export const apiLogin = () => `${baseUrl}/auth/login`;

export const apiReLogin = () => `${baseUrl}/auth/re-login`;

export const apiLogOut = () => `${baseUrl}/auth/logout`;

export const apiRefreshToken = () => `${baseUrl}/auth/token/refresh`;

export const apiResendInvite = (id: User['id']) => `${baseUrl}/users/${id}/token/reset`;

export const apiCancelInvite = (id: User['id']) => `${baseUrl}/users/${id}/token/cancel`;

export const apiArchiveUser = (id: User['id']) => `${baseUrl}/users/${id}/archive`;

export const apiUnArchiveUser = (id: User['id']) => `${baseUrl}/users/${id}/unarchive`;

export const apiUnLockUser = (id: User['id']) => `${baseUrl}/users/${id}/unlock`;

export const apiRegister = () => `${baseUrl}/auth/register`;

export const apiResetPassword = () => `${baseUrl}/auth/password`;

export const apiGetSessionActivities = () => `${baseUrl}/users/audits`;

export const apiGetJobAuditLogs = (jobId: Job['id']) => `${baseUrl}/audits/jobs/${jobId}`;

export const apiGetChecklistAuditLogs = (jobId: Job['id']) =>
  `${baseUrl}/audits/checklists/${jobId}`;

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

export const apiDeleteStage = (stageId: Stage['id']) => `${baseUrl}/stages/${stageId}/archive`;

export const apiUpdateStage = (stageId: Stage['id']) => `${baseUrl}/stages/${stageId}`;

export const apiCreateTask = ({ checklistId, stageId }: AddNewTaskType) =>
  `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks`;

export const apiDeleteTask = (taskId: string) => `${baseUrl}/tasks/${taskId}/archive`;

export const apiAddNewActivity = ({
  checklistId,
  stageId,
  taskId,
}: Pick<AddNewActivityType, 'checklistId' | 'stageId' | 'taskId'>) => {
  if (!stageId && !taskId) {
    return `${baseUrl}/checklists/${checklistId}/activities`;
  } else {
    return `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks/${taskId}/activities`;
  }
};

export const apiDeleteActivity = (activityId: Activity['id']) =>
  `${baseUrl}/activities/${activityId}/archive`;

// Reviewer
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

export const apiSignOffOrder = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/sign-off/order`;

export const apiPrototypeSignOff = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/review/sign-off`;

export const apiPrototypeRelease = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/publish`;

export const apiSingleActivity = (activityId: Activity['id']) =>
  `${baseUrl}/activities/${activityId}`;

export const apiAddStop = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/stop/add`;

export const apiRemoveStop = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/stop/remove`;

export const apiUpdateTask = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}`;

export const apiSetTaskTimer = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/timer/set`;

export const apiRemoveTaskTimer = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/timer/unset`;

export const apiAddMediaToTask = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/medias`;

export const apiAddTaskAction = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/automations`;

export const apiUpdateTaskAction = (taskId: Task['id'], actionId: string) =>
  `${baseUrl}/tasks/${taskId}/automations/${actionId}`;

export const apiReOrderActivities = (
  checklistId: Checklist['id'],
  taskId: Task['id'],
  stageId: Stage['id'],
) => `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks/${taskId}/activities/reorder`;

export const apiUpdateTaskMedia = (taskId: Task['id'], mediaId: MediaDetails['mediaId']) =>
  `${baseUrl}/medias/${mediaId}`;

export const apiGetActivities = (checklistId: Checklist['id'], type?: string) =>
  `${baseUrl}/checklists/${checklistId}/activities${type ? `?type=${type}` : ''}`;

export const apiBatchMapParameters = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/activities/map`;

export const apiMapParameterToTask = (checklistId: Checklist['id'], taskId: Task['id']) =>
  `${baseUrl}/checklists/${checklistId}/tasks/${taskId}/activities/map`;

export const apiValidatePrototype = (id: Checklist['id']) => `${baseUrl}/checklists/${id}/validate`;

export const apiUpdatePrototype = (id: Checklist['id']) => `${baseUrl}/checklists/${id}`;

export const apiGetJobLogs = () => `${baseUrl}/job-logs`;

export const apiGetProcessLogs = (id: Checklist['id']) => `${apiGetJobLogs()}/checklists/${id}`;

export const apiValidatePassword = () => `${baseUrl}/auth/credentials/validate`;

export const apiTaskSignOff = () => `${baseUrl}/tasks/sign-off`;

export const apiApproveActivity = () => `${baseUrl}/activities/approve`;

export const apiRejectActivity = () => `${baseUrl}/activities/reject`;

export const apiArchiveChecklist = (id: Checklist['id']) => `${baseUrl}/checklists/${id}/archive`;

export const apiArchiveValidate = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/archive/validate`;

export const apiUnarchiveChecklist = (id: Checklist['id']) =>
  `${baseUrl}/checklists/${id}/unarchive`;

export const apiGetChecklistInfo = (id: Checklist['id']) => `${baseUrl}/checklists/${id}/info`;

export const apiGetJobCweDetails = (id: Job['id']) => `${baseUrl}/jobs/${id}/cwe-details`;

export const apiRemoveTaskMedia = ({ taskId, mediaId }: { taskId: string; mediaId: string }) =>
  `${baseUrl}/tasks/${taskId}/medias/${mediaId}`;

export const apiReorderStages = () => `${baseUrl}/stages/reorder`;

export const apiReorderTasks = () => `${baseUrl}/tasks/reorder`;

export const apiGetAllChallengeQuestions = () => `${baseUrl}/challenge-questions`;

export const apiChallengeQuestions = (id: string) => `${baseUrl}/users/${id}/challenge-questions`;

export const apiAdditionalVerification = () => `${baseUrl}/auth/additional/verification`;

export const apiValidateIdentity = () => `${baseUrl}/auth/identity/validate`;

export const apiValidateChallengeQuestion = () => `${baseUrl}/auth/challenge-questions/validate`;

export const apiNotifyAdmin = () => `${baseUrl}/auth/admin/notify`;

export const apiResetToken = () => `${baseUrl}/auth/token/reset`;

export const apiSwitchFacility = (userId: string, facilityId: string) =>
  `${baseUrl}/users/${userId}/facilities/${facilityId}/switch`;
export const apiGetAllUsersAssignedToJob = (jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/assignments`;

export const apiGetAllUsersAssignedToTask = () => `${baseUrl}/tasks/assignments`;

export const apiGetAllUsersAssignedToChecklistTask = (id: string) =>
  `${baseUrl}/checklists/${id}/users/task/assignment`;

export const apiAssignUsersForChecklist = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}/users/assignment`;

export const apiGetAllUsersAssignedToChecklist = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}/users/allowed`;

export const apiBulkAssignUsers = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/assignments`;

export const apiGetJobSummary = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/reports`;

export const apiGetJobSummaryReportDetails = (jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/reports/print`;

export const apiGetTask = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}`;

export const apiGetUseCaseList = () => `${baseUrl}/use-cases`;

export const apiPrintJobDetails = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/print`;

// ONTOLOGY

export const apiGetObjectTypes = (id?: string) => `${baseUrl}/object-types${id ? `/${id}` : ''}`;

export const apiGetObjects = (id?: string) => `${baseUrl}/objects${id ? `/${id}` : ''}`;

export const apiArchiveObject = (id: Object['id']) => `${baseUrl}/objects/${id}/archive`;

export const apiUnArchiveObject = (id: Object['id']) => `${baseUrl}/objects/${id}/unarchive`;

export const apiAccountLookUp = () => `${baseUrl}/auth/account/lookup`;

export const apiAuthExtras = () => `${baseUrl}/auth/extras`;

export const searchDirectoryUsers = () => `${baseUrl}/users/directory/users`;

export const apiGetAutomations = () => `${baseUrl}/automation/planner`;

export const apiProcessSharing = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/facility/share`;
