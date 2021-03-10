import { BaseModal, Select } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Task, TimerOperator } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store/helpers';
import { Error } from '#utils/globalTypes';
import {
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  Error as ErrorIcon,
} from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useEffect, useReducer, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { TaskTimerErrorCodes } from '../Tasks/types';

import {
  removeTaskTimer,
  resetTaskError,
  setTaskTimer,
} from '../Tasks/actions';

const TIMER_OPERATORS = [
  {
    label: 'Complete the task under set time',
    value: TimerOperator.LESS_THAN,
  },
  {
    label: 'Perform the task Not Less than set time',
    value: TimerOperator.NOT_LESS_THAN,
  },
];

const Wrapper = styled.div`
  .modal {
    min-width: 450px !important;
    overflow: visible !important;
    padding: 0;

    &-body {
      padding: 0 !important;
    }
  }

  .header {
    align-items: center;
    background-color: #fafafa;
    color: #000000;
    display: flex;
    font-size: 20px;
    font-weight: bold;
    padding: 16px 24px;
  }

  .body {
    display: flex;
    flex-direction: column;
    position: relative;

    .select {
      &-label {
        text-align: start;
      }
    }

    > .icon {
      position: absolute;
      right: 24px;
      top: 24px;
      z-index: 1;
    }

    .timer-option {
      padding: 24px;
    }

    .timer-values {
      border-top: 1px solid #eeeeee;
      display: flex;
      flex-direction: column;
      padding: 24px;

      .config-error {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .icon {
          color: #ff6b6b;
          font-size: 18px;
          margin-right: 8px;
        }

        .error-msg {
          color: #ff6b6b;
          font-size: 12px;
        }
      }

      .timer-value {
        align-items: flex-start;
        display: flex;
        flex-direction: column;

        label {
          display: block;
          margin-bottom: 8px;
        }

        .input-group {
          display: flex;
          margin-bottom: 16px;
          width: 100%;

          &-item {
            align-items: center;
            background-color: #f4f4f4;
            display: flex;
            flex: 1;
            justify-content: space-between;
            margin-right: 16px;

            :last-child {
              margin-right: 0;
            }

            span {
              border: 1px solid transparent;
              border-bottom-color: #bababa;
              padding: 10px;
              text-align: center;
            }
          }
        }
      }
    }
  }
`;

type InputGroupProps = {
  value: number;
  setValue: (value: number) => void;
};

type InputFieldProps = {
  increase: () => void;
  decrease: () => void;
  unit: 'Hr' | 'Min' | 'Sec';
  value: number;
};

const InputField: FC<InputFieldProps> = ({
  decrease,
  increase,
  unit,
  value,
}) => (
  <div className="input-group-item">
    <ArrowDropUp className="icon" id="increase" onClick={() => increase()} />
    <span>{`${value.toString().padStart(2, '0')} ${unit}`}</span>
    <ArrowDropDown className="icon" id="decrease" onClick={() => decrease()} />
  </div>
);

const InputGroup: FC<InputGroupProps> = ({ setValue, value }) => {
  const duration = moment.duration(value, 'seconds');

  return (
    <div className="input-group">
      <InputField
        value={duration.hours()}
        unit="Hr"
        increase={() => {
          setValue(
            moment.duration(duration.add(1, 'hour'), 'seconds').asSeconds(),
          );
        }}
        decrease={() => {
          if (duration.hours() > 0) {
            setValue(
              moment
                .duration(duration.subtract(1, 'hour'), 'seconds')
                .asSeconds(),
            );
          }
        }}
      />
      <InputField
        value={duration.minutes()}
        unit="Min"
        increase={() => {
          setValue(
            moment.duration(duration.add(1, 'minute'), 'seconds').asSeconds(),
          );
        }}
        decrease={() => {
          if (duration.minutes() > 0) {
            setValue(
              moment
                .duration(duration.subtract(1, 'minute'), 'seconds')
                .asSeconds(),
            );
          }
        }}
      />
      <InputField
        value={duration.seconds()}
        unit="Sec"
        increase={() => {
          setValue(
            moment.duration(duration.add(1, 'second'), 'seconds').asSeconds(),
          );
        }}
        decrease={() => {
          if (duration.seconds() > 0) {
            setValue(
              moment
                .duration(duration.subtract(1, 'second'), 'seconds')
                .asSeconds(),
            );
          }
        }}
      />
    </div>
  );
};

type TimedTaskConfigProps = {
  maxPeriod: Task['maxPeriod'];
  minPeriod: Task['minPeriod'];
  taskId: Task['id'];
  timerOperator: Task['timerOperator'];
};

type TimerState = {
  maxPeriod: number;
  minPeriod: number;
  timerOperator: TimerOperator;
  hasChanged: boolean;
  error: Error | string | null | undefined;
};

const reducer = (state: TimerState, action: any): TimerState => {
  switch (action.type) {
    case 'UPDATE_MIN_PERIOD':
    case 'UPDATE_MAX_PERIOD':
    case 'UPDATE_TIMER_OPERATOR':
    case 'TIMER_CONFIG_ERROR':
    case 'RESET':
      return { ...state, ...action.payload };

    default:
      return { ...state };
  }
};

const TimedTaskConfig: FC<CommonOverlayProps<TimedTaskConfigProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    maxPeriod = 0,
    minPeriod = 0,
    taskId,
    timerOperator = TimerOperator.LESS_THAN,
  },
}) => {
  const dispatch = useDispatch();
  const taskErrors = useTypedSelector(
    (state) => state.prototypeComposer.tasks.listById[taskId].errors,
  );

  const [state, localDispatch] = useReducer(reducer, {
    minPeriod,
    maxPeriod,
    timerOperator,
    hasChanged: false,
    error: null,
  });

  const timeout = useRef<null | number>(null);

  useEffect(() => {
    localDispatch({
      type: 'TIMER_CONFIG_ERROR',
      payload: {
        error: taskErrors.find((el) => el.code in TaskTimerErrorCodes)?.message,
      },
    });
  }, [taskErrors]);

  useEffect(() => {
    if (state.hasChanged && !state.error) {
      if (timeout.current) clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        console.log('make api call with the new state  :: ', state);

        if (state.timerOperator === TimerOperator.NOT_LESS_THAN) {
          dispatch(
            setTaskTimer({
              taskId,
              minPeriod: state.minPeriod,
              maxPeriod: state.maxPeriod,
              timerOperator: state.timerOperator,
            }),
          );
          localDispatch({ type: 'RESET', payload: { hasChanged: false } });
        }
        if (state.timerOperator === TimerOperator.LESS_THAN) {
          dispatch(
            setTaskTimer({
              taskId,
              maxPeriod: state.maxPeriod,
              timerOperator: state.timerOperator,
            }),
          );
          localDispatch({ type: 'RESET', payload: { hasChanged: false } });
        }
      }, 500);
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [state]);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={() => {
          dispatch(resetTaskError(taskId));
          closeAllOverlays();
        }}
        closeModal={() => {
          dispatch(resetTaskError(taskId));
          closeOverlay();
        }}
        showHeader={false}
        showFooter={false}
      >
        <div className="header">Time your Task</div>
        <div className="body">
          <Delete
            className="icon"
            fontSize="small"
            onClick={() => dispatch(removeTaskTimer(taskId))}
          />
          <div className="timer-option">
            <Select
              label="Select Condition"
              options={TIMER_OPERATORS}
              onChange={(option) => {
                localDispatch({
                  type: 'UPDATE_TIMER_OPERATOR',
                  payload: {
                    timerOperator: option.value,
                    minPeriod: 0,
                    maxPeriod: 0,
                    error: null,
                    hasChanged: false,
                  },
                });
              }}
              placeholder="Choose an option"
              selectedValue={TIMER_OPERATORS.find(
                (el) => el.value === state.timerOperator,
              )}
            />
          </div>

          {timerOperator ? (
            <div className="timer-values">
              {state.error ? (
                <div className="config-error">
                  <ErrorIcon className="icon" />
                  <span className="error-msg">{state.error}</span>
                </div>
              ) : null}

              {state.timerOperator === TimerOperator.LESS_THAN ? (
                <div className="timer-value">
                  <label>Complete the task under set time</label>
                  <InputGroup
                    value={state.maxPeriod}
                    setValue={(val) => {
                      localDispatch({
                        type: 'UPDATE_MAX_PERIOD',
                        payload: {
                          maxPeriod: val,
                          hasChanged: true,
                          error: null,
                        },
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="timer-value">
                    <label>Set Minimum time </label>
                    <InputGroup
                      value={state.minPeriod}
                      setValue={(val) => {
                        localDispatch({
                          type: 'UPDATE_MIN_PERIOD',
                          payload: {
                            minPeriod: val,
                            hasChanged: true,
                            ...(state.maxPeriod < val
                              ? {
                                  error:
                                    'Error: Maximum time cannot be less than Minimum time',
                                }
                              : { error: null }),
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="timer-value">
                    <label>Set Maximum time </label>
                    <InputGroup
                      value={state.maxPeriod}
                      setValue={(val) => {
                        localDispatch({
                          type: 'UPDATE_MAX_PERIOD',
                          payload: {
                            maxPeriod: val,
                            hasChanged: true,
                            ...(state.minPeriod > val
                              ? {
                                  error:
                                    'Error: Maximum time cannot be less than Minimum time',
                                }
                              : { error: null }),
                          },
                        });
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TimedTaskConfig;
