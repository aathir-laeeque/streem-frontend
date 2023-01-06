import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { Error } from '@material-ui/icons';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { MandatoryParameter, NonMandatoryParameter } from '../checklist.types';
import CalculationParameter from './Calculation';
import ChecklistParameter from './Checklist';
import InstructionParameter from './Instruction';
import MaterialParameter from './Material';
import MediaParameter from './Media';
import MultiSelectParameter from './MultiSelect';
import NumberParameter from './Number';
import ShouldBeParameter from './ShouldBe';
import SignatureParameter from './Signature';
import TextboxParameter from './Textbox';
import { ParameterListProps } from './types';
import YesNoParameter from './YesNo';
import ResourceParameter from './Resource';
import DateParameter from './Date';

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
    border-bottom: 1px dashed #dadada;
    padding: 16px;

    :last-child {
      border-bottom: none;
    }

    .checklist-parameter,
    .material-parameter,
    .should-be-parameter,
    .yes-no-parameter,
    .textbox-parameter,
    .number-parameter,
    .date-parameter,
    .calculation-parameter {
      ${({ isTaskCompleted, isCorrectingError, isLoggedInUserAssigned }) =>
        (isTaskCompleted && !isCorrectingError) || !isLoggedInUserAssigned
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
      margin-top: 16px;
    }

    .calculation-parameter {
      display: flex;
      flex-direction: column;

      .head {
        opacity: 0.6;
        margin-bottom: 16px;
      }

      .expression {
        margin-bottom: 24px;
      }

      .variable {
        display: flex;
        margin-bottom: 4px;
        gap: 8px;
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
      margin-bottom: 16px;
    }
  }
`;

const ParameterList: FC<ParameterListProps> = ({
  parameters,
  isTaskStarted,
  isTaskCompleted,
  isCorrectingError,
  isLoggedInUserAssigned,
}) => {
  const {
    composer: {
      entity,
      parameters: { hiddenIds },
    },
  } = useTypedSelector((state) => state);

  return (
    <Wrapper
      isTaskStarted={isTaskStarted}
      isTaskCompleted={isTaskCompleted}
      isLoggedInUserAssigned={isLoggedInUserAssigned}
      isCorrectingError={isCorrectingError}
    >
      {parameters.map((parameter) => {
        const { state, audit } = parameter?.response;
        if (hiddenIds?.[parameter.id]) return null;
        return (
          <div key={parameter.id} className="parameter">
            {entity === Entity.JOB ? (
              parameter.type in MandatoryParameter && !parameter.mandatory ? (
                <div className="optional-badge">Optional</div>
              ) : null
            ) : null}

            {parameter.hasError ? (
              <div className="error-badge">
                <Error className="icon" />
                <span>Mandatory Parameter Incomplete</span>
              </div>
            ) : null}

            {parameter?.label &&
              ![
                `${MandatoryParameter.YES_NO}`,
                `${MandatoryParameter.SHOULD_BE}`,
                `${MandatoryParameter.CALCULATION}`,
              ].includes(parameter.type) && (
                <div className="parameter-label">{parameter.label}</div>
              )}

            {(() => {
              switch (parameter.type) {
                case MandatoryParameter.CHECKLIST:
                  return (
                    <ChecklistParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case NonMandatoryParameter.INSTRUCTION:
                  return (
                    <InstructionParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case NonMandatoryParameter.MATERIAL:
                  return (
                    <MaterialParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryParameter.MEDIA:
                  return (
                    <MediaParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                      isTaskCompleted={isTaskCompleted}
                      isLoggedInUserAssigned={isLoggedInUserAssigned}
                    />
                  );

                case MandatoryParameter.MULTISELECT:
                case MandatoryParameter.SINGLE_SELECT:
                  return (
                    <MultiSelectParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                      isMulti={parameter.type === MandatoryParameter.MULTISELECT}
                    />
                  );

                case MandatoryParameter.SHOULD_BE:
                  return (
                    <ShouldBeParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryParameter.SIGNATURE:
                  return (
                    <SignatureParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                      isTaskCompleted={isTaskCompleted || !isLoggedInUserAssigned}
                    />
                  );

                case MandatoryParameter.SINGLE_LINE:
                case MandatoryParameter.MULTI_LINE:
                  return (
                    <TextboxParameter parameter={parameter} isCorrectingError={isCorrectingError} />
                  );

                case MandatoryParameter.YES_NO:
                  return (
                    <YesNoParameter parameter={parameter} isCorrectingError={isCorrectingError} />
                  );

                case MandatoryParameter.NUMBER:
                  return (
                    <NumberParameter parameter={parameter} isCorrectingError={isCorrectingError} />
                  );

                case MandatoryParameter.CALCULATION:
                  return (
                    <CalculationParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                      isTaskCompleted={isTaskCompleted || !isLoggedInUserAssigned}
                    />
                  );

                case MandatoryParameter.RESOURCE:
                  return (
                    <ResourceParameter
                      parameter={parameter}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryParameter.DATE_TIME:
                case MandatoryParameter.DATE:
                  return (
                    <DateParameter parameter={parameter} isCorrectingError={isCorrectingError} />
                  );

                default:
                  return null;
              }
            })()}

            {state !== 'NOT_STARTED' ? (
              <div className="parameter-audit">
                {audit
                  ? audit.modifiedBy && (
                      <>
                        Last updated by {getFullName(audit.modifiedBy)}, ID:{' '}
                        {audit.modifiedBy.employeeId} on {formatDateTime(audit.modifiedAt)}
                      </>
                    )
                  : 'Updating...'}
              </div>
            ) : null}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default ParameterList;
