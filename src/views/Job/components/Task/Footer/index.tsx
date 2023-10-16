import { AutomationActionActionType, TimerOperator } from '#PrototypeComposer/checklist.types';
import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { StoreTask, TaskAction, TaskExecutionStates } from '#types';
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
    taskNavState: { previous, next, stopExecution },
    isInboxView,
    pendingTasks,
    code,
    timerState,
  } = useTypedSelector((state) => state.job);

  if (!jobState) return null;

  const { isUserAssignedToTask } = task;

  const { isBlocked, isJobStarted, isTaskPaused, isTaskStarted, isTaskCompleted } =
    useJobStateToFlags();

  const { state: taskExecutionState, correctionEnabled } = task.taskExecution;

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

  const preCompleteTask = (reason?: string) => {
    const handleCompleteTask = () => {
      dispatch(
        jobActions.performTaskAction({
          id: task.id,
          action: TaskAction.COMPLETE,
          reason: reason!,
        }),
      );
    };

    if (task.automations?.length) {
      const createObjectAutomation = (task.automations || []).find(
        (automation) => automation.actionType === AutomationActionActionType.CREATE_OBJECT,
      );
      if (createObjectAutomation) {
        dispatch(
          openOverlayAction({
            type: OverlayNames.AUTOMATION_ACTION,
            props: {
              objectTypeId: createObjectAutomation.actionDetails.objectTypeId,
              onDone: handleCompleteTask,
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
        dispatch(
          openOverlayAction({
            type: OverlayNames.REASON_MODAL,
            props: {
              modalTitle,
              modalDesc,
              onSubmitHandler: (reason: string, closeModal: () => void) => {
                preCompleteTask(reason);
                closeModal();
              },
            },
          }),
        );
      } else {
        preCompleteTask();
      }
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
              if (stopExecution) {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.ADD_STOP,
                    props: {},
                  }),
                );
              } else {
                dispatch(
                  jobActions.performTaskAction({
                    id: task.id,
                    action: TaskAction.START,
                  }),
                );
              }
            },
          };
        } else if (isUserAssignedToTask) {
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
              if (stopExecution) {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.ADD_STOP,
                    props: {},
                  }),
                );
              } else {
                dispatch(
                  jobActions.performTaskAction({
                    id: task.id,
                    action: TaskAction.START,
                  }),
                );
              }
            },
          };
        } else if (isUserAssignedToTask) {
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
        id: task.id,
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
        {iconShow(task.taskExecution.state)}
      </Button>
    );
  };

  return (
    <Wrapper>
      <Button variant="textOnly" onClick={handleOnPreviousTask} disabled={!previous}>
        <ArrowBack />
      </Button>

      <div className="primary-action">
        {!!correctionEnabled ? (
          <div className="error-correction-action">
            <Button
              style={{ flex: 1, width: '160px' }}
              variant="secondary"
              onClick={() => {
                dispatch(
                  jobActions.performTaskAction({
                    id: task.id,
                    action: TaskAction.COMPLETE_ERROR_CORRECTION,
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
                    id: task.id,
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
              ['IN_PROGRESS', 'PAUSED'].includes(task.taskExecution.state) &&
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
