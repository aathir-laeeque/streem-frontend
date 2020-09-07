import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import { Error } from '@material-ui/icons';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { ActivityType } from '../checklist.types';
import ChecklistActivity from './Checklist';
import InstructionActivity from './Instruction';
import MaterialActivity from './Material';
import MultiSelectActivity from './MultiSelect';
import ShouldBeActivity from './ShouldBe';
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
  }
`;

const ActivityList: FC<ActivityListProps> = ({
  activities,
  isTaskStarted,
  isTaskCompleted,
}) => {
  const { entity } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper isTaskStarted={isTaskStarted} isTaskCompleted={isTaskCompleted}>
      {activities.map((activity) => (
        <div key={activity.id} className="activity">
          {entity === Entity.JOB ? (
            activity.type !== ActivityType.INSTRUCTION &&
            activity.type !== ActivityType.MATERIAL &&
            !activity.mandatory ? (
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
              case ActivityType.CHECKLIST:
                return <ChecklistActivity activity={activity} />;

              case ActivityType.INSTRUCTION:
                return <InstructionActivity activity={activity} />;

              case ActivityType.MATERIAL:
                return <MaterialActivity activity={activity} />;

              case ActivityType.MEDIA:
                return null;

              case ActivityType.MULTISELECT:
                return <MultiSelectActivity activity={activity} />;

              case ActivityType.SHOULD_BE:
                return <ShouldBeActivity activity={activity} />;

              case ActivityType.SIGNATURE:
                return null;

              case ActivityType.TEXTBOX:
                return <TextboxActivity activity={activity} />;

              case ActivityType.YES_NO:
                return <YesNoActivity activity={activity} />;

              default:
                return null;
            }
          })()}
        </div>
      ))}
    </Wrapper>
  );
};

export default ActivityList;
