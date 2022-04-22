import { Button1, NumberInput, Textarea } from '#components';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { CheckCircle, Error, Warning } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  approveRejectActivity,
  executeActivity,
  fixActivity,
  updateExecutedActivity,
} from '../actions';
import { ActivityProps, SupervisorResponse } from '../types';
import { Wrapper } from './styles';

const generateText = (data) => {
  if (data.operator === 'BETWEEN') {
    return `${data.parameter} should be between ${data.lowerValue} ${data.uom} and ${data.upperValue} ${data.uom}`;
  } else {
    let operatorString: string;

    switch (data.operator) {
      case 'EQUAL_TO':
        operatorString = '(=) equal to';
        break;
      case 'LESS_THAN':
        operatorString = '(<) less than';
        break;
      case 'LESS_THAN_EQUAL_TO':
        operatorString = '(≤) less than equal to';
        break;
      case 'MORE_THAN':
        operatorString = '(>) more than';
        break;
      case 'MORE_THAN_EQUAL_TO':
        operatorString = '(≥) more than equal to';
        break;
      default:
        return;
    }

    return `${data.parameter} should be ${operatorString} ${
      data?.value ?? 50
    } ${data.uom}`;
  }
};

const checkIsOffLimit = ({
  observedValue,
  desiredValue1,
  desiredValue2,
  operator,
}: {
  observedValue: number | null;
  desiredValue1: number;
  desiredValue2?: number;
  operator: string;
}) => {
  if (!observedValue) {
    return false;
  } else {
    switch (operator) {
      case 'EQUAL_TO':
        if (!(observedValue === desiredValue1)) {
          return true;
        }
        break;
      case 'LESS_THAN':
        if (!(observedValue < desiredValue1)) {
          return true;
        }
        break;
      case 'LESS_THAN_EQUAL_TO':
        if (!(observedValue <= desiredValue1)) {
          return true;
        }
        break;
      case 'MORE_THAN':
        if (!(observedValue > desiredValue1)) {
          return true;
        }
        break;
      case 'MORE_THAN_EQUAL_TO':
        if (!(observedValue >= desiredValue1)) {
          return true;
        }
        break;
      case 'BETWEEN':
        if (
          !(observedValue >= desiredValue1 && observedValue <= desiredValue2)
        ) {
          return true;
        }
      default:
        return false;
    }
  }
};

const ShouldBeActivity: FC<ActivityProps> = ({
  activity,
  isCorrectingError,
}) => {
  const {
    auth: { profile },
    composer: { entityId: jobId },
  } = useTypedSelector((state) => state);

  const numberInputRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useDispatch();

  const [state, setState] = useState({
    approvalTime: activity?.response?.activityValueApprovalDto?.createdAt,
    approver: activity?.response?.activityValueApprovalDto?.approver,
    isApprovalPending: activity?.response?.state === 'PENDING_FOR_APPROVAL',
    isApproved: activity?.response?.activityValueApprovalDto
      ? activity?.response?.activityValueApprovalDto?.state === 'APPROVED'
      : undefined,
    isExecuted: activity?.response?.state === 'EXECUTED',
    isOffLimit: checkIsOffLimit({
      observedValue: parseFloat(activity?.response?.value) ?? null,
      operator: activity?.data?.operator,
      ...(activity?.data?.operator === 'BETWEEN'
        ? {
            desiredValue1: parseFloat(activity?.data?.lowerValue),
            desiredValue2: parseFloat(activity?.data?.upperValue),
          }
        : { desiredValue1: parseFloat(activity?.data?.value) }),
    }),
    isUserSupervisor: profile?.roles?.some(
      (role) => role.name === 'SUPERVISOR',
    ),
    isValueChanged: false,
    reason: activity?.response?.reason ?? '',
    value: activity?.response?.value ?? null,
    shouldCallApi: false,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      approvalTime: activity?.response?.activityValueApprovalDto?.createdAt,
      approver: activity?.response?.activityValueApprovalDto?.approver,
      isApprovalPending: activity?.response?.state === 'PENDING_FOR_APPROVAL',
      isApproved: activity?.response?.activityValueApprovalDto
        ? activity?.response?.activityValueApprovalDto?.state === 'APPROVED'
        : undefined,
      isExecuted: activity?.response?.state === 'EXECUTED',
      isOffLimit: checkIsOffLimit({
        observedValue:
          prevState.value !== activity?.response?.value
            ? prevState.value
            : parseFloat(activity?.response?.value) ?? null,
        operator: activity?.data?.operator,
        ...(activity?.data?.operator === 'BETWEEN'
          ? {
              desiredValue1: parseFloat(activity?.data?.lowerValue),
              desiredValue2: parseFloat(activity?.data?.upperValue),
            }
          : { desiredValue1: parseFloat(activity?.data?.value) }),
      }),
      isValueChanged: prevState.value !== activity?.response?.value,
      reason:
        prevState.reason !== activity?.response?.reason
          ? prevState.reason
          : activity?.response?.reason ?? '',
      value:
        prevState.value !== activity?.response?.value
          ? prevState.value
          : activity?.response?.value ?? null,
    }));
  }, [activity]);

  useEffect(() => {
    if (state.shouldCallApi) {
      if (state.value || state.reason) {
        if (isCorrectingError) {
          dispatch(
            fixActivity(
              {
                ...activity,
                data: { ...activity.data, input: state.value },
              },
              state.reason ? state.reason : undefined,
            ),
          );
        } else {
          dispatch(
            executeActivity(
              {
                ...activity,
                data: { ...activity.data, input: state.value },
              },
              state.reason ? state.reason : undefined,
            ),
          );
        }
      }
      setState((prev) => ({
        ...prev,
        shouldCallApi: false,
      }));
    }
  }, [
    activity?.response?.value,
    activity?.response?.reason,
    state.shouldCallApi,
  ]);

  const renderSubmitButtons = () => (
    <div className="buttons-container">
      <Button1
        variant="secondary"
        color="blue"
        onClick={() => handleExecution(state.value, true)}
        disabled={state.isApprovalPending}
      >
        Submit
      </Button1>
      <Button1
        variant="secondary"
        color="red"
        onClick={() => {
          setState((prevState) => ({
            ...prevState,
            isOffLimit: checkIsOffLimit({
              observedValue: parseFloat(activity?.response?.value) ?? null,
              operator: activity?.data?.operator,
              ...(activity?.data?.operator === 'BETWEEN'
                ? {
                    desiredValue1: parseFloat(activity?.data?.lowerValue),
                    desiredValue2: parseFloat(activity?.data?.upperValue),
                  }
                : { desiredValue1: parseFloat(activity?.data?.value) }),
            }),
            value: activity?.response?.value,
            reason: activity?.response?.reason,
            isValueChanged: false,
          }));
          if (numberInputRef && numberInputRef.current) {
            numberInputRef.current.value = activity?.response?.value;
          }
          if (reasonRef && reasonRef.current) {
            reasonRef.current.value = activity?.response?.reason;
          }
        }}
        disabled={state.isApprovalPending}
      >
        Cancel
      </Button1>
    </div>
  );

  const renderApprovalButtons = () => (
    <div className="buttons-container">
      <Button1
        variant="secondary"
        color="blue"
        onClick={() => {
          dispatch(
            approveRejectActivity({
              jobId,
              activityId: activity.id,
              type: SupervisorResponse.APPROVE,
            }),
          );
        }}
      >
        Approve
      </Button1>
      <Button1
        variant="secondary"
        color="red"
        onClick={() => {
          dispatch(
            approveRejectActivity({
              jobId,
              activityId: activity.id,
              type: SupervisorResponse.REJECT,
            }),
          );
        }}
      >
        Reject
      </Button1>
    </div>
  );

  const handleExecution = (value: number, withReason = false) => {
    dispatch(
      updateExecutedActivity({
        ...activity,
        response: {
          ...activity.response,
          ...(value !== activity.response.value && { audit: undefined }),
          value,
          reason: state.reason,
          state: state.reason ? 'PENDING_FOR_APPROVAL' : 'EXECUTED',
        },
      }),
    );
    setState((prevState) => ({
      ...prevState,
      shouldCallApi: true,
    }));
  };

  return (
    <Wrapper>
      {state.isApprovalPending ? (
        <span className="pending-approval">
          <Warning className="icon" />
          {state.isUserSupervisor
            ? 'This Activity Needs Approval'
            : 'Pending Approval from Supervisor'}
        </span>
      ) : null}

      {state.isApproved === true ? (
        <span className="approved">
          <CheckCircle className="icon" />
          Observation Approved by {getFullName(state.approver)} on{' '}
          {formatDateTime(state.approvalTime, 'MMM D, YYYY h:mm A')}
        </span>
      ) : state.isApproved === false ? (
        <span className="rejected">
          <Error className="icon" />
          Observation rejected by {getFullName(state.approver)} on{' '}
          {formatDateTime(state.approvalTime, 'MMM D, YYYY h:mm A')}
        </span>
      ) : null}

      <span className="parameter-text">{generateText(activity?.data)}</span>

      <NumberInput
        defaultValue={state.value}
        onChange={debounce(({ value }) => {
          setState((prevState) => ({
            ...prevState,
            value,
            isValueChanged: prevState.value !== value,
          }));
          switch (activity?.data?.operator) {
            case 'EQUAL_TO':
              if (!(parseFloat(value) === parseFloat(activity?.data?.value))) {
                setState((prevState) => ({ ...prevState, isOffLimit: true }));
              } else {
                handleExecution(value);
              }
              break;
            case 'LESS_THAN':
              if (!(parseFloat(value) < parseFloat(activity?.data?.value))) {
                setState((prevState) => ({ ...prevState, isOffLimit: true }));
              } else {
                handleExecution(value);
              }
              break;
            case 'LESS_THAN_EQUAL_TO':
              if (!(parseFloat(value) <= parseFloat(activity?.data?.value))) {
                setState((prevState) => ({ ...prevState, isOffLimit: true }));
              } else {
                handleExecution(value);
              }
              break;
            case 'MORE_THAN':
              if (!(parseFloat(value) > parseFloat(activity?.data?.value))) {
                setState((prevState) => ({ ...prevState, isOffLimit: true }));
              } else {
                handleExecution(value);
              }
              break;
            case 'MORE_THAN_EQUAL_TO':
              if (!(parseFloat(value) >= parseFloat(activity?.data?.value))) {
                setState((prevState) => ({ ...prevState, isOffLimit: true }));
              } else {
                handleExecution(value);
              }
              break;
            case 'BETWEEN':
              if (
                !(
                  parseFloat(value) >= parseFloat(activity?.data?.lowerValue) &&
                  parseFloat(value) <= parseFloat(activity?.data?.upperValue)
                )
              ) {
                setState((prevState) => ({ ...prevState, isOffLimit: true }));
              } else {
                handleExecution(value);
              }
              break;
            default:
              setState((prevState) => ({ ...prevState, isOffLimit: false }));
          }
        }, 500)}
        placeholder="Enter Observed Value"
        ref={numberInputRef}
      />

      {state.isOffLimit ? (
        <div className="off-limit-reason">
          <div className="warning">Warning! {generateText(activity?.data)}</div>

          <Textarea
            defaultValue={state.reason}
            disabled={!state.isValueChanged}
            label="State your Reason"
            onChange={debounce(({ value }) => {
              setState((prevState) => ({ ...prevState, reason: value }));
            }, 500)}
            placeholder="Reason for change"
            ref={reasonRef}
            rows={4}
          />

          {(() => {
            if (state.isUserSupervisor) {
              if (state.isApprovalPending) {
                return renderApprovalButtons();
              } else if (state.isOffLimit && state.isValueChanged) {
                return renderSubmitButtons();
              } else if (
                activity?.response?.state === 'BEING_EXECUTED_AFTER_REJECTED' ||
                activity?.response?.state === 'BEING_EXECUTED_AFTER_APPROVAL' ||
                state.isExecuted
              ) {
                return null;
              }
            } else {
              if (state.isValueChanged) {
                return renderSubmitButtons();
              } else {
                return null;
              }
            }
          })()}
        </div>
      ) : null}
    </Wrapper>
  );
};

export default ShouldBeActivity;
