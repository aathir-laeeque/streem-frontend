import { Button1, NumberInput, Textarea, TextInput } from '#components';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { CheckCircle, Error, Warning } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  approveRejectActivity,
  executeActivity,
  fixActivity,
} from '../actions';
import { ActivityProps, SupervisorResponse } from '../types';
import { Wrapper } from './styles';

const generateText = (data) => {
  if (data.operator === 'IS_BETWEEN') {
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

const ShouldBeActivity: FC<ActivityProps> = ({
  activity,
  isCorrectingError,
}) => {
  const dispatch = useDispatch();

  const {
    auth: { profile },
    composer: { entityId: jobId },
  } = useTypedSelector((state) => state);

  const [state, setState] = useState({
    isApprovalPending: activity?.response?.state === 'PENDING_FOR_APPROVAL',
    isApproved: activity?.response?.activityValueApprovalDto
      ? activity?.response?.activityValueApprovalDto?.state === 'APPROVED'
      : undefined,
    isExecuted: activity?.response?.state === 'EXECUTED',
    isOffLimit: false,
    isUserSupervisor: profile?.roles?.some(
      (role) => role.name === 'SUPERVISOR',
    ),
    reason: activity?.response?.reason ?? '',
    shouldAskForReason: !!activity?.response?.reason,
    value: activity?.response?.value,

    approver: activity?.response?.activityValueApprovalDto?.approver,
    approvalTime: activity?.response?.activityValueApprovalDto?.createdAt,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isApprovalPending: activity?.response?.state === 'PENDING_FOR_APPROVAL',
      isApproved: activity?.response?.activityValueApprovalDto
        ? activity?.response?.activityValueApprovalDto?.state === 'APPROVED'
        : undefined,
      isExecuted: activity?.response?.state === 'EXECUTED',
      reason: activity?.response?.reason ?? '',
      shouldAskForReason: !!activity?.response?.reason,
      value: activity?.response?.value,
      approver: activity?.response?.activityValueApprovalDto?.approver,
      approvalTime: activity?.response?.activityValueApprovalDto?.createdAt,
    }));
  }, [activity]);

  const execute = (value: number, withReason = false) => {
    if (!isCorrectingError) {
      dispatch(
        executeActivity(
          {
            ...activity,
            data: { ...activity.data, input: value },
          },
          withReason ? state.reason : undefined,
        ),
      );
    } else {
      dispatch(
        fixActivity(
          {
            ...activity,
            data: { ...activity.data, input: value },
          },
          withReason ? state.reason : undefined,
        ),
      );
    }
  };

  const handleOffLimit = () => {
    setState((prevState) => ({
      ...prevState,
      shouldAskForReason: true,
      isOffLimit: true,
    }));
  };

  const renderSubmitButtons = () => (
    <div className="buttons-container">
      <Button1
        variant="secondary"
        color="blue"
        onClick={() => execute(state.value, true)}
        disabled={state.isApprovalPending}
      >
        Submit
      </Button1>
      <Button1
        variant="secondary"
        color="red"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            reason: '',
            shouldAskForReason: false,
            value: null,
          }))
        }
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
      <span className="parameter-text">{generateText(activity.data)}</span>

      <NumberInput
        placeholder="Enter Observed Value"
        defaultValue={state.value}
        onChange={debounce(({ value }) => {
          setState((prevState) => ({ ...prevState, value }));
          switch (activity?.data?.operator) {
            case 'EQUAL_TO':
              if (parseFloat(value) === parseFloat(activity?.data?.value)) {
                execute(value);
              } else {
                handleOffLimit();
              }
              break;
            case 'LESS_THAN':
              if (parseFloat(value) < parseFloat(activity?.data?.value)) {
                execute(value);
              } else {
                handleOffLimit();
              }
              break;
            case 'LESS_THAN_EQUAL_TO':
              if (parseFloat(value) <= parseFloat(activity?.data?.value)) {
                execute(value);
              } else {
                handleOffLimit();
              }
              break;
            case 'MORE_THAN':
              if (parseFloat(value) > parseFloat(activity?.data?.value)) {
                execute(value);
              } else {
                handleOffLimit();
              }
              break;
            case 'MORE_THAN_EQUAL_TO':
              if (parseFloat(value) >= parseFloat(activity?.data?.value)) {
                execute(value);
              } else {
                handleOffLimit();
              }
              break;
            default:
              break;
          }
        }, 1000)}
      />

      {state.shouldAskForReason ? (
        <div className="off-limit-reason">
          <div className="warning">Warning! {generateText(activity?.data)}</div>

          <Textarea
            defaultValue={state.reason}
            label="State your Reason"
            onChange={debounce(({ value }) => {
              setState((prevState) => ({ ...prevState, reason: value }));
            }, 500)}
            placeholder="Reason for change"
            rows={4}
          />

          {(() => {
            if (state.isUserSupervisor) {
              if (state.isOffLimit) {
                return renderSubmitButtons();
              } else if (state.isApprovalPending) {
                return renderApprovalButtons();
              } else {
                return null;
              }
            } else {
              if (state.isOffLimit) {
                return renderSubmitButtons();
              } else if (state.isApproved || state.isExecuted) {
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
