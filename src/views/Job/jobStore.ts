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
    continueRecurrence?: boolean;
    recurringOverdueCompletionReason?: string;
    recurringPrematureStartReason?: string;
    scheduleOverdueCompletionReason?: string;
    openAutomationModal?: any;
  },
  repeatTask: {} as { id: string },
  removeRepeatTask: {} as { taskExecutionId: string },
  endTaskRecurrence: {} as { taskExecutionId: string },
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
  approveRejectParameter: {} as {
    parameterId: string;
    parameterResponseId: string;
    type: SupervisorResponse;
  },
  updateParameter: {} as { data: Parameter },
  initiateSelfVerification: {} as { parameterResponseId: string },
  completeSelfVerification: {} as {
    parameterResponseId: string;
    password: string;
    code: string;
    state: string;
  },
  updateParameterVerifications: {} as { parameterResponseId: string; data: Verification },
  sendPeerVerification: {} as { parameterResponseId: string; userId: string },
  recallPeerVerification: {} as { parameterResponseId: string; type: 'self' | 'peer' },
  acceptPeerVerification: {} as {
    parameterResponseId: string;
    password: string;
    code: string;
    state: string;
  },
  rejectPeerVerification: {} as { parameterResponseId: string; comment: string },
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
  taskExecutions: new Map(),
  parameterResponseById: new Map(),
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
  draft.taskExecutions = new Map(data.taskExecutions);
  draft.parameterResponseById = new Map(data.parameterResponseById);
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
  const taskExecution = draft.taskExecutions.get(payload.id);
  draft.updating = false;

  if (taskExecution) {
    draft.taskExecutions.set(payload.id, { ...taskExecution, ...payload.data });

    draft.jobFromBE?.checklist.stages = draft.jobFromBE.checklist.stages.map((stage: any) => {
      if (stage.id === taskExecution?.stageId) {
        return {
          ...stage,
          tasks: stage.tasks.map((currTask: any) => {
            if (currTask.id === taskExecution?.taskId) {
              return {
                ...currTask,
                taskExecutions: currTask.taskExecutions.map((currTaskExecution) => {
                  if (currTaskExecution.id === taskExecution.id) {
                    return { ...payload.data };
                  } else {
                    return currTaskExecution;
                  }
                }),
              };
            }
            return currTask;
          }),
        };
      }
      return stage;
    });
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
  const taskExecution = draft.taskExecutions.get(payload.id);
  if (taskExecution) {
    draft.taskNavState = {
      isMobileDrawerOpen: false,
      current: taskExecution.id,
    };
  }
}

function updateParameter(draft: JobStore, payload: typeof actions.updateParameter) {
  const { data } = payload;
  const reponseId = data.response[0].id;
  let response = draft.parameterResponseById.get(reponseId);
  if (response) {
    draft.parameterResponseById.set(reponseId, { ...response, ...data.response[0] });
    if (data?.hide?.length) {
      data.hide.forEach((id) => {
        const paramRes = draft.parameterResponseById.get(id);
        if (paramRes && !paramRes.hidden) {
          paramRes.hidden = true;

          const taskExecution = draft.taskExecutions.get(paramRes.taskExecutionId);
          if (taskExecution) {
            taskExecution.visibleParametersCount--;

            if (taskExecution.visibleParametersCount < 0) {
              taskExecution.visibleParametersCount = 0;
            }

            if (taskExecution.visibleParametersCount === 0) {
              const task = draft.tasks.get(taskExecution.taskId);
              if (task) {
                task.visibleTaskExecutionsCount--;

                if (task.visibleTaskExecutionsCount < 0) {
                  task.visibleTaskExecutionsCount = 0;
                }

                if (task.visibleTaskExecutionsCount === 0) {
                  const stage = draft.stages.get(task.stageId);
                  if (stage) {
                    stage.visibleTasksCount--;

                    if (stage.visibleTasksCount < 0) {
                      stage.visibleTasksCount = 0;
                    }
                  }
                }
              }

              const prevVisibleTaskExecution = taskExecution.previous
                ? draft.taskExecutions.get(taskExecution.previous)
                : undefined;
              if (prevVisibleTaskExecution) {
                prevVisibleTaskExecution.next = taskExecution.next;
                if (taskExecution.next) {
                  const nextTaskExecution = draft.taskExecutions.get(taskExecution.next);
                  if (nextTaskExecution) {
                    nextTaskExecution.previous = taskExecution.previous;
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
        const paramRes = draft.parameterResponseById.get(id);
        if (paramRes && paramRes.hidden) {
          paramRes.hidden = false;

          const taskExecution = draft.taskExecutions.get(paramRes.taskExecutionId);

          if (taskExecution) {
            if (taskExecution.visibleParametersCount === 0) {
              const task = draft.tasks.get(taskExecution.taskId);
              if (task) {
                if (task.visibleTaskExecutionsCount === 0) {
                  const stage = draft.stages.get(task.stageId);
                  if (stage) {
                    stage.visibleTasksCount++;
                  }
                }
                task.visibleTaskExecutionsCount++;
              }
            }

            taskExecution.visibleParametersCount++;

            const prevVisibleTaskExecution = taskExecution.previous
              ? draft.taskExecutions.get(taskExecution.previous)
              : undefined;
            if (prevVisibleTaskExecution) {
              taskExecution.next = prevVisibleTaskExecution.next;
              prevVisibleTaskExecution.next = taskExecution.id;
              if (taskExecution.next) {
                const nextTaskExecution = draft.taskExecutions.get(taskExecution.next);
                if (nextTaskExecution) {
                  nextTaskExecution.previous = taskExecution.id;
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
  const { data, parameterResponseId } = payload;
  let response = draft.parameterResponseById.get(parameterResponseId);
  if (response) {
    if (response.parameterVerifications?.length) {
      response.parameterVerifications = (response.parameterVerifications || []).map(
        (verification: any) => {
          if (verification.verificationType === data.verificationType) {
            return data;
          }
          return verification;
        },
      );
    } else {
      response.parameterVerifications = [data];
    }

    if (data.evaluationState) {
      response.state = data.evaluationState;
    }
  }
}

function getJobAuditLogsSuccess(draft: JobStore, payload: typeof actions.getJobAuditLogsSuccess) {
  draft.auditLogs.loading = false;
  draft.auditLogs.pageable = payload.pageable;
  draft.auditLogs.logs = payload.data;
  draft.loading = false;
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
      case JobActionsEnum.repeatTask:
      case JobActionsEnum.removeRepeatTask:
      case JobActionsEnum.endTaskRecurrence:
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
