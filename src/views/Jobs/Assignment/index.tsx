import { Button1, Checkbox, Link as GoBack } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { fetchData } from '#JobComposer/actions';
import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store/helpers';
import { RouteComponentProps } from '@reach/router';
import { isEmpty } from 'lodash';
import React, { FC, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Job, CompletedJobStates } from '../NewListView/types';
import Section from './Section';

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

type Props = RouteComponentProps<{ jobId: Job['id'] }>;

type State = Record<string, Record<string, [boolean, string]>>;

const reducer = (state: State, action: any): State => {
  const temp: Record<string, any> = {};

  switch (action.type) {
    case 'SET_INITIAL_STATE':
      (action.payload as Job).checklist.stages.forEach((stage) => {
        stage.tasks.forEach((task) => {
          temp[stage.id] = {
            ...temp[stage.id],
            [task.taskExecution.id]: [false, task.id],
          };
        });
      });
      return { ...state, ...temp };

    case 'SET_TASK_SELECTED_STATE':
      return {
        ...state,
        [action.payload.stageId]: {
          ...state[action.payload.stageId],
          ...action.payload.taskExecutionIds.reduce(
            (acc: any, id: string, index: number) => {
              acc[id] = [
                action.payload.states[index],
                state[action.payload.stageId][id][1],
              ];

              return acc;
            },
            {},
          ),
        },
      };

    case 'SET_ALL_TASK_STATE':
      (action.payload.data as Job).checklist.stages.forEach((stage) => {
        stage.tasks.forEach((task) => {
          temp[stage.id] = {
            ...temp[stage.id],
            [task.taskExecution.id]: [
              task.taskExecution.state in CompletedJobStates
                ? false
                : action.payload.state,
              task.id,
            ],
          };
        });
      });
      return { ...state, ...temp };

    default:
      return { ...state };
  }
};

const Assignments: FC<Props> = (props) => {
  const { jobId } = props;

  const dispatch = useDispatch();

  const {
    data,
    loading,
    stages: { stagesById, stagesOrder },
  } = useTypedSelector((state) => state.composer);

  const [state, localDispatch] = useReducer(reducer, {});

  const isAllTaskSelected = Object.keys(state)
    .map((stageId) =>
      Object.values(state[stageId]).every((val) => val[0] === true),
    )
    .every(Boolean);

  const isNoTaskSelected = Object.keys(state)
    .map((stageId) =>
      Object.values(state[stageId]).every((val) => val[0] === false),
    )
    .every(Boolean);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchData({ id: jobId, entity: Entity.JOB }));
    }
  }, []);

  useEffect(() => {
    if (data && !isEmpty(data)) {
      localDispatch({ type: 'SET_INITIAL_STATE', payload: data });
    }
  }, [data]);

  const selectedTasks = Object.keys(state).reduce<[string, string][]>(
    (acc, stageId) => {
      Object.entries(state[stageId]).forEach(([taskExecutionId, val]) =>
        val[0] === true ? acc.push([taskExecutionId, val[1]]) : null,
      );
      return acc;
    },
    [],
  );

  const totalTasksCount = data?.totalTasks;

  if (loading) {
    return <div>Loading..</div>;
  } else {
    return (
      <div style={{ padding: '8px', height: '100%' }}>
        <GoBack label="Return to process" className="go-back" />
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
                    data,
                    state: isAllTaskSelected ? false : isNoTaskSelected,
                  },
                });
              }}
            />

            <Button1
              onClick={() => {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.USER_ASSIGNMENT,
                    props: {
                      jobId,
                      selectedTasks,
                      assignToEntireJob:
                        selectedTasks.length === totalTasksCount,
                    },
                  }),
                );
              }}
              disabled={isNoTaskSelected}
            >
              {selectedTasks.length
                ? `Assign ${selectedTasks.length} Tasks`
                : 'Assign Tasks'}
            </Button1>
          </div>

          {stagesOrder.map((stageId, index) => (
            <Section
              stage={stagesById[stageId]}
              key={stageId}
              sectionState={state[stageId]}
              localDispatch={localDispatch}
              isFirst={index === 0}
            />
          ))}
        </Wrapper>
      </div>
    );
  }
};

export default Assignments;
