import { Entity } from '#Composer/composer.types';
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
import MultiSelectActivity from './MultiSelect';
import ShouldBeActivity from './ShouldBe';
import SignatureActivity from './Signature';
import TextboxActivity from './Textbox';
import { ActivityListProps } from './types';
import YesNoActivity from './YesNo';

const Wrapper = styled.div.attrs({
  className: 'activity-list',
})`
  display: flex;
  flex-direction: column;

  ${({ isTaskStarted }) =>
    !isTaskStarted
      ? css`
          opacity: 0.5;
          pointer-events: none;
        `
      : null}

  ${({ isCompletedWithException }) =>
    isCompletedWithException
      ? css`
          opacity: 0.5;
          pointer-events: none;
        `
      : null}

  ${({ isTaskCompleted }) =>
    isTaskCompleted
      ? css`
          pointer-events: none;
        `
      : null}

  .activity {
    border-bottom: 1px dashed #dadada;
    padding: 32px;

    :last-child {
      border-bottom: none;
      /* padding-bottom: 0; */
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
  isCompletedWithException,
  isCorrectingError,
}) => {
  const { entity } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper
      isTaskStarted={isTaskStarted}
      isTaskCompleted={isTaskCompleted}
      isCompletedWithException={isCompletedWithException}
    >
      {activities.map((activity) => {
        const { status, audit } = activity?.response;

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
                  return null;

                case MandatoryActivity.MULTISELECT:
                  return (
                    <MultiSelectActivity
                      activity={activity}
                      isCorrectingError={isCorrectingError}
                    />
                  );

                case MandatoryActivity.SHOULD_BE:
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

            {status !== 'NOT_STARTED' ? (
              <div className="activity-audit">
                Last updated by {getFullName(audit?.modifiedBy)}, ID:{' '}
                {audit?.modifiedBy?.employeeId} on{' '}
                {formatDateTime(audit?.modifiedAt, 'MMM D, h:mm A')}
              </div>
            ) : null}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default ActivityList;
