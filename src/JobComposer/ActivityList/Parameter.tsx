import { Parameter, ParameterExecutionState } from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { Verification } from '#views/Jobs/ListView/types';
import { Error } from '@material-ui/icons';
import { keyBy, capitalize } from 'lodash';
import React, { FC } from 'react';
import PadLockIcon from 'src/assets/svg/padlock.svg';
import { MandatoryParameter, NonMandatoryParameter } from '../checklist.types';
import CalculationParameter from './Calculation';
import ChecklistParameter from './Checklist';
import DateParameter from './Date';
import InstructionParameter from './Instruction';
import MaterialParameter from './Material';
import MediaParameter from './Media';
import MultiSelectParameter from './MultiSelect';
import NumberParameter from './Number';
import ResourceParameter from './Resource';
import ShouldBeParameter from './ShouldBe';
import SignatureParameter from './Signature';
import TextboxParameter from './Textbox';
import YesNoParameter from './YesNo';
import ParameterVerificationView from './Verification/ParameterVerificationView';
import FileUploadParameter from './FileUpload';
import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';

const Parameter: FC<{
  parameter: Parameter;
  isTaskCompleted: boolean;
  isCorrectingError: boolean;
  isLoggedInUserAssigned: boolean;
}> = ({ parameter, isCorrectingError, isLoggedInUserAssigned, isTaskCompleted }) => {
  const {
    composer: {
      parameters: { hiddenIds },
    },
  } = useTypedSelector((state) => state);

  const parameterHasVerificationEnabled =
    parameter.verificationType !== ParameterVerificationTypeEnum.NONE;

  const { state, audit, parameterVerifications } = parameter?.response;
  const { verificationType } = parameter;
  const verificationsByType = keyBy<Verification>(parameterVerifications || [], 'verificationType');
  if (hiddenIds?.[parameter.id]) return null;

  return (
    <div
      key={parameter.id}
      className="parameter"
      style={
        isCorrectingError ? (parameterHasVerificationEnabled ? { pointerEvents: 'none' } : {}) : {}
      }
    >
      {parameter.type in MandatoryParameter && !parameter.mandatory && (
        <div className="optional-badge">Optional</div>
      )}

      {parameter.hasError && (
        <div className="error-badge">
          <Error className="icon" />
          <span>{capitalize(parameter?.errorMessage || '')}</span>
        </div>
      )}

      {parameter?.label &&
        ![
          `${MandatoryParameter.YES_NO}`,
          `${MandatoryParameter.SHOULD_BE}`,
          `${MandatoryParameter.CALCULATION}`,
        ].includes(parameter.type) && (
          <div className="parameter-label" data-for={parameter.id}>
            {[ParameterExecutionState.APPROVAL_PENDING].includes(state) && (
              <img src={PadLockIcon} alt="parameter-locked" style={{ marginRight: 8 }} />
            )}
            {parameter.label}
          </div>
        )}

      {[`${MandatoryParameter.YES_NO}`, `${MandatoryParameter.SHOULD_BE}`].includes(
        parameter.type,
      ) ? (
        <>
          {parameter.type === MandatoryParameter.SHOULD_BE ? (
            <ShouldBeParameter
              isLoggedInUserAssigned={isLoggedInUserAssigned}
              verificationType={verificationType}
              parameter={parameter}
              verificationsByType={verificationsByType}
              isCorrectingError={isCorrectingError}
            />
          ) : (
            <YesNoParameter
              parameter={parameter}
              isCorrectingError={isCorrectingError}
              verificationsByType={verificationsByType}
              verificationType={verificationType}
              isLoggedInUserAssigned={isLoggedInUserAssigned}
            />
          )}
        </>
      ) : (
        <>
          <div
            {...([ParameterExecutionState.APPROVAL_PENDING].includes(state) && {
              style: {
                pointerEvents: 'none',
              },
            })}
          >
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
                case MandatoryParameter.FILE_UPLOAD:
                  return (
                    <FileUploadParameter
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

                case MandatoryParameter.MULTI_RESOURCE:
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
          </div>

          <ParameterVerificationView
            parameterState={state}
            verificationsByType={verificationsByType}
            verificationType={verificationType}
            isLoggedInUserAssigned={isLoggedInUserAssigned}
            parameterId={parameter.id}
            modifiedBy={audit?.modifiedBy?.id}
          />
        </>
      )}

      {state !== 'NOT_STARTED' ? (
        <div className="parameter-audit">
          {audit
            ? audit.modifiedBy && (
                <>
                  Last updated by {getFullName(audit.modifiedBy)}, ID: {audit.modifiedBy.employeeId}{' '}
                  on {formatDateTime(audit.modifiedAt)}
                </>
              )
            : 'Updating...'}
        </div>
      ) : null}
    </div>
  );
};

export default Parameter;
