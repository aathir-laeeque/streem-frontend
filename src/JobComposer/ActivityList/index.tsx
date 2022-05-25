import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { Error } from '@material-ui/icons';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { MandatoryActivity, NonMandatoryActivity } from '../checklist.types';
import ChecklistActivity from './Checklist';
import InstructionActivity from './Instruction';
import MaterialActivity from './Material';
import MediaActivity from './Media';
import MultiSelectActivity from './MultiSelect';
import ShouldBeActivity from './ShouldBe';
import SignatureActivity from './Signature';
import TextboxActivity from './Textbox';
import { ActivityListProps } from './types';
import YesNoActivity from './YesNo';

const Wrapper = styled.div.attrs({
  className: 'activity-list',
})<Omit<ActivityListProps, 'activities'>>`
  display: flex;
  flex-direction: column;

  ${({ isTaskStarted }) =>
    !isTaskStarted
      ? css`
          pointer-events: none;
        `
      : null}

  .activity {
    border-bottom: 1px dashed #dadada;
    padding: 16px;

    :last-child {
      border-bottom: none;
    }

    .checklist-activity,
    .material-activity,
    .should-be-activity,
    .yes-no-activity,
    .textbox-activity {
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

    .activity-audit {
      color: #999999;
      font-size: 12px;
      line-height: 0.83;
      margin-top: 16px;
    }
  }
`;

const ActivityList: FC<ActivityListProps> = ({
  activities,
  isTaskStarted,
  isTaskCompleted,
  isCorrectingError,
  isLoggedInUserAssigned,
}) => {
  const {
    auth: { selectedFacility },
    composer: { entity },
  } = useTypedSelector((state) => state);
  const { dateAndTimeStampFormat } = useTypedSelector(
    (state) => state.facilityWiseConstants[selectedFacility!.id],
  );

  return (
    <Wrapper
      isTaskStarted={isTaskStarted}
      isTaskCompleted={isTaskCompleted}
      isLoggedInUserAssigned={isLoggedInUserAssigned}
      isCorrectingError={isCorrectingError}
    >
      {activities.map((activity) => {
        const { state, audit } = activity?.response;

        return (
          <div key={activity.id} className="activity">
            {entity === Entity.JOB ? (
              activity.type in MandatoryActivity && !activity.mandatory ? (
                <div className="optional-badge">Optional</div>
              ) : null
            ) : null}

            {activity.hasError ? (
              <div className="error-badge">
                <Error className="icon" />
                <span>Mandatory Activity Incomplete</span>
              </div>
            ) : null}

            {(() => {
              switch (activity.type) {
                case MandatoryActivity.CHECKLIST:
                  return (
                    <ChecklistActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case NonMandatoryActivity.INSTRUCTION:
                  return (
                    <InstructionActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case NonMandatoryActivity.MATERIAL:
                  return (
                    <MaterialActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryActivity.MEDIA:
                  return (
                    <MediaActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                      isTaskCompleted={
                        isTaskCompleted || !isLoggedInUserAssigned
                      }
                    />
                  );

                case MandatoryActivity.MULTISELECT:
                case MandatoryActivity.SINGLE_SELECT:
                  return (
                    <MultiSelectActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                      isMulti={activity.type === MandatoryActivity.MULTISELECT}
                    />
                  );

                case MandatoryActivity.SHOULD_BE:
                case MandatoryActivity.PARAMETER:
                  return (
                    <ShouldBeActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryActivity.SIGNATURE:
                  return (
                    <SignatureActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                      isTaskCompleted={
                        isTaskCompleted || !isLoggedInUserAssigned
                      }
                    />
                  );

                case MandatoryActivity.TEXTBOX:
                  return (
                    <TextboxActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryActivity.YES_NO:
                  return (
                    <YesNoActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                default:
                  return null;
              }
            })()}

            {state !== 'NOT_STARTED' ? (
              <div className="activity-audit">
                {audit ? (
                  <>
                    Last updated by {getFullName(audit?.modifiedBy)}, ID:{' '}
                    {audit?.modifiedBy?.employeeId} on{' '}
                    {formatDateTime(audit?.modifiedAt, 'MMM D, YYYY h:mm A')}
                  </>
                ) : (
                  'Updating...'
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default ActivityList;
