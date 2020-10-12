import { BaseModal, Select } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Task, TimerOperator } from '#Composer-new/checklist.types';
import { ArrowDropDown, ArrowDropUp, Delete } from '@material-ui/icons';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { removeTaskTimer, setTaskTimer } from '../Tasks/actions';

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
  const [duration, setDuration] = useState(moment.duration(value, 'seconds'));

  useEffect(() => {
    setValue(duration.asSeconds());
  }, [duration]);

  useEffect(() => {
    setDuration(moment.duration(value, 'seconds'));
  }, [value]);

  return (
    <div className="input-group">
      <InputField
        value={duration.hours()}
        unit="Hr"
        increase={() => {
          setDuration(moment.duration(duration.add(1, 'hour'), 'seconds'));
        }}
        decrease={() => {
          setDuration(moment.duration(duration.subtract(1, 'hour'), 'seconds'));
        }}
      />
      <InputField
        value={duration.minutes()}
        unit="Min"
        increase={() => {
          setDuration(moment.duration(duration.add(1, 'minute'), 'seconds'));
        }}
        decrease={() => {
          setDuration(
            moment.duration(duration.subtract(1, 'minute'), 'seconds'),
          );
        }}
      />
      <InputField
        value={duration.seconds()}
        unit="Sec"
        increase={() => {
          setDuration(moment.duration(duration.add(1, 'second'), 'seconds'));
        }}
        decrease={() => {
          setDuration(
            moment.duration(duration.subtract(1, 'second'), 'seconds'),
          );
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

const TimedTaskConfig: FC<CommonOverlayProps<TimedTaskConfigProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    maxPeriod: maxPeriodValue = 0,
    minPeriod: minPeriodValue = 0,
    taskId,
    timerOperator: timerOperatorValue = TimerOperator.LESS_THAN,
  },
}) => {
  const dispatch = useDispatch();

  const [hasChanged, setHasChanged] = useState(false);
  const [timerOperator, setTimerOperator] = useState(
    TIMER_OPERATORS.find((el) => el.value === timerOperatorValue),
  );
  const [minPeriod, setMinPeriod] = useState<number>(minPeriodValue);
  const [maxPeriod, setMaxPeriod] = useState<number>(maxPeriodValue);

  useEffect(() => {
    if (hasChanged) {
      if (
        timerOperator?.value === TimerOperator.NOT_LESS_THAN &&
        maxPeriod &&
        minPeriod
      ) {
        dispatch(
          setTaskTimer({
            maxPeriod,
            minPeriod,
            taskId,
            timerOperator: timerOperator?.value as TimerOperator,
          }),
        );
      }

      if (timerOperator?.value === TimerOperator.LESS_THAN && maxPeriod) {
        dispatch(
          setTaskTimer({
            maxPeriod,
            taskId,
            timerOperator: timerOperator?.value as TimerOperator,
          }),
        );
      }
    }
  }, [maxPeriod, minPeriod]);

  useEffect(() => {
    return () => {
      setHasChanged(false);
    };
  }, []);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
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
              onChange={(option) => setTimerOperator(option)}
              placeHolder="Choose an option"
              selectedValue={timerOperator}
            />
          </div>

          {timerOperator ? (
            <div className="timer-values">
              {timerOperator.value === TimerOperator.LESS_THAN ? (
                <div className="timer-value">
                  <label>{timerOperator.label}</label>
                  <InputGroup
                    value={maxPeriod}
                    setValue={debounce((val) => {
                      setMaxPeriod(val);
                      setHasChanged(true);
                    }, 500)}
                  />
                </div>
              ) : (
                <>
                  <div className="timer-value">
                    <label>Set Minimum time </label>
                    <InputGroup
                      value={minPeriod}
                      setValue={debounce((val) => {
                        setMinPeriod(val);
                        setHasChanged(true);
                      }, 500)}
                    />
                  </div>
                  <div className="timer-value">
                    <label>Set Maximum time </label>
                    <InputGroup
                      value={maxPeriod}
                      setValue={debounce((val) => {
                        setMaxPeriod(val);
                        setHasChanged(true);
                      }, 500)}
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
