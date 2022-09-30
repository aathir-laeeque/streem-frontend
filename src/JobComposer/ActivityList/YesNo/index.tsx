import { Button, Textarea } from '#components';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity, updateExecutedActivity } from '../actions';
import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';

type YesNoActivityState = {
  reason: string;
  selectedId?: string;
  shouldAskForReason: boolean;
  showButtons: boolean;
  shouldCallApi?: boolean;
  isEditing?: boolean;
};

const YesNoActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const dispatch = useDispatch();

  const getSelectedIdByChoices = () => {
    return activity.response?.choices
      ? Object.entries(activity.response?.choices).reduce(
          (acc, [choiceId, choiceValue]) => (choiceValue === Selections.SELECTED ? choiceId : acc),
          '',
        )
      : undefined;
  };

  const [state, setState] = useState<YesNoActivityState>({
    reason: activity?.response?.reason ?? '',
    shouldAskForReason: !!activity?.response?.reason,
    showButtons: activity?.response?.state !== 'EXECUTED',
    selectedId: getSelectedIdByChoices(),
  });

  const dispatchActions = (data: any) => {
    if (isCorrectingError) {
      dispatch(
        fixActivity(
          {
            ...activity,
            data,
          },
          state.reason ? state.reason : undefined,
        ),
      );
    } else {
      dispatch(
        executeActivity(
          {
            ...activity,
            data,
          },
          state.reason ? state.reason : undefined,
        ),
      );
    }
  };

  useEffect(() => {
    if (state.shouldCallApi) {
      if (state.selectedId) {
        if (activity?.response?.choices) {
          const data = activity.data.map((d: any) => ({
            ...d,
            state: d.id === state.selectedId ? Selections.SELECTED : Selections.NOT_SELECTED,
          }));
          if (state.shouldAskForReason) {
            if (state.reason) {
              dispatchActions(data);
            }
          } else {
            dispatchActions(data);
          }
        }
      }
      setState((prev) => ({
        ...prev,
        shouldCallApi: false,
        isEditing: false,
      }));
    } else if (!state.isEditing) {
      const selectedIoFromStore = getSelectedIdByChoices();
      if (state.selectedId !== selectedIoFromStore) {
        setState((prevState) => ({
          ...prevState,
          reason: activity?.response?.reason ?? '',
          shouldAskForReason: !!activity?.response?.reason,
          showButtons: activity?.response?.state !== 'EXECUTED',
          selectedId: selectedIoFromStore,
        }));
      }
    }
  }, [activity?.response?.choices, activity?.response?.reason, state.shouldCallApi]);

  const handleExecution = (id: string) => {
    if (id) {
      dispatch(
        updateExecutedActivity({
          ...activity,
          response: {
            ...activity.response,
            audit: undefined,
            choices: activity.data.reduce((acc: any, d: any) => {
              acc[d.id] = d.id === id ? Selections.SELECTED : Selections.NOT_SELECTED;
              return acc;
            }, {}),
            reason: state.reason,
            state: 'EXECUTED',
          },
        }),
      );
      setState((prevState) => ({
        ...prevState,
        shouldCallApi: true,
        showButtons: false,
      }));
    }
  };

  return (
    <Wrapper>
      <div>{activity.label}</div>
      <div className="buttons-container">
        {activity.data
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((el, index) => {
            const isSelected = state.selectedId === el.id;
            return (
              <div key={index} className="button-item">
                <button
                  className={isSelected ? 'filled' : ''}
                  onClick={() => {
                    if (el.type === 'no') {
                      setState((prevState) => ({
                        ...prevState,
                        showButtons: true,
                        shouldAskForReason: true,
                        isEditing: true,
                        selectedId: el.id,
                      }));
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        reason: '',
                        shouldAskForReason: false,
                        isEditing: true,
                        selectedId: el.id,
                      }));
                      handleExecution(el.id);
                    }
                  }}
                >
                  {el.name}
                </button>
              </div>
            );
          })}
      </div>

      {state.shouldAskForReason ? (
        <div className="decline-reason">
          <Textarea
            allowResize={false}
            label="State your Reason"
            defaultValue={state.reason}
            onChange={debounce(({ value }) => {
              setState((values) => ({
                ...values,
                reason: value,
              }));
            }, 500)}
            rows={4}
          />

          {state.showButtons ? (
            <div className="buttons-container">
              <Button
                variant="secondary"
                color="blue"
                onClick={() => {
                  handleExecution(state.selectedId!);
                }}
              >
                Submit
              </Button>
              <Button
                variant="secondary"
                color="red"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    reason: '',
                    shouldAskForReason: false,
                    selectedId: activity.data.reduce(
                      (acc: any, d: any) => (d.id !== state.selectedId ? d.id : acc),
                      '',
                    ),
                  }))
                }
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </Wrapper>
  );
};

export default YesNoActivity;
