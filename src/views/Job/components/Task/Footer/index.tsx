import {
  AutomationActionActionType,
  AutomationActionTriggerType,
  TimerOperator,
} from '#PrototypeComposer/checklist.types';
import { Button } from '#components';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { StoreTask, TaskAction, TaskExecutionStates, TaskExecutionType } from '#types';
import { jobActions } from '#views/Job/jobStore';
import { useJobStateToFlags } from '#views/Job/utils';
import { CompletedJobStates, JobStateEnum } from '#views/Jobs/ListView/types';
import {
  ArrowBack,
  ArrowForward,
  CheckCircleOutlined,
  ReportProblemOutlined,
} from '@material-ui/icons';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getEpochTimeDifference } from '#utils/timeUtils';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';

const Wrapper = styled.div.attrs({
  className: 'task-buttons',
})`
  display: flex;
  height: 80px;
  margin-top: auto;
  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  grid-area: task-footer;

  .primary-action {
    flex: 1;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-inline: 1px solid #e0e0e0;
    gap: 4px;

    button {
      min-width: 50%;
      max-width: 80%;
      > svg {
        height: 16px;
      }
    }

    span {
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.16px;
      color: #161616;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  button {
    margin: unset;
    padding-inline: 24px;
  }

  .error-correction-action {
    display: flex;
    gap: 16px;
  }
`;

type FooterProps = {
  task: StoreTask;
};

const Footer: FC<FooterProps> = ({ task }) => {
  const dispatch = useDispatch();
  const {
    id: jobId,
    state: jobState,
    isInboxView,
    pendingTasks,
    code,
    timerState,
  } = useTypedSelector((state) => state.job);

  if (!jobState) return null;

  const { isBlocked, isJobStarted, isTaskPaused, isTaskStarted, isTaskCompleted } =
    useJobStateToFlags();

  const {
    state: taskExecutionState,
    correctionEnabled,
    id: taskExecutionId,
    isUserAssignedToTask,
    continueRecurrence,
    recurringExpectedStartedAt,
    recurringExpectedDueAt,
    schedulingExpectedDueAt,
    schedulingExpectedStartedAt,
    type,
    previous,
    next,
  } = task.taskExecution;

  const handleOnNextTask = () => {
    if (next)
      dispatch(
        jobActions.navigateByTaskId({
          id: next,
        }),
      );
  };

  const handleOnPreviousTask = () => {
    if (previous)
      dispatch(
        jobActions.navigateByTaskId({
          id: previous,
        }),
      );
  };

  const handleRecurringTaskCompletion = (params?: {
    reason?: string;
    scheduleOverdueCompletionReason?: string;
  }) => {
    const { reason = '', scheduleOverdueCompletionReason = '' } = params || {};
    if (
      type === TaskExecutionType.RECURRING &&
      getEpochTimeDifference(recurringExpectedDueAt) === 'LATE'
    ) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.REASON_MODAL,
          props: {
            modalTitle: 'Recurring Task Overdue',
            modalDesc: 'This recurring task is overdue. Kindly provide reason for delay.',
            onSubmitHandler: (recurringOverdueCompletionReason: string, closeModal: () => void) => {
              if (continueRecurrence) {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.TASK_RECURRENCE_EXECUTION_MODAL,
                    props: {
                      onPrimary: () => {
                        preCompleteTask({
                          reason,
                          continueRecurrence: true,
                          recurringOverdueCompletionReason,
                          scheduleOverdueCompletionReason,
                        });
                      },
                      onSecondary: () => {
                        dispatch(
                          openOverlayAction({
                            type: OverlayNames.END_TASK_RECURRENCE_MODAL,
                            props: {
                              onPrimary: () => {
                                preCompleteTask({
                                  reason,
                                  continueRecurrence: false,
                                  recurringOverdueCompletionReason,
                                  scheduleOverdueCompletionReason,
                                });
                              },
                            },
                          }),
                        );
                      },
                    },
                  }),
                );
              } else {
                preCompleteTask({
                  reason,
                  recurringOverdueCompletionReason,
                  scheduleOverdueCompletionReason,
                });
              }
              closeModal();
            },
          },
        }),
      );
    } else {
      if (continueRecurrence) {
        dispatch(
          openOverlayAction({
            type: OverlayNames.TASK_RECURRENCE_EXECUTION_MODAL,
            props: {
              onPrimary: () => {
                preCompleteTask({
                  reason,
                  continueRecurrence: true,
                  scheduleOverdueCompletionReason,
                });
              },
              onSecondary: () => {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.END_TASK_RECURRENCE_MODAL,
                    props: {
                      onPrimary: () => {
                        preCompleteTask({
                          reason,
                          continueRecurrence: false,
                          scheduleOverdueCompletionReason,
                        });
                      },
                    },
                  }),
                );
              },
            },
          }),
        );
      } else {
        preCompleteTask({
          reason,
          scheduleOverdueCompletionReason,
        });
      }
    }
  };

  const openAutomationModal = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.AUTOMATION_TASK_MODAL,
        props: {
          taskId: task.id,
          taskExecutionId: task?.taskExecution?.id,
          initialTab: '1',
        },
      }),
    );
  };

  const preCompleteTask = (params?: {
    reason?: string;
    continueRecurrence?: boolean;
    recurringOverdueCompletionReason?: string;
    scheduleOverdueCompletionReason?: string;
  }) => {
    const {
      reason = '',
      continueRecurrence = false,
      recurringOverdueCompletionReason = '',
      scheduleOverdueCompletionReason = '',
    } = params || {};
    const handleCompleteTask = (createObjectAutomation: any[] = []) => {
      dispatch(
        jobActions.performTaskAction({
          id: taskExecutionId,
          action: TaskAction.COMPLETE,
          reason,
          ...(createObjectAutomation.length > 0 && {
            createObjectAutomations: createObjectAutomation,
          }),
          continueRecurrence,
          recurringOverdueCompletionReason,
          scheduleOverdueCompletionReason,
          openAutomationModal,
        }),
      );
    };

    if (task.automations?.length) {
      const createObjectAutomation = (task.automations || []).find(
        (automation) =>
          automation.actionType === AutomationActionActionType.CREATE_OBJECT &&
          automation.triggerType === AutomationActionTriggerType.TASK_COMPLETED,
      );
      if (createObjectAutomation) {
        dispatch(
          openOverlayAction({
            type: OverlayNames.AUTOMATION_ACTION,
            props: {
              objectTypeId: createObjectAutomation.actionDetails.objectTypeId,
              onDone: (createObjectData: any) => {
                const createObjectAutomations = [
                  {
                    automationId: createObjectAutomation.id,
                    entityObjectValueRequest: createObjectData,
                  },
                ];
                handleCompleteTask(createObjectAutomations);
                dispatch(closeOverlayAction(OverlayNames.AUTOMATION_ACTION));
              },
              setLoadingState: () => {},
            },
          }),
        );
      } else {
        handleCompleteTask();
      }
    } else {
      handleCompleteTask();
    }
  };

  const onCompleteTask = async () => {
    if (!isBlocked) {
      if (task.timed && (timerState.earlyCompletion || timerState.limitCrossed)) {
        let modalTitle, modalDesc;
        if (timerState.limitCrossed) {
          modalTitle = 'Delayed completion';
          modalDesc = 'State your reason for delay';
        } else if (
          task.timerOperator === TimerOperator.NOT_LESS_THAN &&
          timerState.earlyCompletion
        ) {
          modalTitle = 'Early completion';
          modalDesc = 'State your reason for early completion';
        }

        if (task.enableScheduling && getEpochTimeDifference(schedulingExpectedDueAt) === 'LATE') {
          dispatch(
            openOverlayAction({
              type: OverlayNames.REASON_MODAL,
              props: {
                modalTitle,
                modalDesc,
                onSubmitHandler: (reason: string, closeModal: () => void) => {
                  closeModal();
                  setTimeout(() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.REASON_MODAL,
                        props: {
                          modalTitle: 'Scheduled Task Overdue',
                          modalDesc:
                            'This task is overdue. Kindly provide the reason for the delay in its execution.',
                          onSubmitHandler: (
                            scheduleOverdueCompletionReason: string,
                            closeModal: () => void,
                          ) => {
                            if (task.enableRecurrence) {
                              closeModal();
                              setTimeout(() => {
                                handleRecurringTaskCompletion({
                                  reason,
                                  scheduleOverdueCompletionReason,
                                });
                              }, 0);
                            } else {
                              preCompleteTask({ reason, scheduleOverdueCompletionReason });
                              closeModal();
                            }
                          },
                        },
                      }),
                    );
                  }, 0);
                },
              },
            }),
          );
        } else if (task.enableRecurrence) {
          dispatch(
            openOverlayAction({
              type: OverlayNames.REASON_MODAL,
              props: {
                modalTitle,
                modalDesc,
                onSubmitHandler: (reason: string, closeModal: () => void) => {
                  closeModal();
                  setTimeout(() => {
                    handleRecurringTaskCompletion({ reason });
                  }, 0);
                },
              },
            }),
          );
        } else {
          dispatch(
            openOverlayAction({
              type: OverlayNames.REASON_MODAL,
              props: {
                modalTitle,
                modalDesc,
                onSubmitHandler: (reason: string, closeModal: () => void) => {
                  preCompleteTask({ reason });
                  closeModal();
                },
              },
            }),
          );
        }
      } else if (
        task.enableScheduling &&
        getEpochTimeDifference(schedulingExpectedDueAt) === 'LATE'
      ) {
        if (task.enableRecurrence) {
          dispatch(
            openOverlayAction({
              type: OverlayNames.REASON_MODAL,
              props: {
                modalTitle: 'Scheduled Task Overdue',
                modalDesc:
                  'This task is overdue. Kindly provide the reason for the delay in its execution.',
                onSubmitHandler: (
                  scheduleOverdueCompletionReason: string,
                  closeModal: () => void,
                ) => {
                  closeModal();
                  setTimeout(() => {
                    handleRecurringTaskCompletion({ scheduleOverdueCompletionReason });
                  }, 0);
                },
              },
            }),
          );
        } else {
          dispatch(
            openOverlayAction({
              type: OverlayNames.REASON_MODAL,
              props: {
                modalTitle: 'Scheduled Task Overdue',
                modalDesc:
                  'This task is overdue. Kindly provide the reason for the delay in its execution.',
                onSubmitHandler: (
                  scheduleOverdueCompletionReason: string,
                  closeModal: () => void,
                ) => {
                  preCompleteTask({ scheduleOverdueCompletionReason });
                  closeModal();
                },
              },
            }),
          );
        }
      } else if (task.enableRecurrence) {
        handleRecurringTaskCompletion();
      } else {
        preCompleteTask();
      }
    }
  };

  const onStartTask = (recurringPrematureStartReason: string = '') => {
    const handleStartTask = (createObjectAutomation: any[] = []) => {
      dispatch(
        jobActions.performTaskAction({
          id: taskExecutionId,
          action: TaskAction.START,
          openAutomationModal,
          ...(createObjectAutomation.length > 0 && {
            createObjectAutomations: createObjectAutomation,
          }),
          ...(recurringPrematureStartReason && { recurringPrematureStartReason }),
        }),
      );
    };
    if (task.automations?.length) {
      const createObjectAutomation = (task.automations || []).find(
        (automation) =>
          automation.actionType === AutomationActionActionType.CREATE_OBJECT &&
          automation.triggerType === AutomationActionTriggerType.TASK_STARTED,
      );
      if (createObjectAutomation) {
        dispatch(
          openOverlayAction({
            type: OverlayNames.AUTOMATION_ACTION,
            props: {
              objectTypeId: createObjectAutomation.actionDetails.objectTypeId,
              onDone: (createObjectData: any) => {
                const createObjectAutomations = [
                  {
                    automationId: createObjectAutomation.id,
                    entityObjectValueRequest: createObjectData,
                  },
                ];
                handleStartTask(createObjectAutomations);
                dispatch(closeOverlayAction(OverlayNames.AUTOMATION_ACTION));
              },
              setLoadingState: () => {},
            },
          }),
        );
      } else {
        handleStartTask();
      }
    } else {
      handleStartTask();
    }
  };

  let primaryActionProps: React.ComponentProps<typeof Button> = {};
  let primaryActionLabel = '';

  if (isInboxView) {
    if (!isTaskCompleted) {
      if (task.type === 'DYNAMIC') {
        if (task?.data?.parameterId) {
          primaryActionLabel = 'Create task';
          primaryActionProps = {
            onClick: async (e) => {
              // const { data: _data } = await request('PATCH', apiInitializeSubTask(task.id), {
              //   data: {
              //     jobId,
              //   },
              // });
              // if (_data?.stage?.id === activeStageId) {
              //   const {
              //     stage: { tasks },
              //     stageReports: reports,
              //   } = _data;
              //   let parametersById: any = {};
              //   let tasksOrderInStage: any = [];
              //   let hiddenTasksLength = 0;
              //   let _activeTaskId = activeTaskId;
              //   let parametersOrderInTaskInStage: any = {};
              //   const _hiddenIds = { ...hiddenIds };
              //   const tasksById = tasks.reduce((acc, task) => {
              //     let hiddenParametersLength = 0;
              //     parametersOrderInTaskInStage[task.id] = [];
              //     parametersById = {
              //       ...parametersById,
              //       ...task.parameters.reduce((ac, parameter) => {
              //         parametersOrderInTaskInStage[task.id].push(parameter.id);
              //         if (parameter.response?.hidden || task.hidden) {
              //           hiddenParametersLength++;
              //           _hiddenIds[parameter.id] = true;
              //         } else if (_hiddenIds[parameter.id]) {
              //           delete _hiddenIds[parameter.id];
              //         }
              //         return { ...ac, [parameter.id]: parameter };
              //       }, {}),
              //     };
              //     if (task.hidden || task?.parameters?.length === hiddenParametersLength) {
              //       hiddenTasksLength++;
              //       _hiddenIds[task.id] = true;
              //     } else if (_hiddenIds[task.id]) {
              //       delete _hiddenIds[task.id];
              //     }
              //     if (_hiddenIds[task.id] && task.id === activeTaskId) {
              //       _activeTaskId = undefined;
              //     } else if (!_activeTaskId) {
              //       _activeTaskId = task.id;
              //     }
              //     tasksOrderInStage.push(task.id);
              //     return { ...acc, [task.id]: task };
              //   }, {});
              //   if (tasks?.length === hiddenTasksLength) {
              //     _hiddenIds[activeStageId!] = true;
              //   } else if (_hiddenIds[activeStageId!]) {
              //     delete _hiddenIds[activeStageId!];
              //   }
              //   const stageReports = keyBy(reports, 'stageId');
              //   dispatch(
              //     fetchActiveStageDataSuccess({
              //       ..._data,
              //       tasksById,
              //       parametersById,
              //       stageReports,
              //       tasksOrderInStage,
              //       hiddenIds: _hiddenIds,
              //       activeTaskId: _activeTaskId,
              //       parametersOrderInTaskInStage,
              //     } as fetchActiveStageDataRes),
              //   );
              //   dispatch(stopPollActiveStageData());
              //   dispatch(startPollActiveStageData({ jobId }));
              // }
            },
          };
        } else if (isJobStarted && isUserAssignedToTask && !isTaskStarted) {
          primaryActionLabel = 'Start task';
          primaryActionProps = {
            onClick: () => {
              onStartTask();
            },
          };
        } else if (isUserAssignedToTask && !(jobState in CompletedJobStates)) {
          primaryActionLabel = 'Complete Task';
          primaryActionProps = {
            onClick: onCompleteTask,
          };
        }
      } else {
        if (jobState === JobStateEnum.ASSIGNED && isUserAssignedToTask && !task.parentTaskId) {
          primaryActionLabel = 'Start Job';
          primaryActionProps = {
            onClick: () => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.START_JOB_MODAL,
                  props: { jobId },
                }),
              );
            },
          };
        } else if (isJobStarted && isUserAssignedToTask && !isTaskStarted) {
          primaryActionLabel = 'Start task';
          primaryActionProps = {
            onClick: () => {
              if (
                task.enableScheduling &&
                getEpochTimeDifference(schedulingExpectedStartedAt) === 'EARLY'
              ) {
                dispatch(
                  showNotification({
                    type: NotificationType.ERROR,
                    msg: 'Task cannot be started before its scheduled start time.',
                  }),
                );
              } else if (
                task?.enableRecurrence &&
                type === TaskExecutionType.RECURRING &&
                getEpochTimeDifference(recurringExpectedStartedAt) === 'EARLY'
              ) {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.REASON_MODAL,
                    props: {
                      modalTitle: 'Start the Task',
                      modalDesc:
                        'Are you sure you want to start the task before it’s start time ? Please provide a reason for it.',
                      onSubmitHandler: (reason: string) => {
                        onStartTask(reason);
                        dispatch(closeOverlayAction(OverlayNames.REASON_MODAL));
                      },
                    },
                  }),
                );
              } else {
                onStartTask();
              }
            },
          };
        } else if (isUserAssignedToTask && !(jobState in CompletedJobStates)) {
          primaryActionLabel = 'Complete Task';
          primaryActionProps = {
            onClick: onCompleteTask,
          };
        }
      }
    } else if (!(jobState in CompletedJobStates) && !pendingTasks.size) {
      primaryActionLabel = 'Complete Job';
      primaryActionProps = {
        onClick: () => {
          if (jobId && code) dispatch(jobActions.completeJob({ jobId, details: { code } }));
        },
      };
    }
  }

  const togglePauseResume = async (reason = '', comment = '') => {
    dispatch(
      jobActions.togglePauseResume({
        id: taskExecutionId,
        reason,
        comment,
        isTaskPaused,
      }),
    );
  };

  const PauseResumeButton = () => {
    const iconShow = (state: TaskExecutionStates) => {
      switch (state) {
        case 'PAUSED':
          return <PlayArrowIcon />;
        case 'IN_PROGRESS':
          return <PauseIcon />;
      }
    };

    return (
      <Button
        variant="primary"
        style={{ minWidth: 'unset', width: '48px' }}
        onClick={() => {
          if (isTaskPaused) {
            togglePauseResume();
          } else {
            dispatch(
              openOverlayAction({
                type: OverlayNames.TASK_PAUSE_REASON_MODAL,
                props: {
                  onSubmitHandler: togglePauseResume,
                },
              }),
            );
          }
        }}
      >
        {iconShow(taskExecutionState)}
      </Button>
    );
  };

  return (
    <Wrapper>
      <Button variant="textOnly" onClick={handleOnPreviousTask} disabled={!previous}>
        <ArrowBack />
      </Button>

      <div className="primary-action">
        {!!correctionEnabled && isInboxView ? (
          <div className="error-correction-action">
            <Button
              style={{ flex: 1, width: '160px' }}
              variant="secondary"
              onClick={() => {
                dispatch(
                  jobActions.performTaskAction({
                    id: taskExecutionId,
                    action: TaskAction.COMPLETE_ERROR_CORRECTION,
                    openAutomationModal,
                  }),
                );
              }}
            >
              Confirm
            </Button>
            <Button
              style={{ flex: 1, width: '160px' }}
              variant="secondary"
              color="red"
              onClick={() => {
                dispatch(
                  jobActions.performTaskAction({
                    id: taskExecutionId,
                    action: TaskAction.CANCEL_ERROR_CORRECTION,
                  }),
                );
              }}
            >
              Cancel
            </Button>
          </div>
        ) : primaryActionLabel ? (
          <>
            {jobState === 'IN_PROGRESS' &&
              ['IN_PROGRESS', 'PAUSED'].includes(taskExecutionState) &&
              PauseResumeButton()}
            <Button variant="primary" {...primaryActionProps} disabled={isTaskPaused}>
              {primaryActionLabel}
            </Button>
          </>
        ) : null}
        {!(jobState in CompletedJobStates) && (
          <>
            {!primaryActionLabel && taskExecutionState === 'COMPLETED' && !correctionEnabled && (
              <span>
                <CheckCircleOutlined style={{ color: '#24A148' }} /> Task Completed
              </span>
            )}
            {!primaryActionLabel &&
              taskExecutionState === 'COMPLETED_WITH_EXCEPTION' &&
              !correctionEnabled && (
                <span>
                  <ReportProblemOutlined style={{ color: '#F1C21B' }} /> Task Completed with
                  Exception
                </span>
              )}
          </>
        )}
      </div>
      <Button variant="textOnly" onClick={handleOnNextTask} disabled={!next}>
        <ArrowForward />
      </Button>
    </Wrapper>
  );
};

export default Footer;
