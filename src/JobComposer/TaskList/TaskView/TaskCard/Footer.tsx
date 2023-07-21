import { setParameterError } from '#JobComposer/ActivityList/actions';
import {
  fetchActiveStageDataRes,
  fetchActiveStageDataSuccess,
  setActiveStage,
  startPollActiveStageData,
  stopPollActiveStageData,
} from '#JobComposer/StageList/actions';
import { completeJob } from '#JobComposer/actions';
import {
  Audit,
  AutomationActionActionType,
  CompletedTaskStates,
  Task,
  TaskExecutionState,
  TimerOperator,
} from '#JobComposer/checklist.types';
import { groupJobErrors } from '#JobComposer/utils';
import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { User } from '#store/users/types';
import { apiInitializeSubTask, apiPauseJob, apiResumeJob, apiValidateTask } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { CompletedJobStates, Job, JobStateEnum } from '#views/Jobs/ListView/types';
import {
  ArrowBack,
  ArrowForward,
  CheckCircleOutlined,
  ReportProblemOutlined,
} from '@material-ui/icons';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  cancelErrorCorrection,
  completeErrorCorrection,
  completeTask,
  setActiveTask,
  setTaskError,
  startTask,
  updateTaskExecutionDurationOnResume,
} from '../../actions';
import { keyBy } from 'lodash';

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
  task: Omit<Task, 'parameters'>;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  timerState: { [index: string]: boolean };
  enableStopForTask: boolean;
};

type TaskPauseResume = {
  id: string;
  period: any;
  correctionReason: string;
  correctionEnabled: boolean;
  reason: string;
  assignees: User[];
  startedBy: Record<string, string>;
  startedAt: number;
  endedAt: number;
  endedBy: Record<string, string>;
  state: TaskExecutionState;
  audit: Audit;
  hide: string[];
  show: string[];
  correctedBy: Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName' | 'archived'>;
  correctedAt: number;
  duration: number;
  pauseReasons: Record<string, string>[];
};

const Footer: FC<FooterProps> = ({ task, setLoadingState, timerState, enableStopForTask }) => {
  const dispatch = useDispatch();
  const {
    auth: { profile },
    composer: {
      jobState,
      tasks: { tasksOrderList, tasksById, tasksOrderInStage, activeTaskId },
      stages: { stagesOrder, activeStageId },
      data,
      parameters: { hiddenIds },
    },
  } = useTypedSelector((state) => state);
  const { id: jobId } = (data as Job) ?? {};
  // const [shouldAskForReason, setAskForReason] = useState(false);
  // const [delayReason, setDelayReason] = useState('');
  const [isUserAssignedToTask, setIsUserAssignedToTask] = useState(false);
  const currentIndex = useRef(tasksOrderList.findIndex((o) => o.taskId === task.id));

  const isJobBlocked = jobState === JobStateEnum.BLOCKED;
  const isJobStarted = jobState === JobStateEnum.IN_PROGRESS || jobState === JobStateEnum.BLOCKED;

  const { state: taskExecutionState, assignees, correctionEnabled } = task.taskExecution;

  useEffect(() => {
    setIsUserAssignedToTask((assignees || []).some((user) => user.id === profile?.id));
  }, []);

  const handleOnNextTask = () => {
    if (currentIndex.current < tasksOrderList.length - 1) {
      currentIndex.current = currentIndex.current + 1;
      let nextNavOption = tasksOrderList[currentIndex.current];
      if (nextNavOption) {
        dispatch(setActiveStage(nextNavOption.stageId));
        dispatch(setActiveTask(nextNavOption.taskId));
      }
    }
  };

  const handleOnPreviousTask = () => {
    if (currentIndex.current > 0) {
      currentIndex.current = currentIndex.current - 1;
      let nextNavOption = tasksOrderList[currentIndex.current];
      if (nextNavOption) {
        dispatch(setActiveStage(nextNavOption.stageId));
        dispatch(setActiveTask(nextNavOption.taskId));
      }
    }
  };

  const onCompleteJob = (reason?: string) => {
    setLoadingState(true);
    if (task.automations?.length) {
      const createObjectAutomation = (task.automations || []).find(
        (automation) => automation.actionType === AutomationActionActionType.CREATE_OBJECT,
      );
      if (createObjectAutomation) {
        const otherAutomations = task.automations.filter(
          (automation) => automation.actionType !== AutomationActionActionType.CREATE_OBJECT,
        );
        dispatch(
          openOverlayAction({
            type: OverlayNames.AUTOMATION_ACTION,
            props: {
              objectTypeId: createObjectAutomation.actionDetails.objectTypeId,
              onDone: () =>
                dispatch(
                  completeTask({
                    taskId: task.id,
                    setLoadingState,
                    reason,
                    automations: otherAutomations.length ? otherAutomations : undefined,
                  }),
                ),
              setLoadingState,
            },
          }),
        );
      } else {
        dispatch(
          completeTask({
            taskId: task.id,
            setLoadingState,
            reason,
            automations: task.automations,
          }),
        );
      }
    } else {
      dispatch(
        completeTask({
          taskId: task.id,
          setLoadingState,
          reason,
        }),
      );
    }
  };

  const onCompleteTask = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isJobBlocked) {
      if (task.timed && (timerState.earlyCompletion || timerState.limitCrossed)) {
        const response = await request('GET', apiValidateTask(task.id), {
          params: {
            jobId,
          },
        });
        if (response.data) {
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
                  onCompleteJob(reason);
                  closeModal();
                },
              },
            }),
          );
        } else {
          const { parametersErrors } = groupJobErrors(response.errors);
          if (parametersErrors.length) {
            parametersErrors.forEach((error) => dispatch(setParameterError(error, error.id)));
          }

          dispatch(setTaskError('Parameter Incomplete', task.id));
        }
      } else {
        onCompleteJob();
      }
    }
  };

  let primaryActionProps: React.ComponentProps<typeof Button> = {};
  let primaryActionLabel = '';
  const isInboxView = location.pathname.split('/')[1] === 'inbox';
  if (isInboxView) {
    if (
      ![TaskExecutionState.COMPLETED, TaskExecutionState.COMPLETED_WITH_EXCEPTION].includes(
        taskExecutionState,
      )
    ) {
      if (jobState === JobStateEnum.ASSIGNED && isUserAssignedToTask && !task.parentTaskId) {
        primaryActionLabel = 'Start Job';
        primaryActionProps = {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(
              openOverlayAction({
                type: OverlayNames.START_JOB_MODAL,
                props: { jobId },
              }),
            );
          },
        };
      } else if (
        isJobStarted &&
        isUserAssignedToTask &&
        taskExecutionState === TaskExecutionState.NOT_STARTED
      ) {
        primaryActionLabel = 'Start task';
        primaryActionProps = {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (enableStopForTask) {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.ADD_STOP,
                  props: {},
                }),
              );
            } else {
              setLoadingState(true);
              dispatch(startTask(task.id, setLoadingState));
            }
          },
        };
      } else if (isUserAssignedToTask) {
        primaryActionLabel = 'Complete Task';
        primaryActionProps = {
          onClick: onCompleteTask,
        };
      }

      if (task.type === 'DYNAMIC') {
        if (task?.data?.parameterId) {
          primaryActionLabel = 'Create task';
          primaryActionProps = {
            onClick: async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const { data: _data } = await request('PATCH', apiInitializeSubTask(task.id), {
                data: {
                  jobId,
                },
              });
              if (_data?.stage?.id === activeStageId) {
                const {
                  stage: { tasks },
                  stageReports: reports,
                } = _data;
                let parametersById: any = {};
                let tasksOrderInStage: any = [];
                let hiddenTasksLength = 0;
                let _activeTaskId = activeTaskId;
                let parametersOrderInTaskInStage: any = {};
                const _hiddenIds = { ...hiddenIds };

                const tasksById = tasks.reduce((acc, task) => {
                  let hiddenParametersLength = 0;
                  parametersOrderInTaskInStage[task.id] = [];
                  parametersById = {
                    ...parametersById,
                    ...task.parameters.reduce((ac, parameter) => {
                      parametersOrderInTaskInStage[task.id].push(parameter.id);
                      if (parameter.response?.hidden || task.hidden) {
                        hiddenParametersLength++;
                        _hiddenIds[parameter.id] = true;
                      } else if (_hiddenIds[parameter.id]) {
                        delete _hiddenIds[parameter.id];
                      }
                      return { ...ac, [parameter.id]: parameter };
                    }, {}),
                  };
                  if (task.hidden || task?.parameters?.length === hiddenParametersLength) {
                    hiddenTasksLength++;
                    _hiddenIds[task.id] = true;
                  } else if (_hiddenIds[task.id]) {
                    delete _hiddenIds[task.id];
                  }
                  if (_hiddenIds[task.id] && task.id === activeTaskId) {
                    _activeTaskId = undefined;
                  } else if (!_activeTaskId) {
                    _activeTaskId = task.id;
                  }
                  tasksOrderInStage.push(task.id);
                  return { ...acc, [task.id]: task };
                }, {});

                if (tasks?.length === hiddenTasksLength) {
                  _hiddenIds[activeStageId!] = true;
                } else if (_hiddenIds[activeStageId!]) {
                  delete _hiddenIds[activeStageId!];
                }

                const stageReports = keyBy(reports, 'stageId');
                dispatch(
                  fetchActiveStageDataSuccess({
                    ..._data,
                    tasksById,
                    parametersById,
                    stageReports,
                    tasksOrderInStage,
                    hiddenIds: _hiddenIds,
                    activeTaskId: _activeTaskId,
                    parametersOrderInTaskInStage,
                  } as fetchActiveStageDataRes),
                );
                dispatch(stopPollActiveStageData());
                dispatch(startPollActiveStageData({ jobId }));
              }
            },
          };
        } else if (
          isJobStarted &&
          isUserAssignedToTask &&
          taskExecutionState === TaskExecutionState.NOT_STARTED
        ) {
          primaryActionLabel = 'Start task';
          primaryActionProps = {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (enableStopForTask) {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.ADD_STOP,
                    props: {},
                  }),
                );
              } else {
                setLoadingState(true);
                dispatch(startTask(task.id, setLoadingState));
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
    } else if (!(jobState in CompletedJobStates)) {
      let allStagesCompleted = true;
      stagesOrder.every((stageId) => {
        if (hiddenIds?.[stageId]) return true;
        const tasksListIds = tasksOrderInStage[stageId];
        let allTaskCompleted = true;
        tasksListIds.every((tasksListId) => {
          if (hiddenIds?.[tasksListId]) return true;
          const _task = tasksById[tasksListId];
          if (
            !(_task.taskExecution.state in CompletedTaskStates) ||
            _task.taskExecution.correctionEnabled
          ) {
            allTaskCompleted = false;
            return false;
          }
          return true;
        });
        if (!allTaskCompleted) {
          allStagesCompleted = false;
          return false;
        }
        return true;
      });
      if (allStagesCompleted) {
        primaryActionLabel = 'Complete Job';
        primaryActionProps = {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(completeJob({ jobId, details: { code: data!.code }, isInboxView }));
          },
        };
      }
    }
  }

  const togglePauseResume = async () => {
    const { data }: ResponseObj<TaskPauseResume> = await request(
      'POST',
      task.taskExecution.state === TaskExecutionState.PAUSED
        ? apiResumeJob(task.id)
        : apiPauseJob(task.id),
      {
        data: { jobId },
      },
    );
    if (data.state === TaskExecutionState.IN_PROGRESS) {
      dispatch(updateTaskExecutionDurationOnResume(task.id, data));
    }
  };

  const PauseResumeButton = () => {
    const iconShow = (state: TaskExecutionState) => {
      switch (state) {
        case TaskExecutionState.PAUSED:
          return <PlayArrowIcon />;
        case TaskExecutionState.IN_PROGRESS:
          return <PauseIcon />;
      }
    };
    return (
      <Button
        variant="primary"
        style={{ minWidth: 'unset', width: '48px' }}
        onClick={() => togglePauseResume()}
      >
        {iconShow(task.taskExecution.state)}
      </Button>
    );
  };

  return (
    <Wrapper>
      <Button variant="textOnly" onClick={handleOnPreviousTask} disabled={!currentIndex.current}>
        <ArrowBack />
      </Button>

      <div className="primary-action">
        {!!correctionEnabled ? (
          <div className="error-correction-action">
            <Button
              style={{ flex: 1, width: '160px' }}
              variant="secondary"
              onClick={() => {
                setLoadingState(true);
                dispatch(completeErrorCorrection(task.id, setLoadingState));
              }}
            >
              Confirm
            </Button>
            <Button
              style={{ flex: 1, width: '160px' }}
              variant="secondary"
              color="red"
              onClick={() => {
                setLoadingState(true);
                dispatch(cancelErrorCorrection(task.id, setLoadingState));
              }}
            >
              Cancel
            </Button>
          </div>
        ) : primaryActionLabel ? (
          <>
            {jobState === 'IN_PROGRESS' &&
              [TaskExecutionState.IN_PROGRESS, TaskExecutionState.PAUSED].includes(
                task.taskExecution.state,
              ) &&
              PauseResumeButton()}
            <Button
              variant="primary"
              {...primaryActionProps}
              disabled={task.taskExecution.state === TaskExecutionState.PAUSED}
            >
              {primaryActionLabel}
            </Button>
          </>
        ) : null}
        {!(jobState in CompletedJobStates) && (
          <>
            {!primaryActionLabel &&
              taskExecutionState === TaskExecutionState.COMPLETED &&
              !correctionEnabled && (
                <span>
                  <CheckCircleOutlined style={{ color: '#24A148' }} /> Task Completed
                </span>
              )}
            {!primaryActionLabel &&
              taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION &&
              !correctionEnabled && (
                <span>
                  <ReportProblemOutlined style={{ color: '#F1C21B' }} /> Task Completed with
                  Exception
                </span>
              )}
          </>
        )}
      </div>
      <Button
        variant="textOnly"
        onClick={handleOnNextTask}
        disabled={currentIndex.current >= tasksOrderList.length - 1}
      >
        <ArrowForward />
      </Button>
    </Wrapper>
  );
};

export default Footer;
