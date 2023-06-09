import {
  fetchActiveStageDataRes,
  fetchActiveStageDataSuccess,
  setActiveStage,
  startPollActiveStageData,
  stopPollActiveStageData,
} from '#JobComposer/StageList/actions';
import { completeJob } from '#JobComposer/actions';
import {
  AutomationActionActionType,
  CompletedTaskStates,
  Task,
  TaskExecutionState,
} from '#JobComposer/checklist.types';
import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { Users } from '#store/users/types';
import {
  apiGetAllUsersAssignedToJob,
  apiInitializeSubTask,
  apiPauseJob,
  apiResumeJob,
} from '#utils/apiUrls';
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
import { keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  completeTask,
  setActiveTask,
  startTask,
  updateTaskExecutionDurationOnResume,
} from '../../actions';

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
`;

type FooterProps = {
  canSkipTask: boolean;
  parametersHasError: boolean;
  task: Omit<Task, 'parameters'>;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  timerState: { [index: string]: boolean };
  enableStopForTask: boolean;
};

const Footer: FC<FooterProps> = ({
  canSkipTask,
  task,
  parametersHasError,
  setLoadingState,
  timerState,
  enableStopForTask,
}) => {
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
  const [isLoggedInUserAssigned, setIsLoggedInUserAssigned] = useState(false);

  const getAssignments = async () => {
    if (jobId) {
      const response: { data: Users; errors: { message: string }[] } = await request(
        'GET',
        apiGetAllUsersAssignedToJob(jobId),
      );
      if (response.data) {
        setIsLoggedInUserAssigned(response.data.some((user) => user.id === profile?.id));
      } else {
        console.error('error came in fetch assigned users from component :: ', response.errors);
      }
    }
  };

  useEffect(() => {
    getAssignments();
  }, [jobId]);

  const isJobBlocked = jobState === JobStateEnum.BLOCKED;
  const isJobStarted = jobState === JobStateEnum.IN_PROGRESS || jobState === JobStateEnum.BLOCKED;

  const { state: taskExecutionState, reason, assignees } = task.taskExecution;

  const currentIndex = useRef(tasksOrderList.findIndex((o) => o.taskId === task.id));

  const handleOnNextTask = () => {
    if (currentIndex.current < tasksOrderList.length - 1) {
      currentIndex.current = currentIndex.current + 1;
      let nextNavOption: any;
      for (let i = currentIndex.current; i < tasksOrderList.length; i++) {
        if (!hiddenIds?.[tasksOrderList[i].taskId]) {
          nextNavOption = tasksOrderList[i];
          break;
        }
      }
      if (nextNavOption) {
        dispatch(setActiveStage(nextNavOption.stageId));
        dispatch(setActiveTask(nextNavOption.taskId));
      }
    }
  };

  const handleOnPreviousTask = () => {
    if (currentIndex.current > 0) {
      currentIndex.current = currentIndex.current - 1;
      let nextNavOption: any;
      for (let i = currentIndex.current; i >= 0; i--) {
        if (!hiddenIds?.[tasksOrderList[i].taskId]) {
          nextNavOption = tasksOrderList[i];
          break;
        }
      }
      if (nextNavOption) {
        dispatch(setActiveStage(nextNavOption.stageId));
        dispatch(setActiveTask(nextNavOption.taskId));
      }
    }
  };

  const isUserAssignedToTask = (assignees || []).some((user) => user.id === profile?.id);

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

  let primaryActionProps = {};
  let primaryActionLabel = '';
  const isInboxView = location.pathname.split('/')[1] === 'inbox';
  if (isInboxView) {
    if (
      ![TaskExecutionState.COMPLETED, TaskExecutionState.COMPLETED_WITH_EXCEPTION].includes(
        taskExecutionState,
      )
    ) {
      if (jobState === JobStateEnum.ASSIGNED && isLoggedInUserAssigned) {
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
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isJobBlocked) {
              if (task.timed && (timerState.earlyCompletion || timerState.limitCrossed)) {
                // setAskForReason(true);
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.COMPLETE_TASK_WITH_EXCEPTION,
                    props: { taskId: task.id, setLoadingState },
                  }),
                );
              } else {
                onCompleteJob();
              }
            }
          },
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
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isJobBlocked) {
                if (task.timed && (timerState.earlyCompletion || timerState.limitCrossed)) {
                  // setAskForReason(true);
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.COMPLETE_TASK_WITH_EXCEPTION,
                      props: { taskId: task.id, setLoadingState },
                    }),
                  );
                } else {
                  onCompleteJob();
                }
              }
            },
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
          if (!(_task.taskExecution.state in CompletedTaskStates)) {
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

  const timerjobApiCall = async () => {
    try {
      const { data, errors }: ResponseObj<any> = await request(
        task.taskExecution.state === 'PAUSED' ? 'PATCH' : 'POST',
        task.taskExecution.state === 'PAUSED' ? apiResumeJob(task.id) : apiPauseJob(task.id),
        {
          data: { jobId },
        },
      );
      if (data.state === 'IN_PROGRESS') {
        dispatch(updateTaskExecutionDurationOnResume(task.id, data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PauseResumeButton = () => {
    const iconShow = (state) => {
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
        onClick={() => timerjobApiCall()}
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
        {primaryActionLabel && (
          <>
            {jobState === 'IN_PROGRESS' &&
              ['IN_PROGRESS', 'PAUSED'].includes(task.taskExecution.state) &&
              PauseResumeButton()}
            <Button variant="primary" {...primaryActionProps}>
              {primaryActionLabel}
            </Button>
          </>
        )}
        {!(jobState in CompletedJobStates) && (
          <>
            {!primaryActionLabel && taskExecutionState === TaskExecutionState.COMPLETED && (
              <span>
                <CheckCircleOutlined style={{ color: '#24A148' }} /> Task Completed
              </span>
            )}
            {!primaryActionLabel &&
              taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION && (
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
