import { AddNewParameterType } from '#PrototypeComposer/Activity/types';
import { Checklist, Parameter, Stage } from '#PrototypeComposer/checklist.types';
import { AddNewTaskType, MediaDetails } from '#PrototypeComposer/Tasks/types';
import { User } from '#store/users/types';
import { Task } from '#types';
import { TaskExecution } from '#types';
import { Job } from '#views/Jobs/ListView/types';
import { Object } from '#views/Ontology/types';
import { fetchBaseUrl } from './constants';

export const baseUrl = fetchBaseUrl();

export const apiGetChecklists = () => `${baseUrl}/checklists`;

export const apiGetChecklist = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}`;

// Inbox
export const apiGetInbox = () => `${baseUrl}/jobs/assignee/me`;

// Job
export const apiGetJobs = () => `${baseUrl}/jobs`;

export const apiStartJob = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/start`;

export const apiGetStageData = (jobId: Job['id'], stageId: Stage['id']) =>
  `${baseUrl}/jobs/${jobId}/stages/state?stageId=${stageId}`;

export const apiPerformActionOnTask = (taskExecutionId: TaskExecution['id'], action: string) =>
  `${baseUrl}/task-executions/${taskExecutionId}/${action}`;

export const apiRepeatTask = () => `${baseUrl}/task-executions/repeat`;

export const apiRemoveRepeatTask = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/remove`;

export const apiCompleteJob = (withException: boolean, jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/${withException ? 'complete-with-exception' : 'complete'}`;

export const apiGetProperties = () => `${baseUrl}/properties`;

export const apiGetFacilities = () => `${baseUrl}/facilities`;

export const apiGetUsers = (type = '') => `${baseUrl}/users${type ? `/${type}` : ''}`;

export const apiGetUser = (id: User['id']) => `${baseUrl}/users/${id}`;

export const apiUpdatePassword = (id: User['id']) => `${baseUrl}/users/${id}/password`;

export const apiGetSelectedJob = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}`;

export const apiExecuteParameter = (parameterExecutionId: string) =>
  `${baseUrl}/parameter-executions/${parameterExecutionId}/execute`;

export const apiFixParameter = (parameterExecutionId: string) =>
  `${baseUrl}/parameter-executions/${parameterExecutionId}/error-correction`;

export const apiEnableTaskErrorCorrection = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/correction/start`;

export const apiCompleteTaskErrorCorrection = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/correction/complete`;

export const apiCancelTaskErrorCorrection = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/correction/cancel`;

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

export const apiCreateNewPrototype = () => `${baseUrl}/checklists`;

export const apiCreateRevisionPrototype = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/revision`;

export const apiRecallProcess = (checklistId: Checklist['id']) => {
  return `${baseUrl}/checklists/${checklistId}/recall`;
};

export const apiCreateStage = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/stages`;

export const apiDeleteStage = (stageId: Stage['id']) => `${baseUrl}/stages/${stageId}/archive`;

export const apiUpdateStage = (stageId: Stage['id']) => `${baseUrl}/stages/${stageId}`;

export const apiCreateTask = ({ checklistId, stageId }: AddNewTaskType) =>
  `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks`;

export const apiDeleteTask = (taskId: string) => `${baseUrl}/tasks/${taskId}/archive`;

export const apiAddNewParameter = ({
  checklistId,
  stageId,
  taskId,
}: Pick<AddNewParameterType, 'checklistId' | 'stageId' | 'taskId'>) => {
  if (!stageId && !taskId) {
    return `${baseUrl}/checklists/${checklistId}/parameters`;
  } else {
    return `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks/${taskId}/parameters`;
  }
};

export const apiDeleteParameter = (parameterId: Parameter['id']) =>
  `${baseUrl}/parameters/${parameterId}/archive`;

export const apiUnmapParameter = (parameterId: Parameter['id']) =>
  `${baseUrl}/parameters/${parameterId}/unmap`;

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

export const apiSingleParameter = (parameterId: Parameter['id']) =>
  `${baseUrl}/parameters/${parameterId}`;

export const apiAddStop = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/stop/add`;

export const apiRemoveStop = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/stop/remove`;

export const apiUpdateTask = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}`;

export const apiSetTaskTimer = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/timer/set`;

export const apiRemoveTaskTimer = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/timer/unset`;

export const apiAddMediaToTask = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/medias`;

export const apiUpdateTaskAction = (taskId: Task['id'], actionId: string) =>
  `${baseUrl}/tasks/${taskId}/automations/${actionId}`;

export const apiReOrderParameters = (
  checklistId: Checklist['id'],
  taskId: Task['id'],
  stageId: Stage['id'],
) => `${baseUrl}/checklists/${checklistId}/stages/${stageId}/tasks/${taskId}/parameters/reorder`;

export const apiUpdateTaskMedia = (mediaId: MediaDetails['mediaId']) =>
  `${baseUrl}/medias/${mediaId}`;

export const apiGetParameters = (checklistId: Checklist['id'], type?: string) =>
  `${baseUrl}/checklists/${checklistId}/parameters${type ? `?types=${type}` : ''}`;

export const apiBatchMapParameters = (checklistId: Checklist['id']) =>
  `${baseUrl}/checklists/${checklistId}/parameters/map`;

export const apiMapParameterToTask = (checklistId: Checklist['id'], taskId: Task['id']) =>
  `${baseUrl}/checklists/${checklistId}/tasks/${taskId}/parameters/map`;

export const apiValidatePrototype = (id: Checklist['id']) => `${baseUrl}/checklists/${id}/validate`;

export const apiUpdatePrototype = (id: Checklist['id']) => `${baseUrl}/checklists/${id}`;

export const apiGetJobLogs = () => `${baseUrl}/job-logs`;

export const apiValidatePassword = () => `${baseUrl}/auth/credentials/validate`;

export const apiTaskSignOff = () => `${baseUrl}/tasks/sign-off`;

export const apiApproveParameter = (parameterResponseId: string) =>
  `${baseUrl}/parameter-executions/${parameterResponseId}/approve`;

export const apiRejectParameter = (parameterResponseId: string) =>
  `${baseUrl}/parameter-executions/${parameterResponseId}/reject`;

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

export const apiResetByEmail = () => `${baseUrl}/auth/token/reset`;

export const apiSwitchFacility = (userId: string, facilityId: string) =>
  `${baseUrl}/users/${userId}/facilities/${facilityId}/switch`;
export const apiGetAllUsersAssignedToJob = (jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/assignments`;

export const apiGetAllUsersAssignedToTask = () => `${baseUrl}/task-executions/assignments`;

export const apiGetAllUsersAssignedToChecklistTask = (id: string) =>
  `${baseUrl}/checklists/${id}/users/task/assignment`;

export const apiAssignUsersForChecklist = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}/users/assignment`;

export const apiGetAllTrainedUsersAssignedToChecklist = (checklistId: string) =>
  `${baseUrl}/checklists/${checklistId}/users/trained`;

export const apiBulkAssignUsers = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/assignments`;

export const apiGetJobSummary = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/reports`;

export const apiGetJobSummaryReportDetails = (jobId: Job['id']) =>
  `${baseUrl}/jobs/${jobId}/reports/print`;

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

export const apiGetReports = () => `${baseUrl}/reports`;

export const apiGetReport = (id?: string) => `${baseUrl}/reports/${id}`;

export const apiProcessCustomViews = (id: Checklist['id']) =>
  `${baseUrl}/custom-views/checklists/${id}`;

export const apiCustomViews = (id?: string) => `${baseUrl}/custom-views${id ? `/${id}` : ''}`;

export const apiCustomViewsArchive = (id?: string) => `${baseUrl}/custom-views/${id}/archive`;

export const apiGetJobLogsExcel = () => `${baseUrl}/job-logs/download`;

export const apiBranchingRuleExecute = () => `${baseUrl}/parameter-executions/execute/temporary`;

export const apiJobsCount = () => `${baseUrl}/jobs/count`;

export const apiInboxJobsCount = () => `${baseUrl}/jobs/assignee/me/count`;

export const apiJobInfo = (jobId: string) => `${baseUrl}/jobs/${jobId}/info`;

export const apiInitializeSubTask = (taskId: string) =>
  `${baseUrl}/tasks/${taskId}/sub-task/initialize`;

export const apiCreateObjectType = () => `${baseUrl}/object-types`;

export const apigetObjectTypeProperties = (objectTypeId: string) => {
  return `${baseUrl}/object-types/${objectTypeId}/properties`;
};

export const apiGetObjectTypeRelations = (objectTypeId: string) => {
  return `${baseUrl}/object-types/${objectTypeId}/relations`;
};

export const apiCreateObjectTypeProperty = (objectTypeId: string) =>
  `${baseUrl}/object-types/${objectTypeId}/properties`;

export const apiArchiveObjectTypeProperty = (objectTypeId: string, propertyId: string) =>
  `${baseUrl}/object-types/${objectTypeId}/properties/${propertyId}/archive`;

export const apiHiddenParams = () => `${baseUrl}/parameters/visibility`;

export const apiCreateObjectTypeRelation = (objectTypeId: string) =>
  `${baseUrl}/object-types/${objectTypeId}/relations`;

export const apiArchiveObjectTypeRelation = (objectTypeId: string, relationId: string) =>
  `${baseUrl}/object-types/${objectTypeId}/relations/${relationId}/archive`;

export const apiAddTaskAction = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/automations`;

export const apiGetProcessesByResource = (objectTypeId: string) =>
  `${baseUrl}/checklists/by/resource/${objectTypeId}`;

export const apiGetJobsByResource = (objectId: string) => `${baseUrl}/jobs/by/resource/${objectId}`;

export const apiPauseJob = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/pause`;

export const apiResumeJob = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/resume`;

export const apiProcessScheduler = () => `${baseUrl}/schedulers`;

export const apiArchiveProcessScheduler = (schedulerId: string) =>
  `${baseUrl}/schedulers/${schedulerId}/archive`;

export const apiVersionHistoryProcessScheduler = (schedulerId: string) =>
  `${baseUrl}/schedulers/${schedulerId}/info`;

export const apiSingleProcessScheduler = (schedulerId: string) =>
  `${baseUrl}/schedulers/${schedulerId}`;

export const apiValidateTask = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/validate`;

export const apiEditObjectType = (objectTypeId: string) =>
  `${baseUrl}/object-types/${objectTypeId}`;

export const apiEditObjectTypeProperty = (objectTypeId: string, propertyId: string) =>
  `${baseUrl}/object-types/${objectTypeId}/properties/${propertyId}`;

export const apiEditObjectTypeRelation = (objectTypeId: string, relationId: string) =>
  `${baseUrl}/object-types/${objectTypeId}/relations/${relationId}`;

export const apiQrShortCode = () => `${baseUrl}/short-code`;

export const apiGetObjectAuditChangeLog = () => `${baseUrl}/objects/change-logs`;

export const apiExportChecklist = () => `${baseUrl}/checklists/export`;

export const apiImportChecklist = () => `${baseUrl}/checklists/import`;

export const apiInitiateSelfVerification = ({
  parameterResponseId,
}: {
  parameterResponseId: string;
}) => `${baseUrl}/parameter-verifications/parameter-executions/${parameterResponseId}/self/verify`;

export const apiInitiatePeerVerification = ({
  parameterResponseId,
}: {
  parameterResponseId: string;
}) => `${baseUrl}/parameter-verifications/parameter-executions/${parameterResponseId}/peer/assign`;

export const apiAcceptVerification = ({
  parameterResponseId,
  type,
}: {
  parameterResponseId: string;
  type: 'self' | 'peer';
}) =>
  `${baseUrl}/parameter-verifications/parameter-executions/${parameterResponseId}/${type}/accept`;

export const apiRecallVerification = ({
  parameterResponseId,
  type,
}: {
  parameterResponseId: string;
  type: 'self' | 'peer';
}) =>
  `${baseUrl}/parameter-verifications/parameter-executions/${parameterResponseId}/${type}/recall`;

export const apiRejectPeerVerification = ({
  parameterResponseId,
}: {
  parameterResponseId: string;
}) => `${baseUrl}/parameter-verifications/parameter-executions/${parameterResponseId}/peer/reject`;

export const apiParameterVerificationList = () => `${baseUrl}/parameter-verifications`;

export const apiVerificationAssignees = (jobId: string) =>
  `${baseUrl}/parameter-verifications/jobs/${jobId}/assignees`;

export const apiGetShouldBeApprovals = () => `${baseUrl}/jobs/should-be-parameters`;

export const apiSsoRedirect = () => `${baseUrl}/auth/sso/redirect-url`;

export const apiPrintJobActivity = (jobId: Job['id']) => `${baseUrl}/jobs/${jobId}/activity/print`;

export const apiCreateEditParameterVariation = () => `${baseUrl}/parameter-executions/variations`;

export const apiGetParameterVariations = (jobId: Job['id']) =>
  `${baseUrl}/parameter-executions/variations/${jobId}/allowed`;

export const apiGetVariationsList = (jobId: Job['id']) =>
  `${baseUrl}/parameter-executions/variations/${jobId}`;

export const apiArchiveParameterVariation = () => `${baseUrl}/parameter-executions/variations`;

export const apiGetVariationsListByParameterId = (parameterResponseId: string) =>
  `${baseUrl}/parameter-executions/variations/parameter/${parameterResponseId}`;

export const apiSetTaskRecurrence = (taskId: string) => `${baseUrl}/tasks/${taskId}/recurrence/set`;

export const apiRemoveTaskRecurrence = (taskId: string) =>
  `${baseUrl}/tasks/${taskId}/recurrence/unset`;

export const apiEndTaskRecurrence = (taskExecutionId: TaskExecution['id']) =>
  `${baseUrl}/task-executions/${taskExecutionId}/stop-recurring`;

export const apiGetTaskRecurrence = (taskId: string) => `${baseUrl}/tasks/${taskId}/recurrence`;

export const apiTaskSchedule = (taskId: string) => `${baseUrl}/tasks/${taskId}/schedules`;

export const apiRemoveTaskSchedule = (taskId: string) =>
  `${baseUrl}/tasks/${taskId}/schedules/unset`;

export const apiGetJobAnnotation = (jobId: Job['id']) => `${baseUrl}/jobs/annotations/${jobId}`;

export const apiPostPatchJobAnnotation = (jobId?: Job['id']) =>
  `${baseUrl}/jobs/annotations${jobId ? `/${jobId}` : ``}`;

export const apiTaskInterLocks = (taskId: Task['id']) => `${baseUrl}/tasks/${taskId}/interlocks`;

export const apiTaskInterLocksArchive = (taskId: Task['id'], interlockId: string) =>
  `${baseUrl}/tasks/${taskId}/interlocks/${interlockId}`;
