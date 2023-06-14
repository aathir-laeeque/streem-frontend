import { useTypedSelector } from '#store';
import React, { FC, RefObject, createRef, useEffect } from 'react';
import { useLocation } from '@reach/router';
import TasksOverview from '#JobComposer/OverviewPage';
import { setActiveStage } from '#JobComposer/StageList/actions';
import { useDispatch } from 'react-redux';
import { Task } from '../checklist.types';
import TaskView from './TaskView';
import { setActiveTask } from './actions';
import Wrapper from './styles';

const TaskListView: FC<{ overviewOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }> =
  ({ overviewOpen }) => {
    const {
      stages: { activeStageId, stagesOrder },
      tasks: {
        activeTaskId,
        bringIntoView,
        tasksById,
        taskIdWithStop,
        tasksOrderInStage,
        stageIdWithTaskStop,
        tasksOrderList,
      },
      parameters: { hiddenIds },
    } = useTypedSelector((state) => state.composer);
    const location = useLocation();
    const { verificationTaskId, VerificationStageId } = location.state;
    const dispatch = useDispatch();
    const tasksListIds = tasksOrderInStage[activeStageId!];

    const shouldStageHaveStop =
      stagesOrder.indexOf(stageIdWithTaskStop!) > -1 &&
      stagesOrder.indexOf(activeStageId!) >= stagesOrder.indexOf(stageIdWithTaskStop!);

    const refMap = tasksListIds.reduce<Record<Task['id'], RefObject<HTMLDivElement>>>(
      (acc, taskId) => {
        acc[taskId] = createRef<HTMLDivElement>();

        return acc;
      },
      {},
    );

    useEffect(() => {
      if (verificationTaskId && VerificationStageId) {
        dispatch(setActiveStage(VerificationStageId));
        dispatch(setActiveTask(verificationTaskId));
      }
    }, []);

    useEffect(() => {
      if (activeTaskId) {
        if (hiddenIds?.[activeTaskId]) {
          let currentIndex = tasksOrderList.findIndex((o) => o.taskId === activeTaskId);
          if (currentIndex < tasksOrderList.length - 1) {
            currentIndex = currentIndex + 1;
            let nextNavOption: any;
            for (let i = currentIndex; i < tasksOrderList.length; i++) {
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
        } else if (bringIntoView) {
          if (refMap?.[activeTaskId]?.current) {
            refMap[activeTaskId!].current.scrollIntoView({
              behaviour: 'smooth',
              block: 'start',
            });
          }
        }
      }
    }, [activeTaskId, hiddenIds]);

    if (!activeTaskId) return null;

    const task = tasksById[activeTaskId];

    const enableStopForTask =
      shouldStageHaveStop && tasksListIds.indexOf(task.id) > tasksListIds.indexOf(taskIdWithStop);

    if (task && !hiddenIds?.[task.id]) {
      return (
        <Wrapper>
          <div className="overview">
            <TasksOverview />
          </div>
          <div className="tasks-list">
            <TaskView
              isActive={true}
              key={task.id}
              task={task}
              enableStopForTask={enableStopForTask}
              ref={refMap[task.id]}
              overviewOpen={overviewOpen}
            />
          </div>
        </Wrapper>
      );
    }

    return null;
  };

export default TaskListView;
