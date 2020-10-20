import { Button1, Textarea } from '#components';
import { get, debounce } from 'lodash';
import React, { FC, useState } from 'react';
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
  });

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
                        status:
                          e.id === el.id
                            ? Selections.SELECTED
                            : Selections.NOT_SELECTED,
                      })),
                    };

                    console.log('type :: ', el.type);

                    if (el.type === 'no') {
                      console.log('handle no part :: ', newData);
                      setState((values) => ({
                        ...values,
                        newData,
                        shouldAskForReason: true,
                      }));
                    } else {
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
            disabled={activity?.response?.status === 'EXECUTED'}
          />

          <div
            className={`buttons-container ${
              activity?.response?.status === 'EXECUTED' ? 'hide' : ''
            }`}
          >
            <Button1
              variant="secondary"
              color="blue"
              onClick={() => {
                if (isCorrectingError) {
                  dispatch(fixActivity(state.newData));
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
              onClick={() => console.log('cancel')}
            >
              Cancel
            </Button1>
          </div>
        </div>
      ) : null}
    </Wrapper>
  );
};

export default YesNoActivity;
