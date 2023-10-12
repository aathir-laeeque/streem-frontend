import PadLockIcon from '#assets/svg/padlock.svg';
import { MandatoryParameter, NonMandatoryParameter, ParameterState, StoreParameter } from '#types';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { Verification } from '#views/Jobs/ListView/types';
import { Error } from '@material-ui/icons';
import { capitalize, keyBy } from 'lodash';
import React, { FC } from 'react';
import CalculationParameter from './Calculation';
import ChecklistParameter from './Checklist';
import FileUploadParameter from './FileUpload';
import InputParameter from './Input';
import InstructionParameter from './Instruction';
import MaterialParameter from './Material';
import ImageCaptureParameter from './ImageCapture';
import MultiSelectParameter from './MultiSelect';
import ResourceParameter from './Resource';
import ShouldBeParameter from './ShouldBe';
import SignatureParameter from './Signature';
import ParameterVerificationView from './Verification/ParameterVerificationView';
import YesNoParameter from './YesNo';

export type ParameterProps = {
  parameter: StoreParameter;
  isCorrectingError: boolean;
  isTaskCompleted?: boolean;
  isLoggedInUserAssigned?: boolean;
  errors?: string[];
};

const Parameter: FC<ParameterProps> = ({
  parameter,
  isCorrectingError,
  isLoggedInUserAssigned,
  isTaskCompleted,
  errors,
}) => {
  const { state, audit, parameterVerifications } = parameter.response!;

  const { verificationType } = parameter;
  const verificationsByType = keyBy<Verification>(parameterVerifications || [], 'verificationType');

  return (
    <div key={parameter.id} className="parameter">
      {parameter.type in MandatoryParameter && !parameter.mandatory && (
        <div className="optional-badge">Optional</div>
      )}

      {errors && (
        <div className="error-badge">
          <Error className="icon" />
          <span>{capitalize(errors)}</span>
        </div>
      )}

      {parameter?.label &&
        ![
          `${MandatoryParameter.YES_NO}`,
          `${MandatoryParameter.SHOULD_BE}`,
          `${MandatoryParameter.CALCULATION}`,
        ].includes(parameter.type) && (
          <div className="parameter-label" data-for={parameter.id}>
            {[ParameterState.APPROVAL_PENDING].includes(state) && (
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
            {...([ParameterState.APPROVAL_PENDING].includes(state) && {
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
                    <ImageCaptureParameter
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

                case MandatoryParameter.SINGLE_LINE:
                case MandatoryParameter.MULTI_LINE:
                case MandatoryParameter.NUMBER:
                case MandatoryParameter.DATE_TIME:
                case MandatoryParameter.DATE:
                  return (
                    <InputParameter parameter={parameter} isCorrectingError={isCorrectingError} />
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
