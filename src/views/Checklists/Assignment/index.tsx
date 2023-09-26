import { Button, Checkbox, Link as GoBack } from '#components';
import { fetchComposerData, resetComposer } from '#PrototypeComposer/actions';
import { Checklist } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import Section from './Section';
import { Wrapper } from '#views/Jobs/Assignment';
import { apiGetAllTrainedUsersAssignedToChecklist } from '#utils/apiUrls';
import { request } from '#utils/request';
import { ResponseObj } from '#utils/globalTypes';
import { User } from '#services/users';
import checkPermission from '#services/uiPermissions';

type Props = RouteComponentProps<{ id: string }>;
type ReducerState = {
  selection: Record<string, Record<string, boolean>>;
  isAllTaskSelected: boolean;
  isNoTaskSelected: boolean;
  selectedTasks: string[];
  totalTasks: number;
  isAllTaskSelectedByStageId: Record<string, boolean>;
  isNoTaskSelectedByStageId: Record<string, boolean>;
};

type AllowedUser = Pick<User, 'id' | 'lastName' | 'employeeId' | 'firstName'> & {
  taskIds: string[];
};

export type State = {
  usersList: (Omit<AllowedUser, 'taskIds'> & {
    completelyAssigned: boolean;
  })[];
  usersMap: Record<string, Omit<AllowedUser, 'taskIds' | 'id'>>;
  mappedTasks: Record<string, string[]>;
};

const reducer = (state: ReducerState, action: any): ReducerState => {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      state = {
        totalTasks: 0,
        selection: {},
        isAllTaskSelected: false,
        isNoTaskSelected: true,
        selectedTasks: [],
        isAllTaskSelectedByStageId: {},
        isNoTaskSelectedByStageId: {},
      };
      (action.payload as Checklist).stages.forEach((stage) => {
        stage.tasks.forEach((task) => {
          state.totalTasks++;
          state.selection[stage.id] = {
            ...state.selection[stage.id],
            [task.id]: false,
          };
        });
        state.isAllTaskSelectedByStageId = {
          ...state.isAllTaskSelectedByStageId,
          [stage.id]: false,
        };
        state.isNoTaskSelectedByStageId = {
          ...state.isNoTaskSelectedByStageId,
          [stage.id]: true,
        };
      });
      return { ...state };

    case 'SET_TASK_SELECTED_STATE':
      const { taskIds, stageId, states } = action.payload;
      const triggeredTasksLength = taskIds.length;
      const currentStageLength = Object.keys(state.selection[stageId]).length;
      taskIds.forEach((taskId: string, index: number) => {
        state.selection = {
          ...state.selection,
          [stageId]: {
            ...state.selection[stageId],
            [taskId]: states[index],
          },
        };
        if (states[index]) {
          state.selectedTasks.push(taskId);
          if (currentStageLength === triggeredTasksLength) {
            state.isNoTaskSelectedByStageId[stageId] = false;
            state.isAllTaskSelectedByStageId[stageId] = true;
          }
        } else {
          state.selectedTasks = state.selectedTasks.filter((id) => id !== taskId);
          if (currentStageLength === triggeredTasksLength) {
            state.isAllTaskSelectedByStageId[stageId] = false;
            state.isNoTaskSelectedByStageId[stageId] = true;
          }
        }
      });
      state.totalTasks === state.selectedTasks.length
        ? (state.isAllTaskSelected = true)
        : (state.isAllTaskSelected = false);
      if (!state.selectedTasks.length) {
        state.isNoTaskSelected = true;
      } else {
        state.isNoTaskSelected = false;
      }
      if (triggeredTasksLength !== currentStageLength) {
        state.isAllTaskSelectedByStageId[stageId] = false;
        state.isNoTaskSelectedByStageId[stageId] = false;
        let allSelected = true;
        let noneSelected = true;
        Object.values(state.selection[stageId]).forEach((isSelected) =>
          isSelected ? (noneSelected = false) : (allSelected = false),
        );
        if (allSelected) {
          state.isAllTaskSelectedByStageId[stageId] = true;
        } else if (noneSelected) {
          state.isNoTaskSelectedByStageId[stageId] = true;
        }
      }
      return { ...state };

    case 'SET_ALL_TASK_STATE':
      state.selectedTasks = [];
      (action.payload.data as Checklist).stages.forEach((stage) => {
        stage.tasks.forEach((task) => {
          state.selection[stage.id] = {
            ...state.selection[stage.id],
            [task.id]: action.payload.state,
          };
          state.isAllTaskSelectedByStageId = {
            ...state.isAllTaskSelectedByStageId,
            [stage.id]: action.payload.state,
          };
          state.isNoTaskSelectedByStageId = {
            ...state.isNoTaskSelectedByStageId,
            [stage.id]: !action.payload.state,
          };
          if (action.payload.state) {
            state.selectedTasks.push(task.id);
          }
        });
      });
      state.isAllTaskSelected = action.payload.state;
      state.isNoTaskSelected = !action.payload.state;
      return { ...state };

    default:
      return state;
  }
};

const Logs: FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const {
    prototypeComposer: {
      loading,
      data,
      stages: { listById, listOrder },
    },
  } = useTypedSelector((state) => state);
  const [
    {
      selection,
      totalTasks,
      isAllTaskSelected,
      isNoTaskSelected,
      selectedTasks,
      isAllTaskSelectedByStageId,
      isNoTaskSelectedByStageId,
    },
    localDispatch,
  ] = useReducer(reducer, {
    totalTasks: 0,
    selection: {},
    isAllTaskSelected: false,
    isNoTaskSelected: true,
    selectedTasks: [],
    isAllTaskSelectedByStageId: {},
    isNoTaskSelectedByStageId: {},
  });
  const [refresh, setRefresh] = useState(false);
  const [state, setState] = useState<State>({
    mappedTasks: {},
    usersMap: {},
    usersList: [],
  });

  useEffect(() => {
    if (data && !isEmpty(data)) {
      localDispatch({ type: 'SET_INITIAL_STATE', payload: data });
    }
  }, [data, refresh]);

  useEffect(() => {
    if (id && totalTasks) {
      (async () => {
        try {
          const assignedUsersData: ResponseObj<AllowedUser[]> = await request(
            'GET',
            apiGetAllTrainedUsersAssignedToChecklist(id),
          );
          const _data = assignedUsersData.data.reduce<State>(
            (acc, user) => {
              acc.usersList.push({
                id: user.id,
                employeeId: user.employeeId,
                firstName: user.firstName,
                lastName: user.lastName,
                completelyAssigned: user.taskIds.length === totalTasks,
              });
              acc.usersMap[user.id] = {
                employeeId: user.employeeId,
                firstName: user.firstName,
                lastName: user.lastName,
              };
              user.taskIds.forEach((taskId) => {
                acc.mappedTasks = {
                  ...acc.mappedTasks,
                  [taskId]: [...(acc.mappedTasks?.[taskId] || []), user.id],
                };
              });
              return acc;
            },
            { mappedTasks: {}, usersMap: {}, usersList: [] },
          );
          setState(_data);
        } catch (error) {
          console.error('error on fetching assignedUsersData :: ', error);
        }
      })();
    }
  }, [totalTasks, refresh]);

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity: ComposerEntity.CHECKLIST, id }));
    }
    return () => {
      dispatch(resetComposer());
    };
  }, [id]);

  if (loading) {
    return <div>Loading..</div>;
  } else {
    return (
      <div style={{ padding: '8px', height: '100%' }}>
        <GoBack label="Return to process" className="go-back" />
        <Wrapper>
          <div className="header">
            {checkPermission(['trainedUsers', 'edit']) && (
              <>
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
                <Button
                  onClick={() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.CHECKLIST_USER_ASSIGNMENT,
                        props: {
                          checklistId: id,
                          selectedTasks,
                          onClose: () => setRefresh(!refresh),
                        },
                      }),
                    );
                  }}
                  disabled={isNoTaskSelected}
                >
                  {selectedTasks.length ? `Assign ${selectedTasks.length} Tasks` : 'Assign Tasks'}
                </Button>
              </>
            )}
          </div>

          {listOrder.map((stageId, index) => (
            <Section
              stage={listById[stageId]}
              key={stageId}
              sectionState={selection[stageId]}
              localDispatch={localDispatch}
              isFirst={index === 0}
              isAllTaskSelected={isAllTaskSelectedByStageId[stageId]}
              isNoTaskSelected={isNoTaskSelectedByStageId[stageId]}
              mappedTasks={state.mappedTasks}
              assignedUsersMap={state.usersMap}
            />
          ))}
        </Wrapper>
      </div>
    );
  }
};

export default Logs;
