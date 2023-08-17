import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import Parameter from './Parameter';
import { ParameterListProps } from './types';

const Wrapper = styled.div.attrs({
  className: 'parameter-list',
})<Omit<ParameterListProps, 'parameters'>>`
  display: flex;
  flex-direction: column;

  ${({ isTaskStarted }) =>
    !isTaskStarted
      ? css`
          pointer-events: none;
        `
      : null}

  .parameter {
    padding: 14px 16px;

    :last-child {
      border-bottom: none;
    }

    .checklist-parameter,
    .material-parameter,
    .should-be-parameter > .parameter-content,
    .yes-no-parameter,
    .textbox-parameter,
    .number-parameter,
    .date-parameter,
    .calculation-parameter,
    .signature-interaction,
    .parameter-media {
      ${({ isTaskCompleted, isCorrectingError, isJobInInbox }) =>
        (isTaskCompleted && !isCorrectingError) || !isJobInInbox
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
      margin-bottom: 8px;
      color: #525252;
      font-weight: 400;
      font-size: 14px;
      line-height: 12px;
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
  parameters,
  isTaskStarted,
  isTaskCompleted,
  isCorrectingError,
  isLoggedInUserAssigned,
  isJobInInbox,
}) => {
  return (
    <Wrapper
      isTaskStarted={isTaskStarted}
      isTaskCompleted={isTaskCompleted}
      isLoggedInUserAssigned={isLoggedInUserAssigned}
      isCorrectingError={isCorrectingError}
      isJobInInbox={isJobInInbox}
    >
      {parameters.map((parameter) => (
        <Parameter
          key={parameter.id}
          parameter={parameter}
          isTaskCompleted={isTaskCompleted}
          isLoggedInUserAssigned={isLoggedInUserAssigned}
          isCorrectingError={isCorrectingError}
        />
      ))}
    </Wrapper>
  );
};

export default ParameterList;
