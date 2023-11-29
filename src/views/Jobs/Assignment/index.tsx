import { Button, Checkbox, Link as GoBack } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { apiGetAllTrainedUsersAssignedToChecklist } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CompletedJobStates, Job } from '../ListView/types';
import Section from './Section';
import { jobActions } from '#views/Job/jobStore';
import { User } from '#services/users';

export const Wrapper = styled.div.attrs({})`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  overflow: scroll;

  .header {
    align-items: center;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;

    .container {
      .checkmark {
        background-color: #fff;
        border-color: #333;
        border-radius: 0;
        border-width: 2px;
      }

      input:checked ~ .checkmark {
        background-color: #1d84ff;
        border: none;
      }
    }

    button {
      padding: 12px 16px;
    }
  }
`;

export type AllowedUser = Pick<User, 'id' | 'lastName' | 'employeeId' | 'firstName'> & {
  taskIds: string[];
};

type Props = RouteComponentProps<{ jobId: Job['id'] }>;

type State = Record<string, Record<string, [boolean, string]>>;

const reducer = (state: State, action: any): State => {
  const temp: Record<string, any> = {};

  switch (action.type) {
    case 'SET_INITIAL_STATE':
      action.payload.forEach((task) => {
        temp[task.stageId] = {
          ...temp[task.stageId],
          [task.taskExecutions[0]]: [false, task.id],
        };
      });
      return { ...state, ...temp };

    case 'SET_TASK_SELECTED_STATE':
      return {
        ...state,
        [action.payload.stageId]: {
          ...state[action.payload.stageId],
          ...action.payload.taskExecutionIds.reduce((acc: any, id: string, index: number) => {
            acc[id] = [action.payload.states[index], state[action.payload.stageId][id][1]];

            return acc;
          }, {}),
        },
      };

    case 'SET_ALL_TASK_STATE':
      action.payload.tasks.forEach((task) => {
        const taskExecution = action.payload.taskExecutions.get(task.taskExecutions[0]);
        temp[task.stageId] = {
          ...temp[task.stageId],
          [taskExecution.id]: [
            taskExecution.state in CompletedJobStates ? false : action.payload.state,
            task.id,
          ],
        };
      });
      return { ...state, ...temp };

    default:
      return { ...state };
  }
};

const Assignments: FC<Props> = (props) => {
  const { jobId } = props;

  const dispatch = useDispatch();

  const { stages, tasks, loading, taskExecutions, processId } = useTypedSelector(
    (state) => state.job,
  );

  const [totalTasksCount, setTotalTasksCount] = useState(0);

  const [state, localDispatch] = useReducer(reducer, {});
  const [trainedUsersList, setTrainedUsersList] = useState<AllowedUser[]>([]);

  const isAllTaskSelected = Object.keys(state)
    .map((stageId) => Object.values(state[stageId]).every((val) => val[0] === true))
    .every(Boolean);

  const isNoTaskSelected = Object.keys(state)
    .map((stageId) => Object.values(state[stageId]).every((val) => val[0] === false))
    .every(Boolean);

  const getTrainedUsersList = async () => {
    if (processId) {
      try {
        const assignedUsersData: ResponseObj<AllowedUser[]> = await request(
          'GET',
          apiGetAllTrainedUsersAssignedToChecklist(processId),
        );
        setTrainedUsersList(assignedUsersData.data);
      } catch (error) {
        console.error('error on fetching trained Users Data:: ', error);
      }
    }
  };

  useEffect(() => {
    if (stages) {
      localDispatch({ type: 'SET_INITIAL_STATE', payload: tasks });
      setTotalTasksCount(tasks.size);
    }
    getTrainedUsersList();
  }, [stages]);

  useEffect(() => {
    if (jobId && loading) {
      dispatch(jobActions.getJob({ id: jobId }));
    }
  }, []);

  const selectedTasks = Object.keys(state).reduce<[string, string][]>((acc, stageId) => {
    Object.entries(state[stageId]).forEach(([taskExecutionId, val]) =>
      val[0] === true ? acc.push([taskExecutionId, val[1]]) : null,
    );
    return acc;
  }, []);

  const renderStages = () => {
    const _stages: JSX.Element[] = [];
    stages.forEach((stage, index) => {
      _stages.push(
        <Section
          stage={stage}
          key={stage.id}
          sectionState={state[stage.id]}
          localDispatch={localDispatch}
          isFirst={!!index}
        />,
      );
    });
    return _stages;
  };

  if (loading) {
    return <div>Loading..</div>;
  } else {
    return (
      <div style={{ padding: '8px', height: '100%' }}>
        <GoBack label="Return to Job" className="go-back" />
        <Wrapper>
          <div className="header">
            <Checkbox
              {...(isAllTaskSelected
                ? { checked: true, partial: false }
                : isNoTaskSelected
                ? { checked: false, partial: false }
                : { checked: false, partial: true })}
              label="Select All Tasks And Stages"
              onClick={() => {
                localDispatch({
                  type: 'SET_ALL_TASK_STATE',
                  payload: {
                    tasks,
                    state: isAllTaskSelected ? false : isNoTaskSelected,
                    taskExecutions,
                  },
                });
              }}
            />

            <Button
              onClick={() => {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.USER_ASSIGNMENT,
                    props: {
                      jobId,
                      selectedTasks,
                      assignToEntireJob: selectedTasks.length === totalTasksCount,
                      trainedUsersList,
                    },
                  }),
                );
              }}
              disabled={isNoTaskSelected}
            >
              {selectedTasks.length ? `Assign ${selectedTasks.length} Tasks` : 'Assign Tasks'}
            </Button>
          </div>
          {renderStages()}
        </Wrapper>
      </div>
    );
  }
};

export default Assignments;
