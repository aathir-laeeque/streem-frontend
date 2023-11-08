import { generateActions } from '#store/helpers';
import { Users } from '#store/users/types';
import {
  COMPLETED_TASK_STATES,
  ExceptionValues,
  JobStates,
  JobStore,
  Parameter,
  StoreParameter,
  SupervisorResponse,
  TaskAction,
  TaskExecution,
} from '#types';
import { DEFAULT_PAGINATION } from '#utils/constants';
import { Pageable } from '#utils/globalTypes';
import { Verification } from '#views/Jobs/ListView/types';
import { produce } from 'immer';

// ACTIONS

const actions = {
  getJob: { id: '' },
  getJobSuccess: {
    data: {} as Omit<JobStore, 'loading' | 'isInboxView' | 'assignments'>,
    jobFromBE: {} as any,
  },
  getAssignments: { id: '' },
  getAssignmentsSuccess: { assignees: {} as Users, userId: '' },
  navigateByTaskId: { id: '' },
  setUpdating: { updating: false },
  startJob: { id: '' },
  completeJob: {} as {
    jobId: string;
    withException?: boolean;
    values?: ExceptionValues;
    details?: {
      code: string;
      name?: string;
    };
  },
  startJobSuccess: undefined,
  updateTaskExecution: { id: '', data: {} as TaskExecution },
  performTaskAction: {} as {
    id: string;
    reason?: string;
    action: TaskAction;
    createObjectAutomations?: any[];
  },
  togglePauseResume: {} as {
    id: string;
    reason?: string;
    comment?: string;
    isTaskPaused?: boolean;
  },
  updateTaskErrors: {
    id: '',
    taskErrors: [] as string[],
    parametersErrors: {} as Map<string, string[]>,
  },
  executeParameter: {} as { parameter: StoreParameter; reason?: string },
  fixParameter: {} as { parameter: StoreParameter; reason?: string },
  approveRejectParameter: {} as { parameterId: string; type: SupervisorResponse },
  updateParameter: {} as { data: Parameter },
  initiateSelfVerification: {} as { parameterId: string },
  completeSelfVerification: {} as {
    parameterId: string;
    password?: string;
    code?: string;
    state?: string;
  },
  updateParameterVerifications: {} as { parameterId: string; data: Verification },
  sendPeerVerification: {} as { parameterId: string; userId: string },
  recallPeerVerification: {} as { parameterId: string; type: 'self' | 'peer' },
  acceptPeerVerification: {} as {
    parameterId: string;
    password?: string;
    code?: string;
    state?: string;
  },
  rejectPeerVerification: {} as { parameterId: string; comment: string },
  reset: undefined,
  startPollActiveStageData: {} as { jobId: string; stageId: string; state: JobStates },
  stopPollActiveStageData: undefined,
  getActiveStageDataSuccess: { data: {} as any },
  setTimerState: {} as JobStore['timerState'],
  startTaskTimer: {} as { id: string },
  stopTaskTimer: undefined,
  toggleMobileDrawer: undefined,
  getJobAuditLogs: {} as { jobId: string; params: Record<string, any> },
  getJobAuditLogsSuccess: { data: [] as any, pageable: {} as Pageable },
};

export const initialState: JobStore = {
  loading: true,
  stages: new Map(),
  tasks: new Map(),
  parameters: new Map(),
  pendingTasks: new Set(),
  cjfValues: [],
  isInboxView: false,
  taskNavState: {
    isMobileDrawerOpen: false,
  },
  showVerificationBanner: false,
  assignments: {
    loading: true,
    isUserAssigned: false,
    assignees: [],
  },
  timerState: {
    earlyCompletion: false,
    limitCrossed: false,
    timeElapsed: -1,
  },
  auditLogs: {
    logs: [],
    loading: true,
    pageable: DEFAULT_PAGINATION,
  },
};

export const { actions: jobActions, actionsEnum: JobActionsEnum } = generateActions(
  actions,
  '@@leucine/jobs/entity/',
);

export type JobActionsType = ReturnType<typeof jobActions[keyof typeof jobActions]>;

// REDUCER FUNCTIONS

function getJobSuccess(draft: JobStore, payload: typeof actions.getJobSuccess) {
  const { data, jobFromBE } = payload;

  draft.loading = false;
  draft.jobFromBE = jobFromBE;
  draft.cjfValues = data.cjfValues;
  draft.stages = new Map(data.stages);
  draft.tasks = new Map(data.tasks);
  draft.parameters = new Map(data.parameters);
  draft.pendingTasks = new Set(data.pendingTasks);
  draft.taskNavState = data.taskNavState;
  draft.showVerificationBanner = data.showVerificationBanner;
  draft.state = data.state;
  draft.totalTasks = data.totalTasks;
  draft.expectedEndDate = data.expectedEndDate;
  draft.expectedStartDate = data.expectedStartDate;
  draft.completedTasks = data.completedTasks;
  draft.code = data.code;
  draft.processId = data.processId;
  draft.processName = data.processName;
  draft.processCode = data.processCode;
  draft.id = data.id;
  draft.isInboxView = location.pathname.split('/')[1] === 'inbox';
}

function getAssignmentsSuccess(draft: JobStore, payload: typeof actions.getAssignmentsSuccess) {
  draft.assignments.loading = false;
  draft.assignments.assignees = payload.assignees;
  draft.assignments.isUserAssigned = payload.assignees.some((user) => user.id === payload.userId);
}

function updateTaskExecution(draft: JobStore, payload: typeof actions.updateTaskExecution) {
  const task = draft.tasks.get(payload.id);
  draft.updating = false;

  if (task) {
    task.taskExecution = payload.data;
  }
  if (payload.data.state in COMPLETED_TASK_STATES) {
    draft.pendingTasks.delete(payload.id);
  }
}

function updateTaskErrors(draft: JobStore, payload: typeof actions.updateTaskErrors) {
  const task = draft.tasks.get(payload.id);
  if (task) {
    const { taskErrors, parametersErrors } = payload;
    task.errors = taskErrors;
    task.parametersErrors = new Map(parametersErrors);
  }
}

function navigateByTaskId(draft: JobStore, payload: typeof actions.navigateByTaskId) {
  const task = draft.tasks.get(payload.id);
  if (task) {
    draft.taskNavState = {
      current: task.id,
      isMobileDrawerOpen: false,
    };
  }
}

function updateParameter(draft: JobStore, payload: typeof actions.updateParameter) {
  const { data } = payload;
  let parameter = draft.parameters.get(data.id);
  if (parameter) {
    draft.parameters.set(data.id, { ...parameter, ...data });
    if (data?.hide?.length) {
      data.hide.forEach((id) => {
        const param = draft.parameters.get(id);
        if (param) {
          param.response!.hidden = true;
          param.isHidden = true;

          const task = draft.tasks.get(param.taskId);
          if (task) {
            task.visibleParametersCount--;

            if (task.visibleParametersCount === 0) {
              const stage = draft.stages.get(param.stageId);
              if (stage) {
                stage.visibleTasksCount--;
              }

              const previousTask = task.previous ? draft.tasks.get(task.previous) : undefined;
              if (previousTask) {
                previousTask.next = task.next;
                if (task.next) {
                  const nextTask = draft.tasks.get(task.next);
                  if (nextTask) {
                    nextTask.previous = task.previous;
                  }
                }
              }
            }
          }
        }
      });
    }

    if (data?.show?.length) {
      data.show.forEach((id) => {
        const param = draft.parameters.get(id);
        if (param) {
          param.response!.hidden = false;
          param.isHidden = false;

          const task = draft.tasks.get(param.taskId);
          if (task) {
            if (task.visibleParametersCount === 0) {
              const stage = draft.stages.get(param.stageId);
              if (stage) {
                stage.visibleTasksCount++;
              }
            }
            task.visibleParametersCount++;

            const previousTask = task.previous ? draft.tasks.get(task.previous) : undefined;
            if (previousTask) {
              task.next = previousTask.next;
              previousTask.next = task.id;
              if (task.next) {
                const nextTask = task.previous ? draft.tasks.get(task.next) : undefined;
                if (nextTask) {
                  nextTask.previous = task.id;
                }
              }
            }
          }
        }
      });
    }
  }
}

function updateParameterVerifications(
  draft: JobStore,
  payload: typeof actions.updateParameterVerifications,
) {
  const { data, parameterId } = payload;
  let parameter = draft.parameters.get(parameterId);
  if (parameter && parameter.response) {
    if (parameter.response.parameterVerifications?.length) {
      parameter.response.parameterVerifications = parameter.response.parameterVerifications.map(
        (verification) => {
          if (verification.verificationType === data.verificationType) {
            return data;
          }
          return verification;
        },
      );
    } else {
      parameter.response.parameterVerifications = [data];
    }

    if (data.evaluationState) {
      parameter.response.state = data.evaluationState;
    }
  }
}

function getJobAuditLogsSuccess(draft: JobStore, payload: typeof actions.getJobAuditLogsSuccess) {
  draft.auditLogs.loading = false;
  draft.auditLogs.pageable = payload.pageable;
  draft.auditLogs.logs = payload.data;
}

// REDUCER

export const jobReducer = (state = initialState, action: JobActionsType) =>
  produce(state, (draft) => {
    switch (action.type) {
      case JobActionsEnum.getJob:
        draft.loading = true;
        break;
      case JobActionsEnum.getAssignments:
        draft.assignments.loading = true;
        break;
      case JobActionsEnum.executeParameter:
      case JobActionsEnum.startJob:
      case JobActionsEnum.completeJob:
      case JobActionsEnum.togglePauseResume:
      case JobActionsEnum.performTaskAction:
        // case JobActionsEnum.startPollActiveStageData:
        draft.updating = true;
        break;
      case JobActionsEnum.setUpdating:
        draft.updating = action.payload.updating;
        break;
      case JobActionsEnum.getJobSuccess:
        getJobSuccess(draft, action.payload);
        break;
      case JobActionsEnum.getAssignmentsSuccess:
        getAssignmentsSuccess(draft, action.payload);
        break;
      case JobActionsEnum.navigateByTaskId:
        navigateByTaskId(draft, action.payload);
        break;
      case JobActionsEnum.updateTaskExecution:
        updateTaskExecution(draft, action.payload);
        break;
      case JobActionsEnum.updateTaskErrors:
        updateTaskErrors(draft, action.payload);
        break;
      case JobActionsEnum.startJobSuccess:
        draft.state = 'IN_PROGRESS';
        break;
      case JobActionsEnum.updateParameter:
        updateParameter(draft, action.payload);
        break;
      case JobActionsEnum.updateParameterVerifications:
        updateParameterVerifications(draft, action.payload);
        break;
      case JobActionsEnum.setTimerState:
        draft.timerState = action.payload;
        break;
      case JobActionsEnum.toggleMobileDrawer:
        draft.taskNavState.isMobileDrawerOpen = !draft.taskNavState.isMobileDrawerOpen;
        break;
      case JobActionsEnum.reset:
        draft = initialState;
        break;
      case JobActionsEnum.getJobAuditLogsSuccess:
        getJobAuditLogsSuccess(draft, action.payload);
        break;
      default:
        break;
    }
  });
