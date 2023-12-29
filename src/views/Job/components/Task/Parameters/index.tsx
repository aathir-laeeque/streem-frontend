import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import Parameter from './Parameter';
import { useJobStateToFlags } from '#views/Job/utils';

export type ParameterListProps = {
  parameterIds: string[];
  taskExecution: any;
  isTaskStarted?: boolean;
  isTaskCompleted?: boolean;
  isTaskPaused?: boolean;
  isCorrectingError: boolean;
  isUserAssignedToTask?: boolean;
  parametersErrors: Map<string, string[]>;
};

const Wrapper = styled.div.attrs({
  className: 'parameter-list',
})<
  {
    isInboxView: boolean;
    isReadOnly?: boolean;
  } & Omit<
    ParameterListProps,
    'parameterIds' | 'isUserAssignedToTask' | 'parametersErrors' | 'taskExecution'
  >
>`
  display: flex;
  flex-direction: column;

  ${({ isReadOnly }) =>
    isReadOnly
      ? css`
          pointer-events: none;
        `
      : null}

  .parameter {
    padding: 14px 16px;
    background-color: #f4f4f4;

    :last-child {
      border-bottom: none;
    }

    .checklist-parameter,
    .material-parameter,
    .should-be-parameter > .parameter-content,
    .yes-no-parameter,
    .input-parameter,
    .calculation-parameter,
    .signature-interaction {
      ${({ isTaskCompleted, isCorrectingError, isInboxView }) =>
        (isTaskCompleted && !isCorrectingError) || !isInboxView
          ? css`
              pointer-events: none;
            `
          : null}
    }

    .optional-badge {
      font-size: 14px;
      line-height: 1.43;
      letter-spacing: 0.16px;
      margin-bottom: 16px;
      color: #999999;
    }

    .error-badge {
      align-items: center;
      color: #ff6b6b;
      display: flex;
      font-size: 12px;
      margin-bottom: 16px;
      padding: 4px;

      > .icon {
        color: #ff6b6b;
        margin-right: 8px;
      }
    }

    .parameter-audit {
      color: #999999;
      font-size: 12px;
      line-height: 0.83;
      margin-top: 8px;

      span {
        color: #1d84ff;
        cursor: pointer;
      }
    }

    .parameter-verified {
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
    }

    .calculation-parameter {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;

      .head {
        opacity: 0.6;
        margin-bottom: 10px;
      }

      .expression {
        margin-bottom: 15px;
        margin-left: 12px;
      }

      .variable {
        display: flex;
        gap: 8px;
        margin-left: 12px;
        .name {
          font-weight: bold;
        }
      }

      .result {
        padding: 8px;
        background-color: rgba(29, 132, 255, 0.1);
      }
    }

    .parameter-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #161616;
      font-weight: 600;
      font-size: 14px;
      line-height: 12px;
    }

    .parameter-variation {
      color: #1d84ff;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .parameter-verification {
      padding-top: 14px;
      display: flex;
      align-items: center;
      gap: 10px;

      button {
        margin-right: 0px;
      }
    }
  }
`;

const ParameterList: FC<ParameterListProps> = ({
  parameterIds,
  taskExecution,
  isTaskStarted,
  isTaskCompleted,
  isTaskPaused,
  isCorrectingError,
  isUserAssignedToTask,
  parametersErrors,
}) => {
  const { isInboxView, parameters, parameterResponseById } = useTypedSelector((state) => state.job);
  const { isBlocked } = useJobStateToFlags();
  return (
    <Wrapper
      isReadOnly={!isTaskStarted || isTaskPaused || isBlocked}
      isTaskCompleted={isTaskCompleted}
      isCorrectingError={isCorrectingError}
      isInboxView={isInboxView}
    >
      {taskExecution?.parameterResponses?.map((parameterResponseId: string) => {
        const response = parameterResponseById.get(parameterResponseId);
        const _parameter = parameters.get(response?.parameterId);

        const parameter = { ..._parameter, response: response };
        if (!parameter || response?.hidden) return null;

        return (
          <Parameter
            key={parameterResponseId}
            parameter={parameter}
            isTaskCompleted={isTaskCompleted}
            isLoggedInUserAssigned={isUserAssignedToTask}
            isCorrectingError={isCorrectingError}
            errors={parametersErrors.get(parameter.response.id)}
          />
        );
      })}
    </Wrapper>
  );
};

export default ParameterList;
