import { Button, TextInput, Textarea } from '#components';
import { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { ParameterExecutionState, ParameterState, SupervisorResponse } from '#types';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { CheckCircle, Error, Warning } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from '../Parameter';
import ParameterVerificationView from '../Verification/ParameterVerificationView';
import { Wrapper } from './styles';
import { InputTypes } from '#utils/globalTypes';

const generateText = (label: string | undefined, data: any) => {
  if (data.operator === 'BETWEEN') {
    return `${label} should be between ${data.lowerValue} ${data.uom} and ${data.upperValue} ${data.uom}`;
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

    return `${label} should be ${operatorString} ${data?.value ?? 50} ${data.uom}`;
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
        if (!(observedValue >= desiredValue1 && observedValue <= desiredValue2)) {
          return true;
        }
      default:
        return false;
    }
  }
};

const ShouldBeParameter: FC<
  ParameterProps & {
    verificationsByType: any;
    verificationType: string;
  }
> = ({
  parameter,
  isCorrectingError,
  verificationType,
  verificationsByType,
  isLoggedInUserAssigned,
}) => {
  const {
    auth: { profile, selectedFacility },
  } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  const numberInputRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useDispatch();

  const [state, setState] = useState({
    approvalTime: parameter?.response?.parameterValueApprovalDto?.createdAt,
    approver: parameter?.response?.parameterValueApprovalDto?.approver,
    isApprovalPending: parameter?.response?.state === 'PENDING_FOR_APPROVAL',
    isApproved: parameter?.response?.parameterValueApprovalDto
      ? parameter?.response?.parameterValueApprovalDto?.state === 'APPROVED'
      : undefined,
    isExecuted: parameter?.response?.state === 'EXECUTED',
    isOffLimit: checkIsOffLimit({
      observedValue: parseFloat(parameter?.response?.value) ?? null,
      operator: parameter?.data?.operator,
      ...(parameter?.data?.operator === 'BETWEEN'
        ? {
            desiredValue1: parseFloat(parameter?.data?.lowerValue),
            desiredValue2: parseFloat(parameter?.data?.upperValue),
          }
        : { desiredValue1: parseFloat(parameter?.data?.value) }),
    }),
    isUserAuthorisedForApproval: profile?.roles?.some((role) =>
      [roles.SUPERVISOR, roles.FACILITY_ADMIN, roles.CHECKLIST_PUBLISHER].includes(role.name),
    ),
    isValueChanged: false,
    reason: parameter?.response?.reason ?? '',
    value: parameter?.response?.value ?? null,
    shouldCallApi: false,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      approvalTime: parameter?.response?.parameterValueApprovalDto?.createdAt,
      approver: parameter?.response?.parameterValueApprovalDto?.approver,
      isApprovalPending:
        parameter?.response?.state === ParameterExecutionState.PENDING_FOR_APPROVAL,
      isApproved: parameter?.response?.parameterValueApprovalDto
        ? parameter?.response?.parameterValueApprovalDto?.state === 'APPROVED'
        : undefined,
      isExecuted: parameter?.response?.state === 'EXECUTED',
      isOffLimit: checkIsOffLimit({
        observedValue:
          prevState.value !== parameter?.response?.value
            ? prevState.value
            : parseFloat(parameter?.response?.value) ?? null,
        operator: parameter?.data?.operator,
        ...(parameter?.data?.operator === 'BETWEEN'
          ? {
              desiredValue1: parseFloat(parameter?.data?.lowerValue),
              desiredValue2: parseFloat(parameter?.data?.upperValue),
            }
          : { desiredValue1: parseFloat(parameter?.data?.value) }),
      }),
      isValueChanged: prevState.value !== parameter?.response?.value,
      reason:
        prevState.reason !== parameter?.response?.reason
          ? prevState.reason
          : parameter?.response?.reason ?? '',
      value:
        prevState.value !== parameter?.response?.value
          ? prevState.value
          : parameter?.response?.value ?? null,
    }));
  }, [parameter]);

  useEffect(() => {
    if (state.shouldCallApi) {
      if (state.value || state.reason) {
        if (isCorrectingError) {
          dispatch(
            jobActions.fixParameter({
              parameter: {
                ...parameter,
                data: { ...parameter.data, input: state.value },
              },
              reason: state.reason,
            }),
          );
        } else {
          dispatch(
            jobActions.executeParameter({
              parameter: {
                ...parameter,
                data: { ...parameter.data, input: state.value },
              },
              reason: state.reason,
            }),
          );
        }
      }
      setState((prev) => ({
        ...prev,
        shouldCallApi: false,
      }));
    }
  }, [parameter?.response?.value, parameter?.response?.reason, state.shouldCallApi]);

  const renderSubmitButtons = () => (
    <div className="buttons-container">
      <Button
        variant="secondary"
        color="blue"
        onClick={() => handleExecution(state.value, true)}
        disabled={state.isApprovalPending}
      >
        Submit
      </Button>
      <Button
        variant="secondary"
        color="red"
        onClick={() => {
          setState((prevState) => ({
            ...prevState,
            isOffLimit: checkIsOffLimit({
              observedValue: parseFloat(parameter?.response?.value) ?? null,
              operator: parameter?.data?.operator,
              ...(parameter?.data?.operator === 'BETWEEN'
                ? {
                    desiredValue1: parseFloat(parameter?.data?.lowerValue),
                    desiredValue2: parseFloat(parameter?.data?.upperValue),
                  }
                : { desiredValue1: parseFloat(parameter?.data?.value) }),
            }),
            value: parameter?.response?.value,
            reason: parameter?.response?.reason,
            isValueChanged: false,
          }));
          if (numberInputRef && numberInputRef.current) {
            numberInputRef.current.value = parameter?.response?.value;
          }
          if (reasonRef && reasonRef.current) {
            reasonRef.current.value = parameter?.response?.reason;
          }
        }}
        disabled={state.isApprovalPending}
      >
        Cancel
      </Button>
    </div>
  );

  const renderApprovalButtons = () => (
    <div className="buttons-container">
      <Button
        variant="secondary"
        color="blue"
        onClick={() => {
          dispatch(
            jobActions.approveRejectParameter({
              parameterId: parameter.id,
              type: SupervisorResponse.APPROVE,
            }),
          );
        }}
      >
        Approve
      </Button>
      <Button
        variant="secondary"
        color="red"
        onClick={() => {
          dispatch(
            jobActions.approveRejectParameter({
              parameterId: parameter.id,
              type: SupervisorResponse.REJECT,
            }),
          );
        }}
      >
        Reject
      </Button>
    </div>
  );

  const handleExecution = (value: number, withReason = false) => {
    // dispatch(
    //   updateExecutedParameter({
    //     ...parameter,
    //     response: {
    //       ...parameter.response,
    //       ...(value !== parameter.response.value && { audit: undefined }),
    //       value,
    //       reason: state.reason,
    //       state: state.reason
    //         ? ParameterExecutionState.PENDING_FOR_APPROVAL
    //         : ParameterExecutionState.EXECUTED,
    //     },
    //   }),
    // );
    setState((prevState) => ({
      ...prevState,
      shouldCallApi: true,
    }));
  };

  return (
    <Wrapper data-id={parameter.id} data-type={parameter.type}>
      <div
        className="parameter-content"
        style={state.isApprovalPending ? { pointerEvents: 'none' } : {}}
      >
        {state.isApprovalPending ? (
          <span className="pending-approval">
            <Warning className="icon" />
            {state.isUserAuthorisedForApproval
              ? 'This Parameter Needs Approval'
              : 'Pending Approval from Supervisor'}
          </span>
        ) : null}

        {state.isApproved === true ? (
          <span className="approved">
            <CheckCircle className="icon" />
            Observation Approved by {getFullName(state.approver)} on{' '}
            {formatDateTime(state.approvalTime, dateAndTimeStampFormat)}
          </span>
        ) : state.isApproved === false ? (
          <span className="rejected">
            <Error className="icon" />
            Observation rejected by {getFullName(state.approver)} on{' '}
            {formatDateTime(state.approvalTime, dateAndTimeStampFormat)}
          </span>
        ) : null}

        <span className="parameter-text" data-for={parameter.id}>
          {generateText(parameter?.label, parameter?.data)}
        </span>

        <TextInput
          type={InputTypes.NUMBER}
          defaultValue={state.value!}
          onChange={debounce(({ value }) => {
            setState((prevState) => ({
              ...prevState,
              value,
              isValueChanged: prevState.value !== value,
            }));
            switch (parameter?.data?.operator) {
              case 'EQUAL_TO':
                if (!(parseFloat(value) === parseFloat(parameter?.data?.value))) {
                  setState((prevState) => ({ ...prevState, isOffLimit: true }));
                } else {
                  handleExecution(value);
                }
                break;
              case 'LESS_THAN':
                if (!(parseFloat(value) < parseFloat(parameter?.data?.value))) {
                  setState((prevState) => ({ ...prevState, isOffLimit: true }));
                } else {
                  handleExecution(value);
                }
                break;
              case 'LESS_THAN_EQUAL_TO':
                if (!(parseFloat(value) <= parseFloat(parameter?.data?.value))) {
                  setState((prevState) => ({ ...prevState, isOffLimit: true }));
                } else {
                  handleExecution(value);
                }
                break;
              case 'MORE_THAN':
                if (!(parseFloat(value) > parseFloat(parameter?.data?.value))) {
                  setState((prevState) => ({ ...prevState, isOffLimit: true }));
                } else {
                  handleExecution(value);
                }
                break;
              case 'MORE_THAN_EQUAL_TO':
                if (!(parseFloat(value) >= parseFloat(parameter?.data?.value))) {
                  setState((prevState) => ({ ...prevState, isOffLimit: true }));
                } else {
                  handleExecution(value);
                }
                break;
              case 'BETWEEN':
                if (
                  !(
                    parseFloat(value) >= parseFloat(parameter?.data?.lowerValue) &&
                    parseFloat(value) <= parseFloat(parameter?.data?.upperValue)
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
      </div>

      {state.isOffLimit ? (
        <div className="off-limit-reason">
          <div className="warning">Warning! {generateText(parameter?.label, parameter?.data)}</div>

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
            if (state.isUserAuthorisedForApproval && state.isApprovalPending) {
              return renderApprovalButtons();
            } else if (state.isValueChanged) {
              return renderSubmitButtons();
            }
          })()}
        </div>
      ) : null}

      <ParameterVerificationView
        parameterState={
          state.isOffLimit && state.isValueChanged
            ? ParameterState.NOT_STARTED
            : parameter.response!.state!
        }
        verificationsByType={verificationsByType}
        verificationType={verificationType}
        isLoggedInUserAssigned={!!isLoggedInUserAssigned}
        parameterId={parameter.id}
        modifiedBy={parameter.response?.audit?.modifiedBy?.id}
      />
    </Wrapper>
  );
};

export default ShouldBeParameter;
