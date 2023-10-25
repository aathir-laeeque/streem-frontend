import PadLockIcon from '#assets/svg/padlock.svg';
import { Button, TextInput, Textarea } from '#components';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store';
import { ParameterState, SupervisorResponse } from '#types';
import { InputTypes } from '#utils/globalTypes';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { CheckCircle, Error, Warning } from '@material-ui/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from '../Parameter';
import ParameterVerificationView from '../Verification/ParameterVerificationView';
import { Wrapper } from './styles';
import { generateShouldBeText } from '#utils/stringUtils';
import { debounce } from 'lodash';

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
    auth: { profile },
    job: { updating },
  } = useTypedSelector((state) => state);

  const numberInputRef = useRef<HTMLInputElement>(null);
  const debounceInputRef = useRef(debounce((event, functor) => functor(event), 2000));

  const dispatch = useDispatch();

  const [state, setState] = useState({
    approvalTime: parameter?.response?.parameterValueApprovalDto?.createdAt,
    approver: parameter?.response?.parameterValueApprovalDto?.approver,
    isApprovalPending: parameter?.response?.state === ParameterState.PENDING_FOR_APPROVAL,
    isVerificationPending: parameter?.response?.state === ParameterState.APPROVAL_PENDING,
    isApproved: parameter?.response?.parameterValueApprovalDto
      ? parameter?.response?.parameterValueApprovalDto?.state === ParameterState.APPROVED
      : undefined,

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
    value: parameter?.response?.value ?? null,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      approvalTime: parameter?.response?.parameterValueApprovalDto?.createdAt,
      approver: parameter?.response?.parameterValueApprovalDto?.approver,
      isApprovalPending: parameter?.response?.state === ParameterState.PENDING_FOR_APPROVAL,
      isVerificationPending: parameter?.response?.state === ParameterState.APPROVAL_PENDING,
      isApproved: parameter?.response?.parameterValueApprovalDto
        ? parameter?.response?.parameterValueApprovalDto?.state === ParameterState.APPROVED
        : undefined,
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
      value:
        prevState.value !== parameter?.response?.value
          ? prevState.value
          : parameter?.response?.value ?? null,
    }));
  }, [parameter]);

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

  const deviationValueHandler = (value: string) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.REASON_MODAL,
        props: {
          modalTitle: 'State your Reason',
          modalDesc: `Warning! ${generateShouldBeText(parameter?.label, parameter?.data)}`,
          onSubmitHandler: (reason: string) => {
            dispatchActions(value, reason);
            dispatch(closeOverlayAction(OverlayNames.REASON_MODAL));
          },
          onCancelHandler: () => {
            setState((prevState) => ({
              ...prevState,
              value: parameter.response.value!,
            }));
            numberInputRef.current!.value = parameter.response.value!;
          },
        },
      }),
    );
  };

  useEffect(() => {
    if (!updating && parameter.response.value !== state.value) {
      setState((prevState) => ({
        ...prevState,
        value: parameter.response.value!,
      }));
      numberInputRef.current!.value = parameter.response.value!;
    }
  }, [parameter.response.value, updating]);

  const dispatchActions = (value: string, reason: string = '') => {
    if (isCorrectingError) {
      dispatch(
        jobActions.fixParameter({
          parameter: {
            ...parameter,
            data: { ...parameter.data, input: value },
          },
          reason: reason,
        }),
      );
    } else {
      dispatch(
        jobActions.executeParameter({
          parameter: {
            ...parameter,
            data: { ...parameter.data, input: value },
          },
          reason: reason,
        }),
      );
    }
  };

  const onChangeHandler = ({ value }: { value: string }) => {
    debounceInputRef.current(value, (value: string) => {
      setState((prevState) => ({
        ...prevState,
        value,
        isValueChanged: prevState.value !== value,
      }));
      if (value) {
        switch (parameter?.data?.operator) {
          case 'EQUAL_TO':
            if (!(parseFloat(value) === parseFloat(parameter?.data?.value))) {
              setState((prevState) => ({ ...prevState, isOffLimit: true }));
              deviationValueHandler(value);
            } else {
              dispatchActions(value);
            }
            break;
          case 'LESS_THAN':
            if (!(parseFloat(value) < parseFloat(parameter?.data?.value))) {
              setState((prevState) => ({ ...prevState, isOffLimit: true }));
              deviationValueHandler(value);
            } else {
              dispatchActions(value);
            }
            break;
          case 'LESS_THAN_EQUAL_TO':
            if (!(parseFloat(value) <= parseFloat(parameter?.data?.value))) {
              setState((prevState) => ({ ...prevState, isOffLimit: true }));
              deviationValueHandler(value);
            } else {
              dispatchActions(value);
            }
            break;
          case 'MORE_THAN':
            if (!(parseFloat(value) > parseFloat(parameter?.data?.value))) {
              setState((prevState) => ({ ...prevState, isOffLimit: true }));
              deviationValueHandler(value);
            } else {
              dispatchActions(value);
            }
            break;
          case 'MORE_THAN_EQUAL_TO':
            if (!(parseFloat(value) >= parseFloat(parameter?.data?.value))) {
              setState((prevState) => ({ ...prevState, isOffLimit: true }));
              deviationValueHandler(value);
            } else {
              dispatchActions(value);
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
              deviationValueHandler(value);
            } else {
              dispatchActions(value);
            }
            break;
          default:
            setState((prevState) => ({ ...prevState, isOffLimit: false }));
        }
      } else {
        dispatchActions(value);
      }
    });
  };

  return (
    <Wrapper data-id={parameter.id} data-type={parameter.type}>
      <div
        className="parameter-content"
        style={
          state.isApprovalPending || state.isVerificationPending ? { pointerEvents: 'none' } : {}
        }
      >
        {state.isApprovalPending ? (
          <span className="pending-approval">
            <Warning className="icon" />
            {state.isUserAuthorisedForApproval
              ? 'This Parameter Needs Approval'
              : 'Pending for Approval'}
          </span>
        ) : null}

        {state.isApproved === true ? (
          <span className="approved">
            <CheckCircle className="icon" />
            Observation Approved by {getFullName(state.approver)} on{' '}
            {formatDateTime({ value: state.approvalTime! })}
          </span>
        ) : state.isApproved === false ? (
          <span className="rejected">
            <Error className="icon" />
            Observation rejected by {getFullName(state.approver)} on{' '}
            {formatDateTime({ value: state.approvalTime! })}
          </span>
        ) : null}

        <span className="parameter-text" data-for={parameter.id}>
          {state.isVerificationPending && (
            <img src={PadLockIcon} alt="parameter-locked" style={{ marginRight: 8 }} />
          )}
          {generateShouldBeText(parameter?.label, parameter?.data)}
        </span>
        <TextInput
          type={InputTypes.NUMBER}
          defaultValue={state.value!}
          onChange={onChangeHandler}
          placeholder="Enter Observed Value"
          ref={numberInputRef}
        />
      </div>

      {state.isOffLimit ? (
        <div className="off-limit-reason">
          {parameter?.response?.reason && (
            <Textarea
              value={parameter.response.reason}
              disabled={true}
              label="Reason"
              placeholder="Reason for change"
              rows={4}
            />
          )}
          {(() => {
            if (state.isUserAuthorisedForApproval && state.isApprovalPending) {
              return renderApprovalButtons();
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
