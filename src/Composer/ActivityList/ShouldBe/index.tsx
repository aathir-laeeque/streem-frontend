import { Button1, Textarea, TextInput } from '#components';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { CheckCircle, Error, Warning } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
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
  console.log('activity :: ', activity);
  const { entityId: jobId } = useTypedSelector((state) => state.composer);

  const { profile } = useTypedSelector((state) => state.auth);

  const [state, setState] = useState({
    showOperatorSubmitButtons: false,
    shouldShowReason: !!activity?.response?.reason,
    reason: activity?.response?.reason ?? '',
    value: activity?.response?.value,
  });

  const isLoggedInUserSpervisor = profile?.roles?.some(
    (role) => role.name === 'SUPERVISOR',
  );

  const dispatch = useDispatch();

  const isActivityPendingApproval =
    activity?.response?.state === 'PENDING_FOR_APPROVAL';

  const isActivityApproved = activity?.response?.activityValueApprovalDto
    ? activity?.response?.activityValueApprovalDto?.state === 'APPROVED'
    : undefined;

  const approver = activity?.response?.activityValueApprovalDto?.approver;
  const approvalTime = activity?.response?.activityValueApprovalDto?.createdAt;

  return (
    <Wrapper>
      {isActivityPendingApproval ? (
        <span className="pending-approval">
          <Warning className="icon" />
          {isLoggedInUserSpervisor
            ? 'This Activity Needs Approval'
            : 'Pending Approval from Supervisor'}
        </span>
      ) : null}

      {isActivityApproved === true ? (
        <span className="approved">
          <CheckCircle className="icon" />
          Observation Approved by {getFullName(approver)} on{' '}
          {formatDateTime(approvalTime, 'MMM D, YYYY h:mm A')}
        </span>
      ) : isActivityApproved === false ? (
        <span className="rejected">
          <Error className="icon" />
          Observation rejected by {getFullName(approver)} on{' '}
          {formatDateTime(approvalTime, 'MMM D, YYYY h:mm A')}
        </span>
      ) : null}

      <span className="parameter-text">{generateText(activity.data)}</span>

      <TextInput
        type="number"
        placeholder="Enter Observed Value"
        defaultValue={state.value}
        onChange={debounce(({ value: newValue }) => {
          switch (activity?.data?.operator) {
            case 'EQUAL_TO':
              if (newValue === activity?.data?.value) {
                setState({
                  showOperatorSubmitButtons: false,
                  reason: '',
                  shouldShowReason: false,
                  value: newValue,
                });

                if (isCorrectingError) {
                  dispatch(
                    fixActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                } else {
                  dispatch(
                    executeActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                }
              } else {
                setState((val) => ({
                  ...val,
                  showOperatorSubmitButtons: true,
                  shouldShowReason: true,
                  value: newValue,
                }));
              }
              break;
            case 'LESS_THAN':
              if (newValue < activity?.data?.value) {
                setState({
                  showOperatorSubmitButtons: false,
                  reason: '',
                  shouldShowReason: false,
                  value: newValue,
                });

                if (isCorrectingError) {
                  dispatch(
                    fixActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                } else {
                  dispatch(
                    executeActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                }
              } else {
                setState((val) => ({
                  ...val,
                  showOperatorSubmitButtons: true,
                  shouldShowReason: true,
                  value: newValue,
                }));
              }
              break;
            case 'LESS_THAN_EQUAL_TO':
              if (newValue <= activity?.data?.value) {
                setState({
                  showOperatorSubmitButtons: false,
                  reason: '',
                  shouldShowReason: false,
                  value: newValue,
                });

                if (isCorrectingError) {
                  dispatch(
                    fixActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                } else {
                  dispatch(
                    executeActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                }
              } else {
                setState((val) => ({
                  ...val,
                  showOperatorSubmitButtons: true,
                  shouldShowReason: true,
                  value: newValue,
                }));
              }
              break;
            case 'MORE_THAN':
              if (newValue > activity?.data?.value) {
                setState({
                  reason: '',
                  showOperatorSubmitButtons: false,
                  shouldShowReason: false,
                  value: newValue,
                });

                if (isCorrectingError) {
                  dispatch(
                    fixActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                } else {
                  dispatch(
                    executeActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                }
              } else {
                setState((val) => ({
                  ...val,
                  showOperatorSubmitButtons: true,
                  shouldShowReason: true,
                  value: newValue,
                }));
              }
              break;
            case 'MORE_THAN_EQUAL_TO':
              if (newValue >= activity?.data?.value) {
                setState({
                  reason: '',
                  showOperatorSubmitButtons: false,
                  shouldShowReason: false,
                  value: newValue,
                });

                if (isCorrectingError) {
                  dispatch(
                    fixActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                } else {
                  dispatch(
                    executeActivity({
                      ...activity,
                      data: { ...activity.data, input: newValue },
                    }),
                  );
                }
              } else {
                setState((val) => ({
                  ...val,
                  showOperatorSubmitButtons: true,
                  shouldShowReason: true,
                  value: newValue,
                }));
              }
              break;
            default:
              break;
          }
        }, 500)}
      />

      {state.shouldShowReason ? (
        <div className="off-limit-reason">
          <div className="warning">Warning! {generateText(activity?.data)}</div>

          <Textarea
            label="State your reason"
            defaultValue={state.reason}
            disabled={isActivityApproved || isLoggedInUserSpervisor}
            onChange={debounce(({ value }) => {
              setState((val) => ({
                ...val,
                reason: value,
              }));
            }, 500)}
            placeholder="Reason for change"
            rows={4}
          />

          {isActivityPendingApproval && isLoggedInUserSpervisor ? (
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
          ) : null}

          {!isActivityApproved && !isLoggedInUserSpervisor ? (
            <div className="buttons-container">
              <Button1
                variant="secondary"
                color="blue"
                onClick={() => {
                  if (isCorrectingError) {
                    dispatch(
                      fixActivity({
                        ...activity,
                        data: { ...activity.data, input: state.value },
                      }),
                    );
                  } else {
                    dispatch(
                      executeActivity(
                        {
                          ...activity,
                          data: { ...activity.data, input: state.value },
                        },
                        state.reason,
                      ),
                    );
                  }
                }}
              >
                Submit
              </Button1>
              <Button1
                variant="secondary"
                color="red"
                onClick={() => {
                  setState((val) => ({
                    ...val,
                    reason: '',
                    shouldShowReason: false,
                  }));
                }}
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

export default ShouldBeActivity;
