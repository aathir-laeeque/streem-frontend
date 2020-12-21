import { Button1, Textarea } from '#components';
import { debounce, get } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity, fixActivity } from '../actions';
import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';

const YesNoActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    newData: {},
    reason: activity?.response?.reason ?? '',
    shouldAskForReason: !!activity?.response?.reason,
    showButtons: activity?.response?.state !== 'EXECUTED',
  });

  useEffect(() => {
    setState({
      newData: {},
      reason: activity?.response?.reason ?? '',
      shouldAskForReason: !!activity?.response?.reason,
      showButtons: activity?.response?.state !== 'EXECUTED',
    });
  }, [activity]);

  return (
    <Wrapper>
      <div>{activity.label}</div>
      <div className="buttons-container">
        {activity.data
          .sort((a, b) => (a.type > b.type ? -1 : 1))
          .map((el, index) => {
            const isSelected =
              get(activity?.response?.choices, el.id) === Selections.SELECTED;

            return (
              <div key={index} className="button-item">
                <button
                  className={isSelected ? 'filled' : ''}
                  onClick={() => {
                    const newData = {
                      ...activity,
                      data: activity.data.map((e: any) => ({
                        ...e,
                        state:
                          e.id === el.id
                            ? Selections.SELECTED
                            : Selections.NOT_SELECTED,
                      })),
                    };

                    if (el.type === 'no') {
                      setState((values) => ({
                        ...values,
                        newData,
                        showButtons: true,
                        shouldAskForReason: true,
                      }));
                    } else {
                      setState((val) => ({
                        ...val,
                        reason: '',
                        shouldAskForReason: false,
                      }));
                      if (isCorrectingError) {
                        dispatch(fixActivity(newData));
                      } else {
                        dispatch(executeActivity(newData));
                      }
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
              <Button1
                variant="secondary"
                color="blue"
                onClick={() => {
                  if (isCorrectingError) {
                    dispatch(fixActivity(state.newData, state.reason));
                  } else {
                    dispatch(executeActivity(state.newData, state.reason));
                  }
                }}
              >
                Submit
              </Button1>
              <Button1
                variant="secondary"
                color="red"
                onClick={() =>
                  setState((val) => ({
                    ...val,
                    reason: '',
                    shouldAskForReason: false,
                  }))
                }
              >
                Cancel
              </Button1>
            </div>
          ) : null}
        </div>
      ) : null}
    </Wrapper>
  );
};

export default YesNoActivity;
